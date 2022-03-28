const path = require('path');
const pathConfig = require('../config/path')
const fs = require('fs')

let src = path.resolve(__dirname, '../')
for (let a = 0; a < pathConfig.iconPath.length; a++) {
  src = path.resolve(src, pathConfig.iconPath[a])
}
const uploadFile = (file, name) => {
  return new Promise((resolve, reject) => {
    // fs.rename(file.filepath, path.resolve(src, name, file.originalFilename), function(err){
    //   if(err){
    //     reject(err)
    //   }else{
    //     resolve()
    //   }
    // })
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
