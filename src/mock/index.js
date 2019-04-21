import Mock from 'mockjs'
import loginAPI from './login'
import tradeAPI from './trade'
import merchAPI from './merch'
import accountAPI from './account'
import userAPI from './user'

// 修复在使用 MockJS 情况下，设置 withCredentials = true，且未被拦截的跨域请求丢失 Cookies 的问题
// https://github.com/nuysoft/Mock/issues/300
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function() {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || false
  }
  this.proxy_send(...arguments)
}

// 登录相关
Mock.mock(/\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/user\/[\d]/, 'get', loginAPI.getUserInfo)

// 首页
Mock.mock(/\/trade_info\/successRate/, 'get', tradeAPI.getTradeInfoSR)
Mock.mock(/\/trade_info\/monthCount/, 'get', tradeAPI.getTradeInfoMC)

// 交易管理
Mock.mock(/\/trade_info/, 'get', tradeAPI.getTradeInfo)

// 商户管理
Mock.mock(/\/merch\/NameAndId/, 'get', merchAPI.getMerchList)
Mock.mock(/\/merch/, 'get', merchAPI.getMerchInfo)

// 账号管理
Mock.mock(/\/account/, 'get', accountAPI.getAccount)

// 用户管理
Mock.mock(/\/user/, 'get', userAPI.getUser)

