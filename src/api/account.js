import request from '@/utils/request'

export function getAccount(query) {
  return request({
    url: '/account',
    method: 'get',
    params: query
  })
}

export function addAccount(params) {
  return request({
    url: '/account',
    method: 'post',
    data: params
  })
}

export function editAccount(params) {
  return request({
    url: '/account',
    method: 'put',
    data: params
  })
}

export function delAccount(params) {
  return request({
    url: '/account/' + params,
    method: 'delete'
  })
}

export function changeAccountStatus(params) {
  return request({
    url: '/account/status',
    method: 'put',
    data: params
  })
}
