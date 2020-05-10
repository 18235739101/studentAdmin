exports.logout = function(req,res){
  //删除session req.session {s_id:'sunwukong'}
  delete req.session['s_id'];
  res.redirect('/login');
}