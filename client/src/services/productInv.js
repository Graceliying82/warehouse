import Api from '@/services/Api'

export default {
  moveInBatch (data) {
    return Api().post('/locInvMoveBatch', data)
  },
  getByUPC (upcs) {
    return Api().get('/prodInv/' + upcs)
  },
  getAllProductInventory () {
    return Api().get('/prodInvAll')
  },
  checkBalance () {
    return Api().post('/prodInvCheckBalance')
  },
  prodInvAdjustBatch (data) {
    return Api().post('/prodInvAdjustBatch', data)
  }
  // get () {
  //   return Api().get('/locations')
  // },
  // checkLocationExisted (locID) {
  //   return Api().get('/locations'+ '?locID=' + locID)
  // }
}
