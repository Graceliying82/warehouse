import Api from '@/services/Api'

export default {
  post (data) {
    return Api().post('/upgrades', data)
  },
  getUpgByStatus (status) {
    return Api().get('/upgrades' + '?status=' + status)
  },
  get () {
    return Api().get('/upgrades')
  },
  cancelReq (data) {
    return Api().post('/upgrades/cancelReq', data)
  },
  // app.get('/upgrades/getUpdPrdNeedInstr', Upgrade.getUpdPrdNeedInstr)
  getUpdPrdNeedInstr () {
    return Api().get('/upgrades/getUpdPrdNeedInstr')
  }
}
