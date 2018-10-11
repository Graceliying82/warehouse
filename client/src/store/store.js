import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    token: null,
    isUserLoggedIn: false,
    userName: '',
    email: '',
    isSupervisor: false,
    isWmsUser: false,
    drawer: false
  },
  mutations: {
    setLogIn (state, loggedIn) {
      state.isUserLoggedIn = loggedIn
    },
    setUserName (state, userName) {
      state.userName = userName
    },
    setEmail (state, email) {
      state.email = email
    },
    setUserInfo (state, payload) {
      state.userName = payload.userName
      state.email = payload.email
      state.token = payload.token
      state.isSupervisor = payload.isSupervisor
      state.isWmsUser = payload.isWmsUser
      state.isUserLoggedIn = true
    },
    resetUserInfo (state) {
      state.userName = ''
      state.email = ''
      state.token = ''
      state.isSupervisor = false
      state.isWmsUser = false
      state.isUserLoggedIn = false
    },
    setDrawer (state) {
      state.drawer = !state.drawer
    }

  },
  actions: {
    setToken (context, token) {
      context.commit('setToken', token)
    },
    setLogIn (context, isUserLoggedIn) {
      context.commit('setLogIn', isUserLoggedIn)
    },
    setUserName (context, userName) {
      context.commit('setUerName', userName)
    },
    setEmail (context, email) {
      context.commit('setEmail', email)
    },
    setUserInfo (context, payload) {
      context.commit('setUserInfo', payload)
    },
    resetUserInfo (context) {
      context.commit('resetUserInfo')
    },
    setDrawer (context) {
      context.commit('setDrawer')
    }
  }
})
