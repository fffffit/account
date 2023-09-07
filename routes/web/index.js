//导入express
const express = require('express');
const router = express.Router();
//导入moment  
const moment = require('moment');
const AccountModel = require('../../models/AccountModel');
//导入中间件检测登录
const checkLoginMiddleware = require('../../middlewares/checkLoginMiddleware')

//添加首页的路由规则
router.get('/', (req, res) => {
  //重定向 
  res.redirect('/account')
})

//记账本的列表
router.get('/account', checkLoginMiddleware, function(req, res, next) {
  //从MongoDB数据库中读取账单信息
  AccountModel.find().sort({time: -1}).exec(function(err, data) {
    if(err) {
      res.status(500).send('读取失败~~')
      return
    }
    //成功
    res.render('list', {accounts: data, moment: moment})
  })
});

//添加记录
router.get('/account/create', checkLoginMiddleware, function(req, res, next) {
  res.render('create')
})

//添加成功
router.post('/account', checkLoginMiddleware, function(req, res) {
  // //查看表单数据
  // console.log(req.body);
  //插入数据库
  AccountModel.create({
    ...req.body,
    //修改time属性的值
    time: moment(req.body.time).toDate()
  }, (err, data) => {
    if(err) {
      res.status('500').send('插入失败~~~');
      return;
    }
    //成功提醒
    res.render('success', {msg: '添加成功啦！', url: '/account'})
  })
})

//删除记录
router.get('/account/:id', checkLoginMiddleware, function(req, res) {
  const id = req.params.id
  AccountModel.deleteOne({_id: id}, (err, data) => {
    if(err) {
      res.status(500).send('插入失败~~')
      return;
    }
    //成功的提醒
    res.render('success', {msg: '删除成功！', url: '/account'})
  })
  
})

module.exports = router;
