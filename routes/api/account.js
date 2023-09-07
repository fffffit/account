const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
//导入moment  
const moment = require('moment');
const AccountModel = require('../../models/AccountModel');
//导入中间件
const checkTokenMiddleware = require('../../middlewares/checkTokenMiddleware')
//记账本的列表
router.get('/account', checkTokenMiddleware, function(req, res, next) {
  //从MongoDB数据库中读取账单信息
  AccountModel.find().sort({time: -1}).exec(function(err, data) {
    if(err) {
      res.json({
        code: '1001',
        msg: '读取失败',
        data: null
      })
      return
    }
    //成功
    res.json({
      //响应编号
      code: '0000',
      //响应的信息
      msg: '读取成功',
      //响应的数据
      data: data
    })
  })
});

//添加成功
router.post('/account', checkTokenMiddleware, function(req, res) {
  //插入数据库
  AccountModel.create({
    ...req.body,
    //修改time属性的值
    time: moment(req.body.time).toDate()
  }, (err, data) => {
    if(err) {
      res.json({
        code: '1002',
        msg: '创建失败~~',
        data: null
      })
      return
    }
    //成功
    res.json({
      //响应编号
      code: '0000',
      //响应的信息
      msg: '创建成功',
      //响应的数据
      data: data
    })
  })
})

//删除记录
router.delete('/account/:id', checkTokenMiddleware, function(req, res) {
  const id = req.params.id
  // db.get("accounts").remove({id:id}).write()
  AccountModel.deleteOne({_id: id}, (err, data) => {
    if(err) {
      res.json({
        code: '1003',
        msg: '删除账单失败~~',
        data: null
      })
      return
    }
    //成功
    res.json({
      //响应编号
      code: '0000',
      //响应的信息
      msg: '删除成功',
      //响应的数据
      data: data
    })
  })
})

//获取单个账单信息
router.get("/account/:id", checkTokenMiddleware, (req,res) => {
  const id = req.params.id
  // console.log(req.params);    //{ id: '64f2be6aae7bd4181d5e5192' }
  // console.log(req.body);      //{}
  // console.log(req.headers);   //是一个对象
  // console.log(req.ip);        //::ffff:127.0.0.1
  // console.log(req.url);       ///account/64f2be6aae7bd4181d5e5192
  AccountModel.findOne({_id: id}, (err, data) => {
    if(err) {
      res.json({
        code: '1004',
        msg: '读取失败~~',
        data: null
      })
      return
    }
    //成功
    res.json({
      //响应编号
      code: '0000',
      //响应的信息
      msg: '读取成功',
      //响应的数据
      data: data
    })
  })
})

//更新单个账单信息
router.patch('/account/:id', checkTokenMiddleware, (req, res) => {
  //获取 id 参数值
  let {id} = req.params;
  //更新数据库
  AccountModel.updateOne({_id: id}, req.body, (err, data) => {
    if(err){
      return res.json({
        code: '1005',
        msg: '更新失败~~',
        data: null
      })
    }
    //再次查询数据库 获取单条数据
    AccountModel.findById(id, (err, data) => {
      if(err){
        return res.json({
          code: '1004',
          msg: '读取失败~~',
          data: null
        })
      }
      //成功响应
      res.json({
        code: '0000',
        msg: '更新成功',
        data: data  
      })
    })
    
  });
});
module.exports = router;
