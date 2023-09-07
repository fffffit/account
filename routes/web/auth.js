var express = require('express');
var router = express.Router();
const UserModel = require('../../models/UserModel')
const md5 = require('md5');

//注册
router.get('/reg', (req, res) => {
    //响应HTML文件'
    res.render('auth/reg')
})

router.post('/reg', (req, res) => {
    //这里可以做表单验证，用js去做
    //插入数据库
    UserModel.create({...req.body, password: md5(req.body.password)}, function(err, data) {
        if(err) {
            res.status(500).send('注册失败，请稍后再试~~')
            return
        }
        res.render('success', {msg: '注册成功', url: '/login'})
    })
})

//登录
router.get('/login', (req, res) => {
    //响应HTML文件'
    res.render('auth/login')
})

//登录验证
router.post('/login', (req, res) => {
    //获取用户名和密码
    let {username, password} = req.body
    UserModel.findOne({username: username, password: md5(password)}, (err, data) => {
        if(err) {
            res.status(500).send('登录失败，请稍后再试~~')
            return
        }
        if(!data) {
            return res.send('账号或密码错误~~')
        }
        //写入session
        req.session.username = data.username
        req.session._id = data._id

        //成功响应
        res.render('success', {msg: '登录成功', url: '/account'})
        
    })
})

//退出登录
router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        //成功响应
        res.render('success', {msg: '退出成功', url: '/login'})
    })
})

module.exports = router;
