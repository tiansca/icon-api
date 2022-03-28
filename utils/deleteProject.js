const deleteDir = require('../utils/deleteDir')
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

const deleteProject = (name) => {
  return new Promise(async (resolve, reject) => {
    try {
      await deleteDir(path.resolve(dist, name))
      await deleteDir(path.resolve(src, name))
      resolve(name)
    } catch (e) {
      let err = e
      if (e === -1) {
        err = '项目不存在'
      }
      reject(err)
    }
  })
}
module.exports = deleteProject
