import Api from '@/services/Api'

export default {
  post (data) {
    return Api().post('/users', data)
  },
  get () {
    return Api().get('/users')
  }
}
