import Api from '@/services/Api'

export default {
  login (credentials) {
    return Api().post('/login', credentials)
  },
  createUser (credentials) {
    return Api().post('/users', credentials)
  }
}
