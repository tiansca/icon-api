const path = require('path');
const pathConfig = require('../config/path')
const fs = require('fs')
const getIconList = require('../utils/getIconList')

let dist = path.resolve(__dirname, '../')
console.log(dist)
for (let a = 0; a < pathConfig.fontPath.length; a++) {
  dist = path.resolve(dist, pathConfig.fontPath[a])
}

const getList = () => {
  return new Promise(async (resolve, reject) => {
    // console.log(process.cwd(), __dirname)
    const dirs = [];
    let count = 0
    try {
      fs.readdir(dist, function(err, files){
        if (!files || files.length === 0) {
          resolve([])
          return
        }
        for (let i = 0; i < files.length; i++) {
          fs.stat(path.join(dist, files[i]), async function (err, data) {
            const isFile = data.isFile()
            if (!isFile) {
              const fontPath = [...pathConfig.fontPath]
              fontPath.shift()
              const fontPathStr = fontPath.join('/')
              dirs.push({
                name: files[i],
                updateTime: data.mtime,
                updateTimestamp: data.mtime.valueOf(),
                iconList: await getIconList(files[i]),
                cssUrl: `${fontPathStr}/${files[i]}/${files[i]}.css`, //css链接
                jsUrl: `${fontPathStr}/${files[i]}/${files[i]}.js`
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
