const path = require('path');
const pathConfig = require('../config/path')
const fs = require('fs')
const getIconList = require('../utils/getIconList')
const db = require('./jsonDb')

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
              // await db.reload()
              let removeColor = true
              try {
                removeColor = await db.getData(`/${files[i]}/removeColor`)
              } catch (e) {
                console.log(e)
              }
              let model = 'css'
              try {
                model = await db.getData(`/${files[i]}/model`)
                console.log('get model', model)
              } catch (e) {
                console.log(e)
              }
              let iconList = []
              try {
                iconList = await getIconList(files[i])
              } catch (e) {
                console.log(e)
              }
              dirs.push({
                name: files[i],
                updateTime: data.mtime,
                updateTimestamp: data.mtime.valueOf(),
                iconList: iconList,
                cssUrl: `${fontPathStr}/${files[i]}/${files[i]}.css`, //css链接
                jsUrl: `${fontPathStr}/${files[i]}/${files[i]}.js`,
                removeColor: removeColor,
                model: model
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
