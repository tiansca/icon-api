const path = require('path');
const fs = require('fs');


// source, 源文件目录
// target: 目标路径
const removeDir = async(filePath) => {
  try {
    let stat = await fs.promises.stat(filePath)
    if (stat.isFile()) {
      await fs.promises.unlink(filePath)
    } else {
      let dirs = await fs.promises.readdir(filePath)
      dirs = dirs.map(dir => path.join(filePath, dir))
      let index = 0;
      (async function next() {
        if (index === dirs.length) {
          await fs.promises.rmdir(filePath)
        } else {
          await removeDir(dirs[index++])
          await next()
        }
      })()
    }
  } catch (e) {
    return Promise.reject(e)
  }

}
module.exports = removeDir
