import Api from '@/services/Api'

export default {
  post (data) {
    return Api().post('/locations', data)
  },
  get () {
    return Api().get('/locations')
  },
  checkLocationExisted (locID) {
    return Api().get('/locations' + '?locID=' + locID)
  }
}
