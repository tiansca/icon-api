const path = require('path');
const pathConfig = require('../config/path')
const fs = require('fs');

let src = path.resolve(__dirname, '../')
for (let a = 0; a < pathConfig.iconPath.length; a++) {
  src = path.resolve(src, pathConfig.iconPath[a])
}

// file, 文件对象
// name: 项目名
// edit: 是否编辑
const uploadFile = (file, name) => {
  return new Promise((resolve, reject) => {
    // 判断路径是否存在， 不存在创建
    if (!fs.existsSync(path.resolve(src, name))) {
      fs.mkdirSync(path.resolve(src, name))
    }
    fs.readFile(file.filepath, function (error, data) {
      fs.writeFile(path.resolve(src, name, file.originalFilename), data, function (err) {
        if (err) reject(err);
        console.log('It\'s saved!');
        fs.unlink(file.filepath, function () {
          console.log(err)
        });
        resolve()
      })
    });
  })
}
module.exports = uploadFile
