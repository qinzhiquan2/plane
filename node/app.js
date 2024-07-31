const express = require("express");
const app = express();
const path = require('path');
var session =require('express-session');
const cors = require('cors'); 

const bodyParser = require('body-parser'); //处理 post 中间建
const router = require("./routes/index"); //引入路由模块


app.use(bodyParser.json({ limit: '50mb' }));//数据JSON类型
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));//解析post请求数据

// 使用CORS中间件，配置跨域  
app.use(cors({  
    origin: ['https://example.com', 'http://localhost:5173'], // 限制允许的源  
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 允许的HTTP方法  
    allowedHeaders: ['Content-Type', 'Authorization'], // 允许的HTTP头  
    credentials: true, // 是否允许发送Cookie  
    optionsSuccessStatus: 200 // 指定预检请求的响应状态码  
})); 

//session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));


//路由模块
app.use('/', router);

//暴露 文件
app.use('/public', express.static('./public'));

//配置服务端口 端口号3000（启动文件）
var server = app.listen(3000, 'localhost', function () {
    var host = server.address().address;
    var port = server.address().port;
    session.HTTP_PORT = 'http://' + host + ':' + port +'/';
    console.log('server is running', host + ':' + port);
});

