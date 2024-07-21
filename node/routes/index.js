var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var md5 = require('md5');
var session = require('express-session');
var lianjiesql = require('../mysql/index');
var formidable = require('formidable'); // 上传 文件处理第三方


//创建链接数据库 mysql
var sql = mysql.createConnection(lianjiesql.mysql);
sql.connect(function (err) {
  if (err) {
    console.log(err)
  } else {

  }
});

function add0(m) { return m < 10 ? '0' + m : m }
let addTime = time => {
  time = time ? time : new Date()
  const date = new Date(time)
  // 当前时间 = 包含时差的当前时间 + 时差时间，getTimezoneOffset() 获取时差（以分钟为单位），转为小时需要除以 60
  date.setHours(date.getHours() + 0)
  var time = new Date(date.getTime());
  let y = time.getFullYear();
  let m = time.getMonth() + 1;
  let d = time.getDate();
  let h = time.getHours();
  let mm = time.getMinutes();
  let s = time.getSeconds();
  return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}

// ---------------------------------------------------- 用户 -----------------------------------------------

// // 用户注册
// router.post('/register', (req, res) => {
//   let { name, password } = req.body
//   let sqlStr0 = `select * from tb_user where name = ?`
//   sql.query(sqlStr0, [name], (err, result) => {
//     if (result.length > 0) {
//       res.json({
//         success: false,
//         msg: '已有相同用户名'
//       })
//     } else {

//       let sqlStr = `insert into tb_user(name, password) values(?,?)`
//       sql.query(sqlStr, [name, password], (err, result) => {
//         if (err) {
//           res.json({
//             success: false,
//             msg: err
//           })
//         } else {
//           res.send({
//             success: true,
//             msg: result
//           })
//         }
//       })
//     }
//   }) 

// });

//用户登录
router.post('/login', (req, res) => {
  let { user, password } = req.body
  let sqlStr = `select * from tb_user where user = ? and password = ?`
  sql.query(sqlStr, [user, password], (err, result) => {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        msg: '账号密码错误'
      })
    } else {
      if (result.length > 0) {
        res.send({
          success: true,
          msg: '登录成功',
          result: result[0]
        })
      } else {
        res.json({
          success: false,
          msg: '账号密码错误'
        })
      }

    }
  })
});


// ---------------------------------------------------- 图书 -----------------------------------------------

//获取图书
router.get('/bookGetAll', (req, res) => {
  let { name } = req.query
  let sqlStr = `select * from tb_book where id > 0 `
  if (name) {
    sqlStr += ` and name like '%${name}%'`
  }
  sql.query(sqlStr, [], (err, result) => {
    if (err) {
      res.json({
        success: false,
        msg: err
      })
    } else {
      res.send({
        success: true,
        msg: result
      })
    }
  })
});
//增加图书
router.post('/bookAdd', (req, res) => {
  let { name, code,  author, number, press, price } = req.body
  let createTime = addTime()
  let sqlStr = `insert into tb_book(name, code,  author, number, press, price, createTime) values(?,?,?,?,?,?,?)`
  sql.query(sqlStr, [name, code,  author, number, press, price, createTime], (err, result) => {
    if (err) {
      res.json({
        success: false,
        msg: err
      })
    } else {
      res.send({
        success: true,
        msg: result
      })
    }
  })
});
//修改图书
router.post('/bookUpdate', (req, res) => {
  let { id, name, code,  author, number, press, price } = req.body
  let sqlStr = `UPDATE tb_book SET name=?,code=?, author=?, number=?, press=?, price=? where id = ?`
  sql.query(sqlStr, [ name, code,  author, number, press, price,  id], (err, result) => {
    if (err) {
      res.json({
        success: false,
        msg: err
      })
    } else {
      res.send({
        success: true,
        msg: result
      })
    }
  })
});
//删除图书
router.post('/bookDelete', (req, res) => {
  let id = req.body.id;
  let sqlStr = `DELETE FROM tb_book where id = ?`
  sql.query(sqlStr, [id], (err, result) => {
    if (err) {
      res.json({
        success: false,
        msg: err
      })
    } else {
      res.send({
        success: true,
        msg: result
      })
    }
  })
});



module.exports = router;