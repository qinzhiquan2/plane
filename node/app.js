var express =require("express");
var app =express();
var path = require('path');
var session =require('express-session');
//获取ip
var address = require('address');
var localhost = address.ip() || 'localhost';

//处理 post 中间建
const bodyParser = require('body-parser');
// var jsonParser = bodyParser.json()
// var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json({limit: '50mb'}));//数据JSON类型
app.use(bodyParser.urlencoded({ limit: '50mb',extended: false }));//解析post请求数据

app.all("*",function(req,res,next){
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin","*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers","content-type");
  //跨域允许的请求方式 
  res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() == 'options')
      res.send(200);  //让options尝试请求快速结束
  else
      next();
})


//session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

//路由模块 start
var routerIndex =require("./routes/index");
app.use('/' ,routerIndex);

//路由模块 end

//暴露 文件
// app.use(express.static(path.join(__dirname, 'public')));

//暴露 文件
app.use('/uploads',express.static('./uploads'));
app.use('/public',express.static('./public'));

//配置服务端口 端口号3000（启动文件）
var server = app.listen(3000, 'localhost', function () {
    var host = server.address().address;
    var port = server.address().port;
    session.HTTP_PORT = 'http://' + host + ':' + port +'/';
    console.log('server is running', host + ':' + port);
});

