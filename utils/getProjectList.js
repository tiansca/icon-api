const path = require('path');
const pathConfig = require('../config/path')
const fs = require('fs')
const getIconList = require('../utils/getIconList')

let dist = process.cwd()
for (let a = 0; a < pathConfig.fontPath.length; a++) {
  dist = path.resolve(dist, pathConfig.fontPath[a])
}

const getList = () => {
  return new Promise(async (resolve, reject) => {
    const dirs = [];
    let count = 0
    try {
      fs.readdir(dist, function(err, files){
        if (files.length === 0) {
          resolve([])
        }
        for (let i = 0; i < files.length; i++) {
          fs.stat(path.join(dist, files[i]), async function (err, data) {
            const isFile = data.isFile()
            if (!isFile) {
              dirs.push({
                name: files[i],
                updateTime: data.mtime,
                updateTimestamp: data.mtime.valueOf(),
                iconList: await getIconList(files[i]),
                cssUrl: `fonts/${files[i]}/${files[i]}.css` //css链接
              });
            } else {
              console.log(files[i])
            }
            count++
            console.log(count, files.length)
            if (count >= files.length) {
              // 时间倒序
              dirs.sort((a, b) => {
                if (a.updateTimestamp > b.updateTimestamp) {
                  return -1
                } else {
                  return 1
                }
              })
              resolve(dirs)
            }
          });
        }
      });
    } catch (e) {
      reject(e)
    }
  })
}
module.exports = getList
