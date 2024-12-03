#图标管理平台api

node版本 18.18.2

安装依赖 
npm install

启动项目 npm start

接口地址: [http://localhost:3013](http://localhost:3013)

生成api文档 npm run apidoc

api地址: [http://localhost:3013/apidoc](http://localhost:3013/apidoc)

本项目是一个fontIcon管理系统，用户上传svg图标，自动生成css和js，支持图标预览和下载

config/path.js中配置两个相对路径，iconPath:存放用户上传的svg；fontPath:存放生成的字体和css文件

生成的css和js文件放在public下，以静态资源的方式供外部访问

使用node-json-db实现了简单的用户管理功能，可以新增用户，删除用户，修改用户密码，修改用户角色，角色有管理员和普通用户两种，管理员可以管理所有用户，普通用户只能查看和上传图标，不能执行删除操作，默认用户名是admin，密码是admin@123



