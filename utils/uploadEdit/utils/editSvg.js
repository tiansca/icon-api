const fs = require('fs')
const path = require('path');
const jsdom = require("jsdom");
const JSDOM = jsdom.JSDOM;
// const svg2path = require('./svg2path')

const editSvg = (src) => {
  return new Promise((resolve, reject) => {
    fs.readdir(src, function(err, files) {
      let count = 0
      console.log('******************', src, files)
      for (let a = 0; a < files.length; a++) {
        const filePath = path.resolve(src, files[a])
        // 判断是文件还是文件夹
        try {
          const stats = fs.statSync(filePath);
          if (stats.isDirectory()) {
            // 跳过
            count++
            continue
          }
        } catch (err) {
          console.error('An error occurred:', err);
        }
        // console.log('开始处理', filePath)
        fs.readFile(filePath, 'utf8', (err, data) => {
          // console.log(data)
          if (err) {
            reject(err)
            return
          }
          const document = new JSDOM(data).window.document;
          // 删除defs和mask
          const defs = document.querySelectorAll('defs, mask')
          if (defs) {
            for (let c = 0; c < defs.length; c++) {
              defs[c].remove()
            }
          }
          // 删除背景色，g标签，子元素title标签且内容为background，codesign平台
          const g = document.querySelectorAll('g')
          for (let i = 0; i < g.length; i++) {
            const title = g[i].querySelector('title')
            if (title && title.innerHTML.toLowerCase() === 'background') {
              g[i].remove()
            }
          }
          // 删除背景色，path或者polyline标签，id包含background，蓝湖平台
          const paths = document.querySelectorAll('path,polyline')
          for (let i = 0; i < paths.length; i++) {
            if (paths[i].id && paths[i].id.toLowerCase().indexOf('background') !== -1) {
              paths[i].remove()
            }
          }
          // 获取有效元素
          const AvailableLabelsQuery = 'path,rect,circle,ellipse,line,polygon,polyline';
          const labels = document.querySelectorAll(AvailableLabelsQuery);
          let skip = false
          // 单个path标签，有fill属性并且没有stroke属性，跳过
          if (labels.length === 1 && labels[0].tagName === 'path' && (!labels[0].getAttribute('stroke') || labels[0].getAttribute('stroke') === 'none') && labels[0].getAttribute('fill')) {
            // console.log(filePath, '单个path标签，没有stroke属性，跳过')
            skip = true
          }
          // document.querySelector('svg').innerHTML = ''
          const preserveColor = ['#fff', '#ffffff', 'white', 'rgb(255, 255, 255)']
          for (let i = 0; i < labels.length; i++) {
            if (skip) {
              continue
            }
            // 将fill和stroke设置为#666保留white和#fff,#ffffff）
            const fill = labels[i].getAttribute('fill')
            const stroke = labels[i].getAttribute('stroke')
            const strokeWidth = labels[i].getAttribute('stroke-width')
            const fillRule = labels[i].getAttribute('fill-rule')
            const transform = labels[i].getAttribute('transform')
            // const newPath = svg2path(labels[i]) // 转换为path
            // 设置填充和描边
            // const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            // svgPath.setAttribute('d', newPath)
            if (fill && fill !== 'none') {
              labels[i].setAttribute('fill', preserveColor.includes(fill) ? 'white' : '#666666')
              labels[i].setAttribute('fill-rule', fillRule)
            }
            if(stroke && stroke !== 'none' || strokeWidth) {
              labels[i].setAttribute('stroke', preserveColor.includes(stroke) ? 'white' : '#666666')
              labels[i].setAttribute('stroke-width', strokeWidth)
            }
            if (transform) {
              labels[i].setAttribute('transform', transform)
            }
            // 既没有fill也没有stroke
            if (!fill && !stroke && !strokeWidth) {
              labels[i].setAttribute('fill', preserveColor.includes(fill) ? 'white' : '#666666')
            }
            /*// 插入元素
            document.querySelector('svg').appendChild(svgPath)
            // 添加viewBox属性
            if (!document.querySelector('svg').getAttribute('viewBox')) {
              const width = document.querySelector('svg').getAttribute('width')
              const height = document.querySelector('svg').getAttribute('height')
              document.querySelector('svg').setAttribute('viewBox', `0 0 ${width} ${height}`)
            }*/
          }
          const content = document.querySelector('svg').outerHTML
          // console.log(content)
          if (!skip) {
            fs.writeFile(filePath, content, (err) => {
              count++
              if (count === files.length) {
                resolve()
              }
            })
          } else {
            count++
            if (count === files.length) {
              resolve()
            }
          }

        })
      }
    })
  })
}
module.exports = editSvg
