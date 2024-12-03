var express = require('express');
const createIcon = require("../utils/createIcon");
var router = express.Router();

const userList = require('../config/user')
const login = require('../utils/login')
const userDB = require('../utils/userDb')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const whiteList = ['/login/', '/login', '/icon/download/', '/icon/download', '^\/icons\/.*']

// 判断header是否有token
router.use(async function (req, res, next) {
  // 放行白名单接口
  if (whiteList.includes(req.path)) {
    next()
    return
  }
  // 构建正则
  const reg = new RegExp(whiteList.join('|'))
  console.log(reg)
  if (reg.test(req.path)) {
    next()
    return
  }
  // for (let i = 0; i < whiteList; i++) {
  //
  // }
  if (req.headers && req.headers.authorization) {
    try {
      const userObj = JSON.parse(Buffer.from(req.headers.authorization, 'base64').toString('ascii'))
      const data = await login(userObj.name, userObj.password)
      if (data.role !== userObj.role) {
        return res.send({
          code: -1,
          message: '请登录',
          error: '角色不匹配'
        })
      }
      next()
    } catch (e) {
      res.send({
        code: -1,
        message: '请登录',
        error: e
      })
    }
  } else {
    res.send({
      code: -1,
      message: '请登录',
      error: '缺失鉴权'
    })
  }
});

/**
 * @api {post} /login 登录接口
 * @apiDescription 用户名密码登录
 * @apiName login
 * @apiGroup user
 * @apiParam {string} name 用户名
 * @apiParam {string} password 密码
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
 *  {code: 0, data: {token: ''}}
 * @apiSampleRequest http://localhost:3009/login
 * @apiVersion 1.0.0
 */
router.post('/login', async function (req, res, next) {
  const name = req.body.name
  const password = req.body.password
  try {
    const data = await login(name, password)
    res.send({
      code: 0,
      data: data
    })
  } catch (e) {
    console.log(e)
    res.send({
      code: -1,
      data: e,
      error: e || '登录失败'
    })
  }

});

// 新增用户
router.post('/addUser', async function (req, res, next) {
  const name = req.body.name
  const password = req.body.password
  const role = req.body.role || 'dev'
  if (!name || !password) {
    res.send({
      code: -1,
      data: '用户名或密码为空'
    })
    return
  }
  // 查找用户名是否已存在
  const user = await userDB.exists(`/${name}`)
  console.log('是否已经存在', user)
  if (user) {
    res.send({
      code: -1,
      data: '用户名已存在'
    })
    return
  }
  try {
    const data = await userDB.push(`/${name}`, {name, password, role})
    res.send({
      code: 0,
      data: data
    })
  } catch (e) {
    console.log(e)
    res.send({
      code: -1,
      data: e
    })
  }

});

// 获取用户列表
router.get('/getUserList', async function (req, res, next) {
  try {
    const data = await userDB.getData('/')
    const userList = Object.keys(data).map(key => data[key])
    res.send({
      code: 0,
      data: userList
    })
  } catch (e) {
    console.log(e)
    res.send({
      code: -1,
      data: e
    })
  }

});

// 删除用户
router.post('/deleteUser', async function (req, res, next) {
  const name = req.body.name
  try {
    const data = await userDB.delete(`/${name}`)
    res.send({
      code: 0,
      data: data
    })
  } catch (e) {
    console.log(e)
    res.send({
      code: -1,
      data: e
    })
  }
});

// 修改用户
router.post('/updateUser', async function (req, res, next) {
  const name = req.body.name
  const password = req.body.password
  const role = req.body.role || 'dev'
  try {
    const data = await userDB.push(`/${name}`, {name, password, role})
    res.send({
      code: 0,
      data: data
    })
  } catch (e) {
    console.log(e)
    res.send({
     code: -1,
    })
  }
})

module.exports = router;
