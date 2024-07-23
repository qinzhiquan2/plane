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
// export const picUploadApi = ({ user, pics }) => {
//   return request({
//     url: '/pic_upload',
//     params: {
//       limit
//     }
//   })
// }