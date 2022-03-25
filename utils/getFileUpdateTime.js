const fs = require('fs')

const getFileUpdatedDate = (path) => {
  return new Promise(((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (!err) {
        resolve(stats.mtime)
      } else {
        reject(err)
      }
    })
  }))
}
module.exports = getFileUpdatedDate
