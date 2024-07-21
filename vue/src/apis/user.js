// 封装所有和用户相关的接口函数
import request from '@/utils/http'

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


export const getLikeListAPI = ({ limit = 4 }) => {
  return request({
    url: '/goods/relevant',
    params: {
      limit
    }
  })
}