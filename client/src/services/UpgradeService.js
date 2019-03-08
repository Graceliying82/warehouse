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
  }
}
