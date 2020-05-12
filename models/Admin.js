const mongoose = require('mongoose'),
  md5 = require('md5-node');

//1.声明schema
let adminSchema = new mongoose.Schema({
  username: String, //用户名
  password: String, //密码
  posttime: Number, //注册时间
  lastLoginTime: Number //最后一次登录时间
});
//处理登录:
adminSchema.statics.checkLogin = function (json, callback) {
  this.checkUser(json.username, function (torf) {
    //  console.log(torf);
    //{username:xxxx,password:23ssfsa,posttime:234234,lastLoginTime:234234}
    if (torf.t) { //用户名对了
      if (md5(json.password) == torf.val.password) {
        callback(1); //登录成功;
        //实例调用的方法是动态方法
        torf.val.changelastLoginTime();
        // console.log(torf.val.changelastLoginTime());
        return;
      }
      callback(-1); //密码输入错误
    } else {
      callback(-2); //用户名不存在
    }
  })
}
//验证用户名是否存在
adminSchema.statics.checkUser = function (user, callback) {
  this.find({ 'username': user }, (err, results) => {
    if (err) {
      callback({ t: false, val: null });
      return;
    }
    if (results.length != 0) {
      callback({ t: true, val: results[0] });
      return;
    }
    callback({ t: false, val: null });
  })
}
//修改用户登录成功以后的登录时间
adminSchema.methods.changelastLoginTime = function () {
  var timeStemp = new Date().getTime();
  this.lastLoginTime = timeStemp;
  this.save();
}
// 添加管理员
adminSchema.statics.saveAdmin = function (data, callback) {
  console.log(data);
  let admin = new Admin(//-------
    data
  );
  admin.save(err => {
    if (err) {
      callback({ error: 0, msg: '保存失败' });
      return;
    }
    callback({ error: 1, msg: '保存成功' });
  });
}

//获取某一页管理员数据
adminSchema.statics.findPageData = async function (page, callback) {
  //分页:
  let pageSize = 4; //一页4条数据
  let start = (page - 1) * pageSize; //起始位置
  let count = await this.find().countDocuments(); //获取数据总条数
  this.find({}).sort({ 'sid': -1 }).skip(start).limit(pageSize).exec(function (err, results) {
    // console.log(results)
    if (err) {
      callback(null);
      return;
    }
    callback({
      results,
      count, //数据总条数
      length: Math.ceil(count / pageSize), //一共多少页
      now: page // 当前在那一页
    });
  })
}

// 删除管理员
adminSchema.statics.deleteAdmin = function (username, callback) {
  this.find({ username }, (err, results) => {
    console.log(results);
    // results [{_id:1212,name:xxx}]
    var somebody = results[0];
    somebody.remove(err => {
      if (err) {
        callback({ error: 0, msg: '删除失败' });
        return;
      }
      callback({ error: 1, msg: '删除成功' });
    })
  })
}
// 查找要修改的管理员信息
adminSchema.statics.findOneData = function (_id, callback) {
  this.find({ _id }, (err, results) => {
    // console.log(results);
    // results [{_id:1212,name:xxx}]
      if (err) {
        callback(0);
        return;
      }
      callback(results[0]);
  })
}

//修改管理员密码:
adminSchema.statics.changeAdmin = function (_id, data, callback) {
  this.find({ _id }, (err, results) => {
    //console.log(results);
    var somebody = results[0];
    somebody.password = md5(data.password);
    somebody.save((err) => {
      if (err) {
        callback(-1); //修改失败
        return;
      }
      callback(1); //修改成功
    });
  });
}
//2.初始化Admin类 该类会声明一个名为admins的集合
let Admin = mongoose.model('Admin', adminSchema);

//3.导出集合
module.exports = Admin;