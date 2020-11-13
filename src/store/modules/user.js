import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

const state = {
  token: getToken(),
  name: '',
  avatar: 'http://120.79.186.106:3306/20187921132547447.jpg',
  roles: [],
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(res => {
        const { data } = res
        setToken(data.token)
        commit('SET_TOKEN', data.token)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    }).catch()
  },

  // get user info
  getInfo({ commit, state }, data) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        resolve(data)
        commit('SET_ROLES', [data.roleType])
        commit('SET_NAME', data.username)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN')
        commit('SET_ROLES', [])
        removeToken() // must remove  token  first
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN')
      removeToken() // must remove  token  first
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

