import Api from '@/services/Api'

export default {
  post (credentials) {
    return Api().post('/inventory', credentials)
  },
  get () {
    return Api().get('/inventory')
  }
}
