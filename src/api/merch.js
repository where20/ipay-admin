import request from '@/utils/request'

export function getMerchInfo(query) {
  return request({
    url: '/merch',
    method: 'get',
    params: query
  })
}

export function getCurMerchInfo(query) {
  return request({
    url: '/merch/currentMerch',
    method: 'get',
    params: query
  })
}

export function getMerchList(query) {
  return request({
    url: '/merch/NameAndId',
    method: 'get',
    params: query
  })
}

export function resetSkey(merchId) {
  return request({
    url: '/merch/resetSignKey/' + merchId,
    method: 'put',
  })
}
