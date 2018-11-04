import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    token: null,
    isUserLoggedIn: false,
    email: '',
    userName: '',
    orgName: '',
    isSupervisor: false,
    isWmsUser: false,
    isBuyer: false,
    isSeller: false
  },
  getters: {
    getSupervisor: state => {
      return state.isSupervisor
    },
    getWmsUser: state => {
      return state.isWmsUser
    },
    getBuyer: state => {
      return state.isBuyer
    },
    getSeller: state => {
      return state.isSeller
    }
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
      state.orgName = payload.orgName
      state.isSupervisor = payload.isSupervisor
      state.isWmsUser = payload.isWmsUser
      state.isBuyer = payload.isBuyer
      state.isSeller = payload.isSeller
      state.isUserLoggedIn = true
    },
    resetUserInfo (state) {
      state.userName = ''
      state.email = ''
      state.token = ''
      state.orgName = ''
      state.isSupervisor = false
      state.isWmsUser = false
      state.isBuyer = false
      state.isSeller = false
      state.isUserLoggedIn = false
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
      context.commit('setUserName', userName)
    },
    setEmail (context, email) {
      context.commit('setEmail', email)
    },
    setUserInfo (context, payload) {
      context.commit('setUserInfo', payload)
    },
    resetUserInfo (context) {
      context.commit('resetUserInfo')
    }
  }
})
