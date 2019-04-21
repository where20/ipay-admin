import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
// import store from '../store'
import { getJwtToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    // console.log('555', getJwtToken())
    if (getJwtToken()) {
      config.headers['Authorization'] = 'Bearer ' + getJwtToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => response,
  /**
  * code：101， 成功
  * code：102， 失败
  * code：201， 用户未登录
  * code：202， 用户账号和或密码错误
  * code：203， 用户登录成功
  * code：204， 用户无权访问
  * code：205， 用户登出成功
  * code：206， 此token为黑名单
  * code：207， 登录已失效
  */
  // response => {
  //   const res = response.data
  //   if (res.code !== 203 || res.code === 101) {
  //     // 205:用户登出
  //     if (res.code === 205) {
  //       store.dispatch('FedLogOut').then(() => {
  //         location.reload() // 为了重新实例化vue-router对象 避免bug
  //       })
  //     }
  //     // 204:用户无权访问; 206:此token为黑名单;  207:登录失效;
  //     if (res.code === 204 || res.code === 206 || res.code === 207) {
  //       MessageBox.confirm(
  //         '你已被登出，可以取消继续留在该页面，或者重新登录',
  //         '确定登出',
  //         {
  //           confirmButtonText: '重新登录',
  //           cancelButtonText: '取消',
  //           type: 'warning'
  //         }
  //       ).then(() => {
  //         store.dispatch('FedLogOut').then(() => {
  //           location.reload() // 为了重新实例化vue-router对象 避免bug
  //         })
  //       })
  //     }
  //     return Promise.reject('error')
  //   } else {
  //     return response.data
  //   }
  // },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
