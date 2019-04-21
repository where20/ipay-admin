import { param2Obj } from '@/utils'

const userMap = {
  admin: {
    code: 203,
    role: 0,
    userId: 1,
    jwtToken: 'admin',
    data: {
      role: 0,
      userId: 1,
      jwtToken: 'admin',
      introduction: '我是超级管理员',
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      nickName: 'Super Admin'
    }
  },
  editor: {
    code: 203,
    role: 1,
    userId: 2,
    jwtToken: 'editor',
    data: {
      role: 1,
      userId: 2,
      jwtToken: 'editor',
      introduction: '我是编辑',
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      nickName: 'Normal Editor'
    }
  }
}

export default {
  loginByUsername: config => {
    const { username } = JSON.parse(config.body)
    return userMap[username]
  },
  getUserInfo: config => {
    const { token } = param2Obj(config.url)
    if (userMap[token]) {
      return userMap[token]
    } else {
      return false
    }
  },
  logout: () => 'success'
}
