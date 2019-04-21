import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/login',
    method: 'post',
    data: {
      username,
      password
    },
    // transformRequest: [function(data) {
    //   let ret = ''
    //   for (var it in data) {
    //     ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    //   }
    //   return ret
    // }],
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // }
  })
}

export function getInfo(info) {
  return request({
    url: '/user/' + info,
    method: 'get',
    params: {
      token: info == 1? 'admin':'editor'
    }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
