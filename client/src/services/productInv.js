import Api from '@/services/Api'

export default {
  moveInBatch (data) {
    return Api().post('/locInvMoveBatch', data)
  },
  // get () {
  //   return Api().get('/locations')
  // },
  // checkLocationExisted (locID) {
  //   return Api().get('/locations'+ '?locID=' + locID)
  // }
}
