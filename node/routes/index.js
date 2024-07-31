const express = require('express');
const router = express.Router();
const md5 = require('md5');
const fs = require('fs').promises;
const path = require('path');
const ExcelJS = require('exceljs');
const utils = require('../utils');
const jwt = require('jsonwebtoken');

const secret = 'plane'; // 密钥  
// 验证token中间件
function jwtAuth(req, res, next) {
  // 从请求头中获取token  
  if(!req.headers['authorization']){
    res.status(403).send({
      success: false,
      msg: '请先登录'
    });
    return;
  }
  const token = req.headers['authorization'].split(' ')[1];

  // 如果没有token，返回错误  
  if (!token) {
    res.status(403).send({
      success: false,
      msg: '请先登录'
    });
    return;
  }

  // 验证token  
  jwt.verify(token, secret, (err, user) => {
      if (err) {
        res.status(403).send({
          success: false,
          msg: '请先登录'
        });
        return;
      }

      // 将用户信息添加到请求对象上，以便在后续中间件或路由处理器中使用  
      req.user = user;
      next();
  });
}

//用户登录
router.post('/login', async (req, res) => {
  let { user, password } = req.body
  let userData = await utils.getUserDataAsync(user, password)

  if (userData.success) {
    const token = jwt.sign({ userId: userData.result.id }, secret, { expiresIn: '240h' }); 
    userData.result.token = token
    res.status(200).send({
      success: true,
      msg: userData.msg,
      result: userData.result
    });
  } else {
    res.status(500).send({
      success: false,
      msg: userData.msg,
    });
  }
});

// 缺陷列表初始化数据
router.get('/dr_init', jwtAuth, async (req, res) => {
  let { user } = req.query
  let lines = await utils.getUserPlaneAsync(user) // 飞机号选项
  let unproQty = await utils.getUserPendingDrAsync() // 代表
  let draftDr = await utils.getUserDraftDrAsync(user) // 缺陷报告列表数量

  res.status(200).send({
    success: true,
    msg: '获取初始化数据成功',
    result: {
      lines: lines.result,
      unproQty: unproQty.result,
      draftQty: draftDr.result
    }
  })
});



//获取缺陷报告列表
router.get('/dr_list', jwtAuth, async (req, res) => {
  let sqlStr = utils.getDrListSql(req.query)
  utils.db.query(sqlStr, [], (err, result) => {
    if (err) {
      res.status(500).send({
        success: false,
        msg: '获取缺陷报告列表失败',
        err
      })
    } else {
      res.status(200).send({
        success: true,
        msg: '获取缺陷报告列表成功',
        result,
        sql: sqlStr
      });
    }
  })
});

// 插入或更新缺陷报告表单
router.post('/dr_form', jwtAuth, async (req, res) => {
  let pic = []
  let { id, acNum, cardNum, defectDesc, defectFullDesc, descType, fullDesc, isFullDesc, mainPart, mainZone, method, partFIN, partLoc, partNo, partQty, partUnit, pics, processorName, processorNum, quarterNode, referTo, relatedCard, remark, remarkPro, reportTime, reporterName, reporterNum, reviseTime, reviser, status, subPart, subZone, suggestion, tempSaveByName, tempSaveByNum, tempSaveTime, timePro, wipNum, withDraw } = req.body

  // 保存图片
  if (pics && pics.length) {
    let [pic1, pic2] = pics;

    let dir = `${utils.picDir}${utils.getYearAndMonth()}`
    let fileName = `${reporterNum}_${utils.getTimeStr()}.jpg`

    // 保存Base64编码的图片到文件  
    let res1 = await utils.saveBase64ToFile(pic1, fileName, dir);
    if (res1) {
      pic.push(`/${dir}/${fileName}`);
    }

    if (pic2) {
      let fileName = `${reporterNum}_${utils.getTimeStr()}.jpg`
      let res2 = await utils.saveBase64ToFile(pic2, fileName, dir);
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
    utils.db.query(sqlStr, [
      acNum, cardNum, defectDesc, defectFullDesc, descType, fullDesc, isFullDesc,
      mainPart, mainZone, method, partFIN, partLoc, partNo, partQty, partUnit,
      pic, processorName, processorNum, quarterNode, referTo, relatedCard,
      remark, remarkPro, reportTime, reporterName, reporterNum, reviseTime,
      reviser, status, subPart, subZone, suggestion, tempSaveByName, tempSaveByNum,
      tempSaveTime, timePro, wipNum, withDraw
    ], (err, result) => {
      if (err) {
        res.status(500).send({
          success: false,
          msg: '插入失败',
          err: err
        });
      } else {
        res.status(200).send({
          success: true,
          msg: '插入成功'
        });
      }
    });
  } else {
    // 更新缺陷报告
    sqlStr = `UPDATE tb_dr set acNum=?,cardNum=?, defectDesc=?, defectFullDesc=?, descType=?, fullDesc=?, isFullDesc=?, mainPart=?, mainZone=?, method=?, partFIN=?, partLoc=?, partNo=?, partQty=?, partUnit=?, pic=?, processorName=?, processorNum=?, quarterNode=?, referTo=?, relatedCard=?, remark=?, remarkPro=?, reportTime=?, reporterName=?, reporterNum=?, reviseTime=?, reviser=?, status=?, subPart=?, subZone=?, suggestion=?, tempSaveByName=?, tempSaveByNum=?, tempSaveTime=?, timePro=?, wipNum=?, withDraw=? where id = ?`
    utils.db.query(sqlStr, [acNum, cardNum, defectDesc, defectFullDesc, descType, fullDesc, isFullDesc, mainPart, mainZone, method, partFIN, partLoc, partNo, partQty, partUnit, pic, processorName, processorNum, quarterNode, referTo, relatedCard, remark, remarkPro, reportTime, reporterName, reporterNum, reviseTime, reviser, status, subPart, subZone, suggestion, tempSaveByName, tempSaveByNum, tempSaveTime, timePro, wipNum, withDraw, id], (err, result) => {
      if (err) {
        res.status(500).send({
          success: false,
          msg: '更新失败',
          err: err
        })
      } else {
        res.status(200).send({
          success: true,
          msg: '更新成功'
        })
      }
    })
  }
})

// 下载缺陷报告excel
router.get('/dr_download', jwtAuth, async (req, res) => {
  try {
    const query = utils.getDrListSql(req.query, true)
    const rows = await new Promise((resolve, reject) => {
      utils.db.query(query, (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
    // 创建一个工作簿  
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`缺陷报告清单${utils.getTimeStr()}`);

    // 添加表头  
    worksheet.columns = [
      { header: '序号', key: 'index', width: 10 },
      { header: '#ID', key: 'id', width: 10 },
      { header: '飞机号', key: 'acNum', width: 30 },
      { header: '相关工卡', key: 'relatedCard', width: 30 },
      { header: '缺陷描述', key: 'defectFullDesc', width: 30 },
      { header: '报告人', key: 'reporterName', width: 30 },
      { header: '报告时间', key: 'reportTime', width: 30 },
      { header: '状态', key: 'status', width: 30 },
      { header: '处理人', key: 'processorName', width: 30 },
      { header: '处理方案', key: 'method', width: 30 },
      { header: '开出工卡', key: 'cardNum', width: 30 },
      { header: '处理时间', key: 'tempSaveTime', width: 30 },
      { header: '参考资料', key: 'referTo', width: 30 },
      { header: '航材件号', key: 'partNo', width: 30 },
      { header: '工艺备注', key: 'remarkPro', width: 30 },
      { header: '图片', key: 'pic', width: 30 },
    ];

    // 添加数据  
    rows.forEach((row, index) => {
      row.index = index + 1
      if (row.pic) {
        row.pic = '图片'
      }
      worksheet.addRow(row);
    });

    // 文件名  
    let uploadDir = utils.downloadDir
    let fileName = `缺陷报告_${utils.getTimeStr()}.xls`

    // 确保目录存在（递归创建）  
    const targetDir = path.join(__dirname, '..', uploadDir); // 假设你的脚本在routes文件夹下，所以需要向上回退一级  
    let filePath = path.join(targetDir, fileName);
    try {
      await fs.mkdir(targetDir, { recursive: true });
    } catch (err) {
      res.status(500).send({
        success: false,
        msg: '创建目录失败：' + err,
        err
      })
    }

    // 写入文件  
    try {
      await workbook.xlsx.writeFile(filePath);
    } catch (err) {
      res.status(500).send({
        success: false,
        msg: '文件写入失败：' + err,
        err
      })
    }


    // 返回文件链接  
    res.status(200).send({
      success: true,
      msg: '生成下载文件成功',
      result: {
        url: `http://localhost:3000/public/download/${fileName}`,
        fileName,
      }
    })
  } catch (err) {
    res.status(500).send({
      success: false,
      msg: '下载失败：' + err
    })
  }
});


module.exports = router;