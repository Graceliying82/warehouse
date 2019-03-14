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
  cancelUpgrade (data) {
    return Api().post('/upgrades/cancelUpgrade', data)
  },
  // app.get('/upgrades/getUpdPrdNeedInstr', Upgrade.getUpdPrdNeedInstr)
  getUpdPrdNeedInstr () {
    return Api().get('/upgrades/getUpdPrdNeedInstr')
  },
  fastUpgrade (data) {
    return Api().post('/upgrades/fastUpgrade', data)
  }
}
