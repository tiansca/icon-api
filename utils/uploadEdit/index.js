const SVGFixer = require('oslllo-svg-fixer');
const editSvg = require('./utils/editSvg')
const path = require('path')
const pathConfig = require('../../config/path')
const fs = require('fs');

let src = path.resolve(__dirname, '../../')
for (let a = 0; a < pathConfig.iconPath.length; a++) {
  src = path.resolve(src, pathConfig.iconPath[a])
}
function fixSvg(name) {
  return new Promise((resolve, reject) => {
    // 遍历svg目录
    editSvg(path.resolve(src, name)).then(() => {
      var options = {
        showProgressBar: false,
        throwIfDestinationDoesNotExist: false,
      }
      const SVG = SVGFixer(path.resolve(src, name), path.resolve(src, name), options)
      SVG.fix().then(() => {
        resolve()
      }).catch(e => {
        reject()
      })
    })
  })
}

module.exports = fixSvg
