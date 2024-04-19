//检测登录的中间件
module.exports=(req,res,next)=>{
    //判断（如果用户没有登录，则让用户先登录）
    if(!req.session.username){
      return res.redirect('/login');
    }
    next();
  }