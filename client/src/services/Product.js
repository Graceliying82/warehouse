import Api from '@/services/Api'

export default {
  post (data) {
    return Api().post('/products', data)
  },
  get () {
    return Api().get('/products')
  },
  put (data) {
    return Api().put('/products', data)
  },
  getProductByUPC (UPC) {
    return Api().get('/products/' + UPC)
  },
  getProductsByFilter (category) {
    console.log('Here')
    return Api().get('/products' + '?category=' + category)
  },
  updateProduct (data) {
    return Api().post('/receiveUpdate', data)
  },
  deleteProduct (data) {
    return Api().post('/receiveDelete', data)
  },
  deleteConfig (data) {
    return Api().post('/products/deleteConfig', data)
  },
  getUPCsByOrig (data) {
    return Api().post('/products/getUPCsByOrig', data)
  }
}
