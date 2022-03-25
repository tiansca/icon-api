const path = require('path');
const pathConfig = require('../config/path')
const fs = require('fs')

let src = process.cwd()
for (let a = 0; a < pathConfig.iconPath.length; a++) {
  src = path.resolve(src, pathConfig.iconPath[a])
}

const getIconList = (name) => {
  return new Promise(async (resolve, reject) => {
    const dirs = [];
    let count = 0
    try {
      console.log(name)
      const projectPath = path.resolve(src, name)
      fs.readdir(projectPath, function(err, files){
        if (!err) {
          const classList = files.map(item => {
            const fileNameArr = item.split('.')
            if (fileNameArr[fileNameArr.length - 1] === 'svg') {
              fileNameArr.pop()
            }
            const fileName = fileNameArr.join('.')
            return `${name}-${fileName}`
          })
          // resolve({classList, cssUrl: `fonts/${name}/${name}.css`})
          resolve(classList)
        } else {
          reject(err)
        }
      });
    } catch (e) {
      reject(e)
    }
  })
}
module.exports = getIconList
