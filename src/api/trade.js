import request from '@/utils/request'

export function getTradeInfo(query) {
  return request({
    url: '/trade_info',
    method: 'get',
    params: query
  })
}

// [⽇统计] 业务要素 : 成功笔数 , 总笔数 , 成功率
export function getTradeInfoSR(query) {
  return request({
    url: '/trade_info/successRate',
    method: 'get',
    params: query
  })
}

// [月统计]业务要素: 金额 , 日期
export function getTradeInfoMC(query) {
  return request({
    url: '/trade_info/monthCount',
    method: 'get',
    params: query
  })
}
