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
    return Api().get('/products' + '?category=' + category)
  },
  getUPCByPid (PID) {
    return Api().get('/getUPCByPid/' + PID)
  },
  updateProduct (data) {
    return Api().post('/receiveUpdate', data)
  },
  deleteInvReceive (data) {
    return Api().post('/receiveDelete', data)
  },
  deleteConfig (data) {
    return Api().post('/products/deleteConfig', data)
  },
  getUPCsByOrig (data) {
    return Api().post('/products/getUPCsByOrig', data)
  },
  deleteProduct (data) {
    return Api().post('/products/deleteProduct', data)
  },
  createPart (data) {
    return Api().post('/products/parts', data)
  }
}
