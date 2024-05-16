const path = require('path');
const pathConfig = require('../config/path')
const fileExists = require('../utils/fileExists')
const fs = require('fs')
const {JsonDB, Config} = require('node-json-db')
var db = new JsonDB(new Config("iconDataBase", true, false, '/'));

let src = path.resolve(__dirname, '../')
for (let a = 0; a < pathConfig.iconPath.length; a++) {
  src = path.resolve(src, pathConfig.iconPath[a])
}
let dist = path.resolve(__dirname, '../')
for (let a = 0; a < pathConfig.fontPath.length; a++) {
  dist = path.resolve(dist, pathConfig.fontPath[a])
}
const addProject = (name, removeColor, model = 'css') => {
  return new Promise(async (resolve, reject) => {
    if (!name) {
      reject('缺少name')
      return
    }
    try {
      await fileExists(src)
    } catch (e) {
      reject('路径不存在：' + src)
      return
    }
    try {
      fs.mkdirSync(path.resolve(src, name))
      fs.mkdirSync(path.resolve(dist, name))
      // 记录项目是否去除颜色
      await db.reload()
      await db.push(`/${name}`, {removeColor, model});
      resolve(name)
    } catch (e) {
      let err = e
      if (e && e.code === "EEXIST") {
        err = '项目名称已经存在:' + name
      }
      reject(err)
    }
  })
}
module.exports = addProject
