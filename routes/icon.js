const createIcon = require('../utils/createIcon')
var express = require('express');
var router = express.Router();
const getFileUpdatedDate = require('../utils/getFileUpdateTime')
const addProject = require('../utils/addProject')
const updateProject = require('../utils/updateProject')
const deleteProject = require('../utils/deleteProject')
const getProject = require('../utils/getProjectList')
const getIconList = require('../utils/getIconList')
const formidable = require("formidable");
const uploadFile = require('../utils/uploadFile')

const path = require('path');
const pathConfig = require('../config/path')
const fs = require('fs')

let src = path.resolve(__dirname, '../')
for (let a = 0; a < pathConfig.iconPath.length; a++) {
  src = path.resolve(src, pathConfig.iconPath[a])
}
// var db = require('../config/dbconfig')
// var insert = require('../utils/insert')
// var update = require('../utils/update')
// var encrypt = require('../utils/encrypt')

/**
 * @api {get} /icon/create_icon 生成字体图标
 * @apiDescription 生成或更新某个项目的字体图标
 * @apiName create_icon
 * @apiGroup icon
 * @apiParam {string} name 项目名称
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
 *  {code: 0, data: '项目名称'}
 * @apiSampleRequest http://localhost:3009/icon/create_icon
 * @apiVersion 1.0.0
 */
router.get('/create_icon', async function (req, res, next) {
  const name = req.query.name
  try {
    const data = await createIcon(name)
    console.log(data)
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

/**
 * @api {get} /icon/add_project 添加项目
 * @apiDescription 新建项目
 * @apiName add_project
 * @apiGroup project
 * @apiParam {string} name 项目名称
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
 *  {code: 0, data: '项目名称'}
 * @apiSampleRequest http://localhost:3009/icon/add_project
 * @apiVersion 1.0.0
 */
router.get('/add_project', async function (req, res, next) {
  const name = req.query.name
  try {
    const data = await addProject(name)
    console.log(data)
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

/**
 * @api {get} /icon/update_project 修改项目
 * @apiDescription 修改项目名称
 * @apiName update_project
 * @apiGroup project
 * @apiParam {string} name 项目名称
 * @apiParam {string} new_name 新名称
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
 *  {code: 0, data: '项目名称'}
 * @apiSampleRequest http://localhost:3009/icon/update_project
 * @apiVersion 1.0.0
 */
router.get('/update_project', async function (req, res, next) {
  const name = req.query.name
  const newName = req.query.new_name
  try {
    const data = await updateProject(name, newName)
    console.log(data)
    const iconClass = await createIcon(data)
    res.send({
      code: 0,
      data: iconClass
    })
  } catch (e) {
    console.log(e)
    res.send({
      code: -1,
      data: e
    })
  }
});

/**
 * @api {get} /icon/delete_project 删除项目
 * @apiDescription 删除项目
 * @apiName delete_project
 * @apiGroup project
 * @apiParam {string} name 项目名称
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
 *  {code: 0, data: '项目名称'}
 * @apiSampleRequest http://localhost:3009/icon/delete_project
 * @apiVersion 1.0.0
 */
router.get('/delete_project', async function (req, res, next) {
  const name = req.query.name
  try {
    const data = await deleteProject(name)
    console.log(data)
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

/**
 * @api {get} /icon/get_projects 获取项目列表
 * @apiDescription 获取项目列表
 * @apiName get_projects
 * @apiGroup project
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
 *  {code: 0, data: []}
 * @apiSampleRequest http://localhost:3009/icon/get_projects
 * @apiVersion 1.0.0
 */
router.get('/get_projects', async function (req, res, next) {
  try {
    const data = await getProject()
    console.log(data)
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

/**
 * @api {post} /icon/upload_svg 上传svg文件
 * @apiDescription 上传svg文件
 * @apiName upload_svg
 * @apiGroup icon
 * @apiParam {string} name 项目名称
 * @apiParam {file} files 文件
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
 *  {code: 0, data: []}
 * @apiSampleRequest http://localhost:3009/icon/upload_svg
 * @apiVersion 1.0.0
 */
router.post('/upload_svg', async function (req, res, next) {
  const filesList = []
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.on('file', function (filed, file) {
    console.log(filed)
    filesList.push(file);
  });
  // var filesName = req.body.fieldName || 'image' // 获取文件
  // var path = req.body.path || 'note' // 保存路径
  form.parse(req, async function (err, filed) {
    // let count = 0
    console.log(filed)
    if (!filed.name) {
      res.send({
        code: -1,
        data: '缺少参数name'
      })
      return
    }
    if (!err) {
      for (let a = 0; a < filesList.length; a++) {
        try {
          if (filesList[a].mimetype === 'image/svg+xml') {
            await uploadFile(filesList[a], filed.name)
          }
        } catch (e) {
          console.log(e)
        }
      }
      const iconClass = await createIcon(filed.name)
      res.send({
        code: 0,
        data: iconClass
      })
    }
  });
});

/**
 * @api {get} /icon/get_icon_list 获取icon list
 * @apiDescription 获取icon list
 * @apiName get_icon_list
 * @apiGroup icon
 * @apiParam {string} name 项目名称
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
 *  {code: 0, data: []}
 * @apiSampleRequest http://localhost:3009/icon/get_icon_list
 * @apiVersion 1.0.0
 */
router.get('/get_icon_list', async function (req, res, next) {
  const name = req.query.name
  if (!name) {
    res.send({
      code: -1,
      data: 'name为空'
    })
    return
  }
  try {
    const data = await getIconList(name)
    console.log(data)
    res.send({
      code: 0,
      data: {iconList: data, cssUrl: `fonts/${name}/${name}.css`}
    })
  } catch (e) {
    console.log(e)
    res.send({
      code: -1,
      data: e
    })
  }
});


/**
 * @api {get} /icon/delete_icon 删除svg
 * @apiDescription 删除svg
 * @apiName delete_icon
 * @apiGroup icon
 * @apiParam {string} name 项目名称
 * @apiParam {string} class svg文件名称
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
 *  {code: 0, data: []}
 * @apiSampleRequest http://localhost:3009/icon/delete_icon
 * @apiVersion 1.0.0
 */
router.get('/delete_icon', async function (req, res, next) {
  const name = req.query.name
  const className = req.query.className.replace(`${name}-`, '')
  if (!name || !className) {
    res.send({
      code: -1,
      data: 'name或者class为空'
    })
    return
  }
  try {
    fs.unlink(path.resolve(src, name, `${className}.svg`), (err) => {
      if (!err) {
        res.send({
          code: 0
        })
      } else {
        console.log(err)
        res.send({
          code: -1,
          data: err
        })
      }
    })
  } catch (e) {

    res.send({
      code: -1,
      data: e
    })
  }
});

/**
 * @api {get} /icon/download 下载svg
 * @apiDescription 下载svg
 * @apiName download
 * @apiGroup icon
 * @apiParam {string} name 项目名称
 * @apiParam {string} class svg文件名称
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
 *  {code: 0, data: []}
 * @apiSampleRequest http://localhost:3009/icon/download
 * @apiVersion 1.0.0
 */
router.get('/download', async function (req, res, next) {
  const name = req.query.name
  const className = req.query.className.replace(`${name}-`, '')
  if (!name || !className) {
    res.send({
      code: -1,
      data: 'name或者class为空'
    })
    return
  }
  try {
    res.download(path.resolve(src, name, `${className}.svg`))
  } catch (e) {
    res.send({
      code: -1,
      data: e
    })
  }
});


module.exports = router;
