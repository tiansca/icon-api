const path = require('path');
const pathConfig = require('../config/path')
const fileExists = require('../utils/fileExists')
const fs = require('fs')
const {JsonDB, Config} = require('node-json-db')
var db = require('./jsonDb');

let src = path.resolve(__dirname, '../')
for (let a = 0; a < pathConfig.iconPath.length; a++) {
  src = path.resolve(src, pathConfig.iconPath[a])
}
let dist = path.resolve(__dirname, '../')
for (let a = 0; a < pathConfig.fontPath.length; a++) {
  dist = path.resolve(dist, pathConfig.fontPath[a])
}
const updateProject = (name, newName) => {
  return new Promise(async (resolve, reject) => {
    if (!name) {
      reject('缺少name')
      return
    }
    if (!newName) {
      reject('newName')
      return
    }
    try {
      await fileExists(path.resolve(src, name))
    } catch (e) {
      reject('路径不存在：' + path.resolve(src, name))
      return
    }
    try {
      await fileExists(path.resolve(src, newName))
      reject('项目名称已经存在：' + newName)
      return
    } catch (e) {
    }
    try {
      fs.renameSync(path.resolve(src, name),path.resolve(src, newName))
      fs.renameSync(path.resolve(dist, name),path.resolve(dist, newName))
      // 保存到json-db
      // await db.reload()
      // 获取旧值
      let removeColor = true
      try {
        removeColor = await db.getData(`/${name}/removeColor`)
      } catch (e) {
        console.log(e)
      }
      let model = 'css'
      try {
        model = await db.getData(`/${name}/model`)
      } catch (e) {
        console.log(e)
      }
      await db.push(`/${newName}`, {removeColor, model});
      await db.delete(`/${name}`);
      resolve(newName)
    } catch (e) {
      reject(e)
    }

  })
}
module.exports = updateProject
