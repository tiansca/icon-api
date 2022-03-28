const path = require('path');
const pathConfig = require('../config/path')
const fileExists = require('../utils/fileExists')
const fs = require('fs')

let src = path.resolve(__dirname, '../')
for (let a = 0; a < pathConfig.iconPath.length; a++) {
  src = path.resolve(src, pathConfig.iconPath[a])
}
let dist = path.resolve(__dirname, '../')
for (let a = 0; a < pathConfig.fontPath.length; a++) {
  dist = path.resolve(dist, pathConfig.fontPath[a])
}
const addProject = (name) => {
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
