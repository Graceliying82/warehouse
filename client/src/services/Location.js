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
  },
  getProdInvByLoc (loc) {
    return Api().get('/prodInvByLoc/' + loc)
  },
  changeLocationDescription (data) {
    return Api().post('/changeLocDesc', data)
  },
  deleteLocation (locID) {
    return Api().post('/deleteLoc/' + locID)
  }
}
