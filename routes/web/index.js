var express = require('express');
var router = express.Router();
// //导入lowdb
// const low = require('lowdb');
// const FileSync = require('lowdb/adapters/FileSync');
// const adapter = new FileSync(__dirname + '/../data/db.json');
// //获取db对象
// const db = low(adapter);
// //导入shortid(shortid:用于生成Id)
// const shortid = require('shortid');
//导入moment(moment:用于将字符串转为对象)
const moment = require('moment');
const AccountModel = require('../../models/AccountModel')

//测试 (将字符串转为对象，再转为日期对象)
//console.log(moment('2023-02-24').toDate)
//格式化日期对象
//console.log(moment(new Date()).format('YYYY-MM-DD'));

//导入中间件用来检测登录
let checkLoginMiddleware=require('../../middlewares/checkLoginMiddleware');

//添加首页路由规则
router.get('/',(req,res)=>{
  //重定向 /account
  res.redirect('/account');
})

//记账本的列表
router.get('/account',checkLoginMiddleware, function (req, res, next) {
  
  //获取所有的账单信息
  //let accounts=db.get('accounts').value();
  //console.log(accounts)
  AccountModel.find().sort({ time: -1 }).then((data) => {
    console.log(data);
    //将data、moment交给ejs
    res.render('list', { accounts: data, moment: moment });
  }, () => {
    res.status(500).send('读取失败');
    return;
  })

});

//添加记录
router.get('/account/create', checkLoginMiddleware,function (req, res, next) {
  res.render('create');
});

//新增记录
router.post('/account', checkLoginMiddleware,function (req, res, next) {
  //获取请求体的数据
  //console.log(req.body);

  //let id=shortid.generate();
  //写入文件
  //db.get('accounts').unshift({id:id,...req.body}).write();

  //插入数据库
  AccountModel.create({
    //将req.body里的属性摊开
    ...req.body,
    //修改 time 属性的值
    //req.body里面本来就有time属性，但req.body里的time传过来的是字符串，需要转为日期对象，所以可以修改time属性值，覆盖旧值
    time: moment(req.body.time).toDate()
  }).then(() => {
    //成功提醒
    res.render('success', { msg: '添加成功', url: '/account' });
  }).catch(() => {
    res.status(500).send('插入失败');
    return;
  })

});

//删除路由记录
router.get('/account/:id',checkLoginMiddleware, (req, res) => {
  //获取params的id参数
  let id = req.params.id;
  //删除
  // db.get('accounts').remove({id:id}).write();
  AccountModel.deleteOne({ _id: id }).then((data) => {
    //提醒
    res.render('success', { msg: '删除成功', url: '/account' });
  }, () => {
    res.status(500).send('删除失败');
    return;
  })
})
module.exports = router;
