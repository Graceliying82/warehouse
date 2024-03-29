import Api from '@/services/Api'

export default {
  moveInBatch (data) {
    return Api().post('/locInvMoveBatch', data)
  },
  getByUPC (upcs) {
    return Api().get('/prodInv/' + upcs)
  },
  getLocInvByUPC (UPC) {
    return Api().get('/locInv/' + UPC)
  },
  getSellerInvAndOrgList (UPC) {
    return Api().get('/getSellerInvAndOrgList/' + UPC)
  },
  getAllProductInventory () {
    return Api().get('/prodInvAll')
  },
  checkBalance () {
    return Api().post('/prodInvCheckBalance')
  },
  prodInvAdjustBatch (data) {
    return Api().post('/prodInvAdjustBatch', data)
  },
  getUPCFamilyListByOrg (data) {
    return Api().post('/prodInv/getUPCFamilyListByOrg', data)
  }
}
