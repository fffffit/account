var express = require('express');
var router = express.Router();
//导入jwt
const jwt = require('jsonwebtoken')
//导入用户模型
const UserModel = require('../../models/UserModel')
const md5 = require('md5');
//读取配置项
const { secret } = require('../../config/config')

//登录验证
router.post('/login', (req, res) => {
    //获取用户名和密码
    let {username, password} = req.body
    UserModel.findOne({username: username, password: md5(password)}, (err, data) => {
        if(err) {
            res.json({
                code:'2001',
                msg: '数据库读取失败~~~',
                data: null
            })
            return
        }
        if(!data) {
            res.json({
                code: '2002',
                msg: '用户名或密码错误',
                data: null
            })
            return
        }

        //创建token
        let token = jwt.sign({
            username: data.username,
            _id: data._id
        }, secret, {
            expiresIn: 60*60*24*7
        })

        //响应token
        res.json({
            code: '0000',
            msg: '登录成功',
            data: token
        })
        
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
