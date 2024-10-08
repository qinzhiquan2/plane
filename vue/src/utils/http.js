// axios基础的封装
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/userStore'
import { removeEmptyStrings } from "@/utils/function";
const httpInstance = axios.create({
  baseURL: 'http://192.168.224.82:3000/',
  timeout: 5000
})

// 拦截器

// axios请求拦截器
httpInstance.interceptors.request.use(config => {
  // 1. 从pinia获取token数据
  const userStore = useUserStore()
  // 2. 按照后端的要求拼接token数据
  const token = userStore.userInfo.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if(config.params){
    config.params = removeEmptyStrings(config.params)
  }
  if(config.data){
    config.data = removeEmptyStrings(config.data)
  }
  return config
 }, e => Promise.reject(e))

// axios响应式拦截器
httpInstance.interceptors.response.use(res => {
  if(res.data.success){
    return res.data
  }else {
    ElMessage({
      type: 'warning',
      message: res.data.msg
    })
    return res.data
  }
}, e => {
  // 统一错误提示
  ElMessage({
    type: 'warning',
    message: e.response.data.msg
  })
  return e
})


export default httpInstance