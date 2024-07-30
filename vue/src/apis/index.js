// 封装所有和用户相关的接口函数
import request from '@/utils/http'

// 登录接口
export const loginAPI = ({ user, password }) => {
  return request({
    url: '/login',
    method: 'POST',
    data: {
      user,
      password
    }
  })
}

// 图片上传接口
export const picUploadAPI = ({ user, pics }) => {
  return request({
    url: '/pic_upload',
    method: 'POST',
    data: {
      user,
      pics
    }
  })
}

// 插入或更新缺陷报告表单
export const drFormAPI = (form) => {
  return request({
    url: '/dr_form',
    method: 'POST',
    data: form
  })
}

// 缺陷报告表单列表
export const drListAPI = (page) => {
  return request({
    url: '/dr_list',
    method: 'GET',
    params: page
  })
}

// 获取缺陷报告表单初始化数据：待办、草稿数量等
export const drInitAPI = (page) => {
  return request({
    url: '/dr_init',
    method: 'GET',
    params: page
  })
}

// 插入或更新缺陷报告表单
export const drDownAPI = (page) => {
  return request({
    url: '/dr_download',
    method: 'GET',
    params: page
  })
}

