const fs = require('fs')

const fileExists = (path) => {
  return new Promise((resolve, reject) => {
    fs.access(path, (err) => {
      if (err) {
        reject(false);//"不存在"
      } else {
        resolve(true);//"存在"
      }
    })
  })
}
module.exports = fileExists
