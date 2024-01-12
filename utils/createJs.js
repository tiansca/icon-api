const path = require('path');
const pathConfig = require('../config/path')
const fs = require('fs')

let dist = path.resolve(__dirname, '../')
// console.log(dist)
for (let a = 0; a < pathConfig.fontPath.length; a++) {
    dist = path.resolve(dist, pathConfig.fontPath[a])
}
const template = '!function(e){const fonticonSvg = document.querySelector(`svg[name="{{name}}"]`); if (fonticonSvg) { fonticonSvg.remove();}var t,n,o,i,a,d=\'{{svg}}\',c=(c=document.getElementsByTagName("script"))[c.length-1].getAttribute("data-injectcss"),l=function(e,t){t.parentNode.insertBefore(e,t)};function s(){a||(a=!0,o())}function r(){try{i.documentElement.doScroll("left")}catch(e){return void setTimeout(r,50)}s()}t=function(){var e,t=document.createElement("div");t.innerHTML=d,d=null,(t=t.getElementsByTagName("svg")[0])&&(t.setAttribute("aria-hidden","true"),t.style.position="absolute",t.style.width=0,t.style.height=0,t.style.overflow="hidden",t=t,(e=document.body).firstChild?l(t,e.firstChild):e.appendChild(t))},document.addEventListener?~["complete","loaded","interactive"].indexOf(document.readyState)?setTimeout(t,0):(n=function(){document.removeEventListener("DOMContentLoaded",n,!1),t()},document.addEventListener("DOMContentLoaded",n,!1)):document.attachEvent&&(o=t,i=e.document,a=!1,r(),i.onreadystatechange=function(){"complete"==i.readyState&&(i.onreadystatechange=null,s())})}(window);'

const createJs = function (name) {
    return new Promise((resolve, reject) => {
        const svgPath = path.resolve(dist, name, `${name}.symbol.svg`)
        const jsPath = path.resolve(dist, name, `${name}.js`)
        fs.readFile(svgPath, 'utf8', (err, data) => {
            // console.log(data)
            if (err) {
                return reject(err)
            }
            let svgContent = data
            svgContent = svgContent.replace('<svg xmlns="http://www.w3.org/2000/svg"', `<svg name=fonticon${name} xmlns="http://www.w3.org/2000/svg"`)
            // 创建文件并写入
            let jsContent = template.replace('{{svg}}', svgContent)
            jsContent = jsContent.replace('{{name}}', `fonticon${name}`)
            fs.writeFile(jsPath, jsContent, 'utf8', (err) => {
                if (err) {
                    reject(err)
                    return;
                }
                return resolve()
            });
        })
    })
}
module.exports = createJs
