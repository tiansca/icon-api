const svgtofont = require('svgtofont');
const path = require('path');
const pathConfig = require('../config/path')
const fileExists = require('../utils/fileExists')
const getIconList = require('../utils/getIconList')
const editSvg = require('../utils/editSvg')
const createJs = require('../utils/createJs')
const {JsonDB, Config} = require('node-json-db')
var db = new JsonDB(new Config("iconDataBase", true, false, '/'));

let src = path.resolve(__dirname, '../')
for (let a = 0; a < pathConfig.iconPath.length; a++) {
  src = path.resolve(src, pathConfig.iconPath[a])
}
let dist = path.resolve(__dirname, '../')
for (let a = 0; a < pathConfig.fontPath.length; a++) {
  dist = path.resolve(dist, pathConfig.fontPath[a])
}
const creatFont = (name) => {
  return new Promise(async (resolve, reject) => {
    if (!name) {
      reject('缺少name')
      return
    }
    try {
      await fileExists(path.resolve(src, name))
    } catch (e) {
      reject('项目不存在')
      return
    }
    try {
      const list = await getIconList(name)
      if (!list || list.length === 0) {
        resolve({
          name,
          classList: await getIconList(name)
        })
        return
      }
    } catch (e) {
      reject(e)
      return
    }
    await db.reload()
    let removeColor = true
    try {
      removeColor = await db.getData(`/${name}/removeColor`)
    } catch (e) {
      console.log(e)
    }
    await editSvg(path.resolve(src, name), removeColor)
    console.log('svg目录', path.resolve(src, name))
    svgtofont({
      src: path.resolve(src, name), // svg path
      dist: path.resolve(dist, name), // output path
      fontName: name, // font name
      css: true, // Create CSS files.
      svgicons2svgfont: {
        fontHeight: 64, // 字体高度
        normalize: true // 通过将图标缩放到最高图标的高度来标准化图标。
      },
      website : null,
      emptyDist: true
    }).then(async () => {
      // 创建js
      try {
        await createJs(name)
      } catch (e) {
        return reject(e)
      }
      const fontPath = [...pathConfig.fontPath]
      fontPath.shift()
      const fontPathStr = fontPath.join('/')
      resolve({
        name,
        classList: await getIconList(name),
        cssUrl: `${fontPathStr}/${name}/${name}.css`,
        jsUrl: `${fontPathStr}/${name}/${name}.js`
      })
    })
  })

}


module.exports = creatFont
