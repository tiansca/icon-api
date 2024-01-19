const fs = require('fs')
const path = require('path');
const jsdom = require("jsdom");
const JSDOM = jsdom.JSDOM;

const editSvg = (src, removeColor = false) => {
  return new Promise((resolve, reject) => {
    fs.readdir(src, function(err, files) {
      let count = 0
      for (let a = 0; a < files.length; a++) {
        const filePath = path.resolve(src, files[a])
        fs.readFile(filePath, 'utf8', (err, data) => {
          // console.log(data)
          if (err) {
            reject(err)
            return
          }
          const document = new JSDOM(data).window.document;
          // 删除defs
          const defs = document.querySelectorAll('defs')
          if (defs) {
            for (let c = 0; c < defs.length; c++) {
              defs[c].remove()
            }
          }

          // 删除有填充色的rect
          const rect = document.querySelectorAll('rect')
          if (rect) {
            console.log('长度', rect.length)
            for (let b = 0; b < rect.length; b++) {
              if (rect[b].hasAttribute('fill')) {
                rect[b].remove()
              } else {
                rect[b].setAttribute('fill', 'none')
              }
            }
          }
          // 删除id包含“Background”的path
          const path = document.querySelectorAll('path, polyline, g')
          if (path) {
            for (let c = 0; c < path.length; c++) {
              const pathId = path[c].getAttribute('id')
              if (pathId && pathId.toLowerCase().indexOf('background') !== -1) {
                path[c].remove()
              }
              // 删除fill属性
              if (removeColor) {
                const fill = path[c].getAttribute('fill')
                let stroke = path[c].getAttribute('stroke')
                if (stroke === 'none') {
                  stroke = null
                }
                if (fill && fill !== 'currentColor' && !stroke) {
                  path[c].setAttribute('fill', 'currentColor')
                } else if (stroke && stroke !== 'currentColor') {
                  path[c].setAttribute('stroke', 'currentColor')
                }
              }
            }
          }
          // 给svg添加透明填充
          if (document.querySelector('svg')) {
            document.querySelector('svg').setAttribute('fill', 'transparent')
          }
          // const content = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + document.querySelector('svg').outerHTML
          const content = '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + document.querySelector('svg').outerHTML
          // console.log(content)
          fs.writeFile(filePath, content, (err) => {
            count++
            console.log(count, files.length)
            if (count === files.length) {
              resolve()
            }
          })
        })
      }
    })

  })
}
module.exports = editSvg
