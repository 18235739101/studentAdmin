const Admin = require('../models/Admin'),
  formidable = require('formidable'),
  md5 = require('md5-node');


//访问增加管理员页面
exports.showAddAdmin = function (req, res) {
  Admin.checkUser(req.session.s_id, function (adminR) {
    res.render('addAdmin', {
      adminData: adminR
    });
  })
}
//访问接口 处理增加管理员
exports.addAdmin = function (req, res) {
  let form = formidable();
  form.parse(req, (err, fields) => {
    if (err) {
      res.json({ error: 0, msg: '数据接收失败' });
      return;
    }
    fields.password = md5(fields.password);
    console.log(fields);
    Admin.saveAdmin(fields, (results) => {
      res.json(results);
    });
  })
}
//访问管理员列表页面
exports.showListAdmin = function (req, res) {
  Admin.checkUser(req.session.s_id, function (adminR) {
    res.render('listAdmin', {
      adminData: adminR
    });
  })
}
//访问接口 获取管理员某一页数据
exports.showList = function (req, res) {
  let page = req.query.page ? req.query.page : 1; //获取页数
  Admin.findPageData(page, function (results) {
    // console.log(results);
    res.json(results);
  });
}
//访问接口 处理删除管理员
exports.deleteAdmin = function (req, res) {
  let username = req.params.username;
  // /student/:username
  // console.log(username,req.session.s_id);
  if (username == req.session.s_id) {
    return;
  }
  Admin.deleteAdmin(username, (results) => {
    // console.log(results);
    res.json(results);
  })
}
//访问接口 访问管理员修改页面
exports.showUpdateAdmin = function (req, res) {
  // console.log(req.query._id);
  Admin.findOneData(req.query._id, function (dataR) {
    Admin.checkUser(req.session.s_id, function (adminR) {
      // console.log(adminR)
      res.render('updateAdmin', {
        adminData: adminR,
        userData: dataR
      });
    })
  })
}
// 处理修改管理员密码
exports.updateAdmin = function (req, res) {
  let _id = req.params._id;
  console.log(_id);
  let form = formidable();
  form.parse(req, (err, fields) => {
    Admin.changeAdmin(_id, fields, (results) => {
      res.json({ error: results });
    });
  })
}

// 处理input里的密码加密
exports.adminMd = function (req, res) {
  let form = formidable();
  form.parse(req, (err, fields) => {
    fields.val = md5(fields.val);
    res.json(fields);
  })
}
// a链接访问就是渲染
// ajax访问就是返回