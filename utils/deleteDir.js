const fs = require('fs')
const path = require('path')
//读取路径信息
function getStat(path){
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if(err){
                resolve(false);
            }else{
                resolve(stats);
            }
        })
    })
}

function rmdirPromise(filePath) {
    return new Promise(async (resolve, reject) => {
        let isExists = await getStat(filePath);
        if (!isExists) {
            reject(-1)
            return
        }
        fs.stat(filePath, function (err, stat) {
            if (err) reject(err)
            if (stat.isFile()) {
                fs.unlink(filePath, function (err) {
                    if (err) reject(err)
                    resolve()
                })
            } else {
                fs.readdir(filePath, function (err, dirs) {
                    if (err) reject(err)
                    dirs = dirs.map(dir => path.join(filePath, dir)) // a/b a/c
                    let index = 0;
                    (function next() {
                        if (index === dirs.length) {
                            fs.rmdir(filePath, function (err) {
                                if (err) reject(err)
                                resolve()
                                // console.log('删除文件夹成功')
                            })
                        } else {
                            rmdirPromise(dirs[index++]).then(() => {
                                next()
                            }, err => {
                                console.log('删除文件夹失败')
                                reject(err)
                            })
                        }
                    })()
                })
            }
        })
    })
}

module.exports = rmdirPromise;
