import Api from '@/services/Api'

export default {
  login (credentials) {
    return Api().post('/login', credentials)
  },
  checkEmail (credentials) {
    return Api().post('/login/checkEmail', credentials)
  },
  createUser (credentials) {
    return Api().post('/users', credentials)
  },
  getOrgName () {
    return Api().get('/orgs')
  }
}
