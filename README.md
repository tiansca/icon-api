#图标管理平台api

安装依赖 
npm install

启动项目 npm start

生成api文档 npm run apidoc

浏览器访问 [http://localhost:3013/apidoc](http://localhost:3013/apidoc)

本项目是一个fontIcon管理系统，用户上传svg图标，自动生成css，支持图标预览和下载

config/path.js中配置两个相对路径，iconPath:存放用户上传的svg；fontPath:存放生成的字体和css文件

生成的css文件放在public下，不需要另作操作就能以静态资源的方式供外部访问

用户列表在config/user.js中配置, admin角色拥有删除项目和图标的权限，开发角色只能预览和上传。



