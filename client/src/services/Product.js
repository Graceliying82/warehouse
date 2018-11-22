import Api from '@/services/Api'

export default {
  post (credentials) {
    return Api().post('/products', credentials)
  },
  get () {
    return Api().get('/products')
  }
}
