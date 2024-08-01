// 封装工具函数
import $ from 'jquery';
import CryptoJS from 'crypto-js';

export const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '/api';



// 获取当前时间
function add0(m) { return m < 10 ? '0' + m : m }
function add00(m) { return m < 10 ? '00' + m : m < 100 ? '0' + m : m }
export const getTimeStr = (time = new Date(), notMs = false) => {
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

// 翻译
export async function translateText(query, from = 'zh', to = 'en') {
    var appid = '20240728002110457';
    var key = 'VIm4NHYKT7ERLRQgYtU6';
    var salt = (new Date()).getTime();
    var str1 = appid + query + salt + key;
    var sign = CryptoJS.MD5(str1).toString();

    // 封装 $.ajax 调用为 Promise  
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'http://api.fanyi.baidu.com/api/trans/vip/translate',
            type: 'get',
            dataType: 'jsonp',
            jsonpCallback: 'callback', // 某些情况下需要指定回调函数名，但百度翻译API可能不需要  
            data: {
                q: query,
                appid: appid,
                salt: salt,
                from: from,
                to: to,
                sign: sign
            },
            success: function (data) {
                if (data && data.trans_result && data.trans_result.length > 0) {
                    resolve(data.trans_result[0].dst);
                } else {
                    reject(new Error('No translation result found'));
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr, status, error)
                reject(new Error(status + ': ' + error));
            }
        });
    });
}


// 图片列表
export const getPicList = (pic) => {
    if (!pic) {
        return []
    }
    let result = pic.split('|')
    result = result.map(item => baseURL + item)
    return result
}

// 下载文件
export function downloadExcel(url, fileName = getTimeStr()) {
    // 创建一个a标签用于下载  
    let a = document.createElement('a');
    a.href = url;
    a.download = fileName; // 设置下载文件的名称  
    document.body.appendChild(a);
    a.click();

    // 清理  
    document.body.removeChild(a);
}

export function removeEmptyStrings(obj) { 
    for (const key in obj) {  
      if (obj.hasOwnProperty(key) && obj[key] === '') {  
        delete obj[key];  
      }  
    }  
    return obj;  
  }  