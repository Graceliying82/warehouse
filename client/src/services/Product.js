import Api from '@/services/Api'

export default {
  post (data) {
    return Api().post('/products', data)
  },
  get () {
    return Api().get('/products')
  },
  updateProduct (data) {
    return Api().post('/receiveUpdate', data)
  }
  
}
