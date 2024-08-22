const path = require('path');
const pathConfig = require('../config/path')
const fs = require('fs');
const removeDir = require('./removeDir')

let src = path.resolve(__dirname, '../')
for (let a = 0; a < pathConfig.iconPath.length; a++) {
  src = path.resolve(src, pathConfig.iconPath[a])
}

// source, 源文件目录
// target: 目标路径
const copyFiles = (source, target) => {
  return new Promise((resolve, reject) => {
    const sourceDir = path.resolve(src, source);
    const targetDir = path.resolve(src, target);
    try {
      fs.readdir(sourceDir, (err, files) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        let count = 0;
        files.forEach((file) => {
          const sourcePath = path.join(sourceDir, file);
          const destPath = path.join(targetDir, file);
          if (fs.lstatSync(sourcePath).isFile()) {
            fs.copyFile(sourcePath, destPath, (err) => {
              if (err) {
                console.log(err);
                return reject(err);
              }
              count++
              if (count === files.length) {
                // 删除源文件
                removeDir(sourceDir).then(() => {
                  resolve()
                })
              }
            });
          }
        })
       })
    } catch (e) {
      console.log(e)
    }
  })
}
module.exports = copyFiles
