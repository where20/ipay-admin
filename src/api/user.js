import request from '@/utils/request'

export function getUser(query) {
  return request({
    url: '/user',
    method: 'get',
    params: query
  })
}

export function addUserInfo(params) {
  return request({
    url: '/user',
    method: 'post',
    data: params
  })
}

export function editUserInfo(params) {
  return request({
    url: '/user',
    method: 'put',
    data: params
  })
}

export function resetPwd(userId) {
  return request({
    url: '/user/resetPwd/' + userId,
    method: 'put'
  })
}

export function changePwd(params) {
  return request({
    url: '/user/changePwd',
    method: 'put',
    data: params
  })
}

