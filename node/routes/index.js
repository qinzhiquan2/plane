const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const md5 = require('md5');
const session = require('express-session');
const lianjiesql = require('../mysql/index');
const fs = require('fs').promises;
const path = require('path');
const Excel = require('exceljs'); 
const formidable = require('formidable'); // 上传 文件处理第三方



//创建链接数据库 mysql
const sql = mysql.createConnection(lianjiesql.mysql);
sql.connect(function (err) {
  if (err) {
    console.log(err)
  } else {

  }
});


//用户登录
router.post('/login', async (req, res) => {
  let { user, password } = req.body
  let userData = await getUserDataAsync(user, password)

  if (userData.success) {
    res.send(userData)
  } else {
    res.json(userData)
  }

});

// 缺陷列表初始化数据
router.get('/dr_init', async (req, res) => {
  let { user } = req.query
  let lines = await getUserPlaneAsync(user) // 飞机号选项
  let unproQty = await getUserPendingDrAsync() // 代表
  let draftDr = await getUserDraftDrAsync(user) // 缺陷报告列表数量

  res.send({
    success: true,
    result: {
      lines: lines.result,
      unproQty: unproQty.result,
      draftQty: draftDr.result
    }
  })
});


// 上传图片 弃用
router.post('/pic_upload', async (req, res) => {
  try {
    const { user, pics } = req.body;
    let [pic1, pic2] = pics;
    let result = []

    let dir = `public/upload_pic/${getYearAndMonth()}`
    let fileName = `${user}_${getTimeStr()}.jpg`

    // 保存Base64编码的图片到文件  
    let res1 = await saveBase64ToFile(pic1, fileName, dir);
    if (res1) {
      result.push({ user, pic1: `/${dir}/${fileName}` });
    }

    if (pic2) {
      let fileName = `${user}_${getTimeStr()}.jpg`
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

//获取缺陷报告列表
router.get('/dr_list', async (req, res) => {

  let sqlStr = getDrListSql(req.query)

  // sql.query(sqlStr, [user, plane, status, start, end], (err, result) => { res.json(result) })
  sql.query(sqlStr, [], (err, result) => {
    if (err) {
      res.json({
        success: false,
        msg: err
      })
    } else {
      res.send({
        success: true,
        result,
        sql: sqlStr
      })
    }
  })
});

// 插入或更新缺陷报告表单
router.post('/dr_form', async (req, res) => {
  let pic = []
  let { id, acNum, cardNum, defectDesc, defectFullDesc, descType, fullDesc, isFullDesc, mainPart, mainZone, method, partFIN, partLoc, partNo, partQty, partUnit, pics, processorName, processorNum, quarterNode, referTo, relatedCard, remark, remarkPro, reportTime, reporterName, reporterNum, reviseTime, reviser, status, subPart, subZone, suggestion, tempSaveByName, tempSaveByNum, tempSaveTime, timePro, wipNum, withDraw } = req.body

  // 保存图片
  if (pics && pics.length) {
    let [pic1, pic2] = pics;

    let dir = `public/upload_pic/${getYearAndMonth()}`
    let fileName = `${reporterNum}_${getTimeStr()}.jpg`

    // 保存Base64编码的图片到文件  
    let res1 = await saveBase64ToFile(pic1, fileName, dir);
    if (res1) {
      pic.push(`/${dir}/${fileName}`);
    }

    if (pic2) {
      let fileName = `${reporterNum}_${getTimeStr()}.jpg`
      let res2 = await saveBase64ToFile(pic2, fileName, dir);
      if (res2) {
        pic.push(`/${dir}/${fileName}`);
      }
    }
  }
  if (pic.length) {
    pic = pic.join('|')
  } else {
    pic = ''
  }
  // 添加缺陷报告
  let sqlStr = ''
  if (!id) {
    const sqlStr = `INSERT INTO tb_dr(acNum, cardNum, defectDesc, defectFullDesc, descType, fullDesc, isFullDesc, mainPart, mainZone, method, partFIN, partLoc, partNo, partQty, partUnit, pic, processorName, processorNum, quarterNode, referTo, relatedCard, remark, remarkPro, reportTime, reporterName, reporterNum, reviseTime, reviser, status, subPart, subZone, suggestion, tempSaveByName, tempSaveByNum, tempSaveTime, timePro, wipNum, withDraw) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    // reportTime = getTimeStr(new Date(), true); // 报告时间 = 当前时间
    sql.query(sqlStr, [
      acNum, cardNum, defectDesc, defectFullDesc, descType, fullDesc, isFullDesc,
      mainPart, mainZone, method, partFIN, partLoc, partNo, partQty, partUnit,
      pic, processorName, processorNum, quarterNode, referTo, relatedCard,
      remark, remarkPro, reportTime, reporterName, reporterNum, reviseTime,
      reviser, status, subPart, subZone, suggestion, tempSaveByName, tempSaveByNum,
      tempSaveTime, timePro, wipNum, withDraw
    ], (err, result) => {
      if (err) {
        console.log(err);
        res.json({
          success: false,
          msg: '插入失败：' + err.message // 使用 err.message 可能会更具体地显示错误信息  
        });
      } else {
        res.json({ // 使用 res.json 来确保响应是一个 JSON 对象  
          success: true,
          msg: '插入成功'
        });
      }
    });
  } else {
    // 更新缺陷报告
    sqlStr = `UPDATE tb_dr set acNum=?,cardNum=?, defectDesc=?, defectFullDesc=?, descType=?, fullDesc=?, isFullDesc=?, mainPart=?, mainZone=?, method=?, partFIN=?, partLoc=?, partNo=?, partQty=?, partUnit=?, pic=?, processorName=?, processorNum=?, quarterNode=?, referTo=?, relatedCard=?, remark=?, remarkPro=?, reportTime=?, reporterName=?, reporterNum=?, reviseTime=?, reviser=?, status=?, subPart=?, subZone=?, suggestion=?, tempSaveByName=?, tempSaveByNum=?, tempSaveTime=?, timePro=?, wipNum=?, withDraw=? where id = ?`
    sql.query(sqlStr, [acNum, cardNum, defectDesc, defectFullDesc, descType, fullDesc, isFullDesc, mainPart, mainZone, method, partFIN, partLoc, partNo, partQty, partUnit, pic, processorName, processorNum, quarterNode, referTo, relatedCard, remark, remarkPro, reportTime, reporterName, reporterNum, reviseTime, reviser, status, subPart, subZone, suggestion, tempSaveByName, tempSaveByNum, tempSaveTime, timePro, wipNum, withDraw, id], (err, result) => {
      if (err) {
        res.json({
          success: false,
          msg: '更新失败：' + err
        })
      } else {
        res.send({
          success: true,
          msg: '更新成功'
        })
      }
    })
  }
})

// 下载缺陷报告excel
router.get('/dr_download', async (req, res) => {  
  try {  
    // 查询数据库  
    const query =  getDrListSql(req.query, true)
    const results = await new Promise((resolve, reject) => {  
      sql.query(query, (err, results) => {  
        if (err) reject(err);  
        resolve(results);  
      });  
    });  
  
    // 创建Excel工作簿和工作表  
    const workbook = new Excel.Workbook();  
    const worksheet = workbook.addWorksheet('Sheet 1');  
  
    // 添加标题行  
    worksheet.columns = [  
      { header: '序号', key: 'index', width: 30 },  
      { header: '#ID', key: 'id', width: 30 },  
      { header: '相关工卡', key: 'relatedCard', width: 80 },  
      // 根据你的数据库列添加更多标题  
    ];  
  
    // 填充数据  
    results.forEach((row) => {  
      worksheet.addRow({  
        column1: row.index, // 修改为实际的列名  
        column2: row.id, // 修改为实际的列名  
        column3: row.relatedCard, // 修改为实际的列名  
        // 根据你的数据库列添加更多数据  
      });  
    });  
  
    // 将工作簿写入HTTP响应  
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');  
    res.setHeader('Content-Disposition', 'attachment; filename="data.xlsx"');  
    const buffer = await workbook.xlsx.writeBuffer();  
    res.send(buffer);  
  } catch (error) {  
    console.error('Error:', error);  
    res.status(500).send('Server error');  
  }  
});  
  


// -------------------------------  函数   -------------------------------

// 获取当前时间
function add0(m) { return m < 10 ? '0' + m : m }
function add00(m) { return m < 10 ? '00' + m : m < 100 ? '0' + m : m }
const getTimeStr = (time = new Date(), notMs = false) => {
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
  let result = y + add0(m) + add0(d) + add0(h) + add0(mm) + add0(s);
  return notMs ? result : result + add00(ms)
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
function getUserPlaneAsync(user) {
  let sqlStr = `select * from tb_user_lines where user = ?`;
  return new Promise((resolve, reject) => {
    sql.query(sqlStr, [user], (err, result) => {
      if (err) {
        reject({ success: false, msg: '服务器错误' });
      } else {
        resolve({ success: true, msg: '获取成功', result: result });
      }
    });
  });
}

// 获取待处理的缺陷报告数量
async function getUserPendingDrAsync() {
  let sqlStr = `SELECT COUNT(*) AS pending_count FROM tb_dr WHERE status = '待处理'`;
  return new Promise((resolve, reject) => {
    sql.query(sqlStr, [], (err, result) => {
      if (err) {
        reject({ success: false, msg: '服务器错误' });
      } else {
        resolve({ success: true, msg: '获取成功', result: result[0].pending_count });
      }
    });
  });
}

// 获取草稿的缺陷报告数量
async function getUserDraftDrAsync(user) {
  let sqlStr = `SELECT COUNT(*) AS pending_count FROM tb_dr WHERE status = '草稿' and reporterNum = ${user};`;
  return new Promise((resolve, reject) => {
    sql.query(sqlStr, [], (err, result) => {
      if (err) {
        reject({ success: false, msg: '服务器错误' });
      } else {
        resolve({ success: true, msg: '获取成功', result: result[0].pending_count });
      }
    });
  });
}

function getDrListSql(query, isDownload = false) {
  let { user, drid, ac, dftdsc, rptrna, rptrnu, prorna, prornu, draftlist, pending, temppro, proing, proed, periodFrom, periodTo, ds, partNo, refTo, cardNum, pic, p } = query
  p = p || 1
  let start = (p - 1) * 100, end = p * 100
  let sqlStr = ''

  if (draftlist) {
    sqlStr = `SELECT * FROM tb_dr WHERE status = '草稿' and reporterName = ${user}`
  } else {
    sqlStr = `SELECT * FROM tb_dr WHERE status<>'草稿'`
    // 报告id
    if (drid) {
      drid = drid.replace(/\，/g, ',')
      sqlStr += ` and id in (${drid})`
    }

    // 飞机号
    if (ac) sqlStr += ` and acNum like '%${ac}%'`

    // 缺陷描述
    if (dftdsc) sqlStr += ` and defectFullDesc like '%${dftdsc}%'`

    // 报告人姓名
    if (rptrna) sqlStr += ` and reporterName like '%${rptrna}%'`

    // 报告人员工号
    if (rptrnu) sqlStr += ` and reporterNum like '%${rptrnu}%'`

    // 处理人姓名
    if (prorna) sqlStr += ` and processorName like '%${prorna}%'`

    // 处理人员工号
    if (prornu) sqlStr += ` and processorNum like '%${prornu}%'`

    // 报告状态
    let status = ''
    if (pending) status += `'待处理',`
    if (temppro) status += `'暂存',`
    if (proing) status += `'处理中',`
    if (proed) status += `'已处理',`
    if (status) sqlStr += ` and status in (${status.slice(0, -1)})`

    // 报告提交时间起始
    if (periodFrom) sqlStr += ` and reportTime >= '${periodFrom}'`
    // 报告提交时间结束
    if (periodTo) sqlStr += ` and reportTime <= '${periodTo}'`

    // 不限时间
    if (ds) {
      sqlStr += ` and reportTime >= '2023-01-01'`
    } else if (!periodFrom && !periodTo) {
      sqlStr += ` and reportTime >= '${getThirtyDaysAgo()}'`
    }

    // 航材件号
    if (partNo) sqlStr += ` and partNo like '%${partNo}%'`

    // 参考资料
    if (refTo) sqlStr += ` and referTo like '%${refTo}%'`

    // 开卡卡号
    if (cardNum) sqlStr += ` and cardNum like '%${cardNum}%'`
    // 有图片
    if (pic) sqlStr += ` and pics is not null and pics<>''`
  }


  // 分页
  if (!isDownload) {
    sqlStr += ` order by reportTime desc limit ${start}, ${end}`
  }else {
    sqlStr += ` order by reportTime desc`
  }

  return sqlStr

}

function getThirtyDaysAgo() {
  // 获取当前日期
  const now = new Date();

  // 设置30天之前的日期
  now.setDate(now.getDate() - 30);

  // 格式化日期为YYYY-MM-DD
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // 月份是从0开始的
  const day = now.getDate().toString().padStart(2, '0');

  // 输出结果
  const thirtyDaysAgo = `${year}-${month}-${day}`;
  return thirtyDaysAgo
}

module.exports = router;