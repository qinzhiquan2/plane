const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const md5 = require('md5');
const session = require('express-session');
const lianjiesql = require('../mysql/index');
const fs = require('fs').promises;
const path = require('path');
const formidable = require('formidable'); // 上传 文件处理第三方



//创建链接数据库 mysql
const sql = mysql.createConnection(lianjiesql.mysql);
sql.connect(function (err) {
  if (err) {
    console.log(err)
  } else {

  }
});

function add0(m) { return m < 10 ? '0' + m : m }
// const addTime = (time = new Date()) => {
//   const date = new Date(time)
//   // 当前时间 = 包含时差的当前时间 + 时差时间，getTimezoneOffset() 获取时差（以分钟为单位），转为小时需要除以 60
//   date.setHours(date.getHours() + 0)
//   time = new Date(date.getTime());
//   let y = time.getFullYear();
//   let m = time.getMonth() + 1;
//   let d = time.getDate();
//   let h = time.getHours();
//   let mm = time.getMinutes();
//   let s = time.getSeconds();
//   // 毫秒
//   let ms = time.getMilliseconds();
//   return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s) + '.' + add0(ms);
// }
const addTime = (time = new Date()) => {
  const date = new Date(time)
  // 当前时间 = 包含时差的当前时间 + 时差时间，getTimezoneOffset() 获取时差（以分钟为单位），转为小时需要除以 60
  date.setHours(date.getHours() + 0)
  time = new Date(date.getTime());
  let y = time.getFullYear();
  let m = time.getMonth() + 1;
  let d = time.getDate();
  let h = time.getHours();
  let mm = time.getMinutes();
  let s = time.getSeconds();
  // 毫秒
  let ms = time.getMilliseconds();
  return y + add0(m) + add0(d) + add0(h) + add0(mm) + add0(s) + add0(ms);
}

const getYearAndMonth = (time = new Date()) => { return new Date(time).getFullYear() + add0(new Date(time).getMonth() + 1) }




// 保存图片
async function saveBase64ToFile(base64String, fileName, uploadDir = 'public/upload_pic') {
  // 移除base64字符串的MIME类型前缀  
  const base64Content = base64String.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Content, 'base64');

  // 构建目标文件路径  
  const targetDir = path.join(__dirname, '..', uploadDir); // 假设你的脚本在routes文件夹下，所以需要向上回退一级  
  let filePath = path.join(targetDir, fileName);

  // 确保目录存在（递归创建）  
  try {
    await fs.mkdir(targetDir, { recursive: true });
  } catch (err) {
    console.error(`创建目录时出错: ${err.message}`);
    return false;
  }

  // 写入文件  
  try {
    await fs.writeFile(filePath, buffer);
    return filePath;
  } catch (err) {
    console.error(`写入文件时出错: ${err.message}`);
    return false
  }
}

// 根据账号密码获取用户信息
function getUserDataAsync(user, password) {  
  let sqlStr = `select * from tb_user where user = ? and password = ?`;  
  return new Promise((resolve, reject) => {  
    sql.query(sqlStr, [user, password], (err, result) => {  
      if (err) {  
        reject({ success: false, msg: '服务器错误' });  
      } else {  
        if (result.length > 0) {  
          resolve({ success: true, msg: '登录成功', result: result[0] });  
        } else {  
          resolve({ success: false, msg: '账号密码错误' });  
        }  
      }  
    });  
  });  
}  

// 根据用户id获取用户飞机号
function getUserPlaneAsync(userId) {  
  let sqlStr = `select * from tb_user_lines where userId = ?`;  
  return new Promise((resolve, reject) => {  
    sql.query(sqlStr, [userId], (err, result) => {  
      if (err) {  
        reject({ success: false, msg: '服务器错误' });  
      } else {  
        resolve({ success: true, msg: '获取成功', result: result });  
      }  
    });  
  });  
} 




//用户登录
router.post('/login', async (req, res) => {
  let { user, password } = req.body
  let userData = await getUserDataAsync(user, password)

  if(userData.success){
    let lines = await getUserPlaneAsync(userData.result.id)
    if(!lines.success){
      lines = []
    }
    userData.result.lines = lines.result
    res.send(userData)
  }else {
    res.json(userData)
  }

});


// 上传图片
router.post('/pic_upload', async (req, res) => {
  try {
    const { user, pics } = req.body;
    let [pic1, pic2] = pics;
    let result = []

    let dir = `public/upload_pic/${getYearAndMonth()}`
    let fileName = `${user}_${addTime()}.jpg`

    // 保存Base64编码的图片到文件  
    let res1 = await saveBase64ToFile(pic1, fileName, dir);
    if (res1) {
      result.push({ user, pic1: `/${dir}/${fileName}` });
    }

    if (pic2) {
      let fileName = `${user}_${addTime()}.jpg`
      let res2 = await saveBase64ToFile(pic2, fileName, dir);
      if (res2) {
        result.push({ user, pic1: `/${dir}/${fileName}` });
      }
    }

    res.send({
      success: true,
      msg: '图片上传成功',
      result: result
    })
  } catch (error) {
    // res.status(500).send({ error: error.message });
    res.json({
      success: false,
      msg: '图片上传失败：' + error
    })
  }
})

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
  let { name, code, author, number, press, price } = req.body
  let createTime = addTime()
  let sqlStr = `insert into tb_book(name, code,  author, number, press, price, createTime) values(?,?,?,?,?,?,?)`
  sql.query(sqlStr, [name, code, author, number, press, price, createTime], (err, result) => {
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
  let { id, name, code, author, number, press, price } = req.body
  let sqlStr = `UPDATE tb_book SET name=?,code=?, author=?, number=?, press=?, price=? where id = ?`
  sql.query(sqlStr, [name, code, author, number, press, price, id], (err, result) => {
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