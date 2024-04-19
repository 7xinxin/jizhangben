var express = require('express');
var router = express.Router();

//导入moment(moment:用于将字符串转为对象)
const moment = require('moment');
const AccountModel = require('../../models/AccountModel')

//记账本的列表
router.get('/account', function (req, res, next) {
    //获取所有的账单信息
    //let accounts=db.get('accounts').value();
    //console.log(accounts)
    AccountModel.find().sort({ time: -1 }).then((data) => {
        //成功的处理
        //将data、moment交给ejs
        // res.render('list', { accounts: data, moment: moment });
        res.json({
            //响应编号
            code: '0000',
            //响应的信息
            msg: '读取成功',
            //响应的数据
            data: data
        });
    }, () => {
        //失败的处理
        // res.status(500).send('读取失败');
        res.json({
            code: '1001',
            msg: '读取失败',
            data: null
        });
        return;
    })

});


//新增记录
router.post('/account', function (req, res, next) {
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
    }).then((data) => {
        //成功提醒
        //res.render('success', { msg: '添加成功', url: '/account' });
        res.json({
            //响应编号
            code: '0000',
            //响应的信息
            msg: '创建成功',
            //响应的数据
            data: data
        });
    }, () => {
        res.json({
            code: '1002',
            msg: '创建失败',
            data: null
        });
        return;
    })

});

//删除路由记录
router.delete('/account/:id', (req, res) => {
    //获取params的id参数
    let id = req.params.id;
    //删除
    // db.get('accounts').remove({id:id}).write();
    AccountModel.deleteOne({ _id: id }).then((data) => {
        //提醒
        //res.render('success', { msg: '删除成功', url: '/account' });
        res.json({
            code: '0000',
            msg: '删除成功',
            data: {}
        })
    }, () => {
        //res.status(500).send('删除失败');
        res.json({
            code: '1003',
            msg: "删除账单失败",
            data: null
        })
        return;
    })
})

//获取单个账单信息
router.get('/account/:id', (req, res) => {
    //获取id参数
    let { id } = req.params;
    //查询数据库
    AccountModel.findById(id).then((data) => {
        //成功响应
        res.json({
            code: '0000',
            msg: '读取成功',
            data: data
        })
    }, () => {
        res.json({
            code: '1004',
            msg: '读取失败',
            data: null
        });
        return;
    })
})

//更新单个账单信息
router.patch('/account/:id', (req, res) => {
    //获取id参数值
    let { id } = req.params;
    //更新数据库
    AccountModel.updateOne({ _id: id }, req.body).then((data) => {
        //再次查询数据库，获取单条数据
        AccountModel.findById(id).then((data) => {
            //成功响应
            res.json({
                code: '0000',
                msg: '更新成功',
                data: data
            })
        }, () => {
            res.json({
                code: '1004',
                msg: '读取失败',
                data: null
            });
            return;
        })
    }, () => {
        res.json({
            code: '1005',
            msg: '更新失败',
            data: null
        });
        return;
    })
})
module.exports = router;
