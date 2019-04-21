import { login, logout, getInfo } from '@/api/login'
import { getJwtToken, setRole, setJwtToken, removeRole, removeJwtToken, setUserId, getUserId, removeUserId } from '@/utils/auth'
import { Message } from 'element-ui'

const user = {
  state: {
    userId: getUserId(),
    jwtToken: getJwtToken(),
    curUser: null,
    name: '',
    avatar: '',
    role: ''
  },

  mutations: {
    SET_CURUSER: (state, curUser) => {
      state.curUser = curUser
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLE: (state, role) => {
      state.role = role
    },
    SET_USERID: (state, userId) => {
      state.userId = userId
    }
  },

  actions: {
    // 登录
    Login({ commit, state }, loginForm) {
      const username = loginForm.username.trim()
      return new Promise((resolve, reject) => {
        login(username, loginForm.password).then(response => {
          const data = response.data
          if (data.code === 203) {
            // location.reload(); // 为了重新实例化vue-router对象 避免bug
            setRole(data.role)
            setJwtToken(data.jwtToken)
            setUserId(data.userId)
            commit('SET_USERID', data.userId)
            getInfo(state.userId).then(response => {
              const data = response.data
              commit('SET_CURUSER', data.data)
              commit('SET_ROLE', data.data.role)
              resolve(response)
            }).catch(error => {
              reject(error)
            })
          } else if (data.code === 202) {
            Message({
              message: data.message,
              type: 'error'
            })
            reject()
          }
          // resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.userId).then(response => {
          // console.log('res', response)
          const data = response.data
          commit('SET_CURUSER', data.data)
          commit('SET_ROLE', data.data.role)
          commit('SET_NAME', data.data.nickName)
          commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_ROLE', '')
          removeRole()
          removeJwtToken()
          removeUserId()
          resolve()
        }).catch(error => {
          reject(error)
        })
      }).catch(function(reason) {
        console.log('catch:', reason)
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        removeRole()
        removeJwtToken()
        removeUserId()
        resolve()
      }).catch(function(reason) {
        console.log('catch:', reason)
      })
    }
  }
}

export default user
