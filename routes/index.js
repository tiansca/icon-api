var express = require('express');
const createIcon = require("../utils/createIcon");
var router = express.Router();

const userList = require('../config/user')
const login = require('../utils/login')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
      data: e
    })
  }

});

module.exports = router;
