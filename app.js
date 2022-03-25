var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var icon = require('./routes/icon');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//设置跨域访问
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  // res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 判断header是否有userid
// app.use(function(req, res, next) {
//   if (req.headers && req.headers.userid) {
//     next()
//   } else {
//     res.send({
//       code: -1,
//       message: '缺少header'
//     })
//   }
// });

app.use('/', indexRouter);
app.use('/icon', icon);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// global.socket = require('./socket')

// apidoc 生成命令 apidoc -i routes -o public/apidoc

module.exports = app;
