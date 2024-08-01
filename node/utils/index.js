const fs = require('fs').promises;
const path = require('path');
const connectDb = require('../mysql/index');
const mysql = require('mysql');



const picDir = 'public/upload_pic/'; //上传图片目录
const downloadDir = 'public/download/'; //下载目录

//创建链接数据库 mysql
const db = mysql.createConnection(connectDb.mysql);
db.connect(function (err) {
    if (err) {
        console.log(err)
    } else {
        console.log('数据库连接成功')
    }
});


// 根据账号密码获取用户信息
function getUserDataAsync(user, password) {
    let sqlStr = `select * from tb_user where user = ? and password = ?`;
    return new Promise((resolve, reject) => {
        db.query(sqlStr, [user, password], (err, result) => {
            if (err) {
                reject({ success: false, msg: '服务器错误' });
            } else {
                if (result.length > 0) {
                    resolve({ success: true, msg: '登录成功', result: result[0] });
                } else {
                    resolve({ success: false, msg: '账号或密码错误' });
                }
            }
        });
    });
}

// 根据用户id获取用户飞机号
function getUserPlaneAsync(user) {
    let sqlStr = `select * from tb_user_lines where user = ?`;
    return new Promise((resolve, reject) => {
        db.query(sqlStr, [user], (err, result) => {
            if (err) {
                reject({ success: false, msg: '服务器错误' });
            } else {
                resolve({ success: true, msg: '获取成功', result: result });
            }
        });
    });
}

// 获取缺陷报告信息
function getDrInfoAsync(id, user) {
    let sqlStr = `select * from tb_dr where id = ${id}`;
    return new Promise((resolve, reject) => {
        db.query(sqlStr, [], (err, result) => {
            if (err) {
                reject({ success: false, msg: '服务器错误' });
            } else {
                if (result.length > 0) {
                    if(result[0].reporterNum != user){
                        resolve({ success: false, msg: '不是自己的报告，没有权限修改' });
                    }else {
                        resolve({ success: true,  msg: '获取缺陷报告信息成功', result: result[0] });
                    }
                    
                } else {
                    resolve({ success: false, msg: '没找到数据' });
                }
            }
        });
    });
}

// 获取待处理的缺陷报告数量
async function getUserPendingDrAsync() {
    let sqlStr = `SELECT COUNT(*) AS pending_count FROM tb_dr WHERE status = '待处理'`;
    return new Promise((resolve, reject) => {
        db.query(sqlStr, [], (err, result) => {
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
        db.query(sqlStr, [], (err, result) => {
            if (err) {
                reject({ success: false, msg: '服务器错误' });
            } else {
                resolve({ success: true, msg: '获取成功', result: result[0].pending_count });
            }
        });
    });
}

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
        return false;
    }

    // 写入文件  
    try {
        await fs.writeFile(filePath, buffer);
        return filePath;
    } catch (err) {
        return false
    }
}

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

// 获取年月
const getYearAndMonth = (time = new Date()) => { return new Date(time).getFullYear() + add0(new Date(time).getMonth() + 1) }


// 获取缺陷报告列表的sql
function getDrListSql(query, isDownload = false, isCount = false) {
    
    let { user, reporterNum, processorNum, drid, ac, dftdsc, rptrna, rptrnu, prorna, prornu, pending, proing, proed, draft, periodFrom, periodTo, ds, partNo, refTo, cardNum, pic, page, pageSize } = query
    page = page || 1
    let start = (page - 1) * pageSize
    let sqlStr = ''

    if (isCount) {
        sqlStr = `SELECT count(*) as total FROM tb_dr WHERE status != '已删除' `
    } else {
        sqlStr = `SELECT * FROM tb_dr WHERE status != '已删除' `
    }

    // 报告人员工号
    if (reporterNum) {
        sqlStr += ` and reporterNum = ${reporterNum}`

    }

    // 报告人员工号
    if (reporterNum) {
        sqlStr += ` and reporterNum = ${reporterNum}`
    }
    // 报告人员工号
    if (processorNum) {
        sqlStr += ` and processorNum = ${processorNum}`
    }

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
    if (draft) status += `'草稿',`
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
    if (pic) sqlStr += ` and pic is not null and pic<>''`
    if (!isCount) {
        // 分页
        if (!isDownload) {
            sqlStr += ` order by reportTime desc limit ${start}, ${pageSize}`
        } else {
            sqlStr += ` order by reportTime desc`
        }
    }
    console.log(sqlStr)
    // return sqlStr
    return new Promise((resolve, reject) => {
        db.query(sqlStr, [], (err, result) => {
            if (err) {
                reject({ success: false, msg: '服务器错误' });
            } else {
                resolve({ success: true, msg: '获取缺陷报告列表成功', result });
            }
        });
    });

}


// 获取30天前当前时间
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

module.exports = {
    db, // 数据库连接
    picDir, // 图片目录
    downloadDir, // 下载目录
    getUserDataAsync, // 获取用户信息
    getUserPlaneAsync, // 获取用户飞机信息
    getUserPendingDrAsync, // 获取待处理的缺陷报告数量
    getUserDraftDrAsync, // 获取草稿的缺陷报告数量
    saveBase64ToFile, // 保存图片
    getTimeStr, // 获取当前时间
    getYearAndMonth, // 获取年月
    getDrListSql, // 获取缺陷报告列表的sql
    getDrInfoAsync, // 获取缺陷报告信息
};