import Api from '@/services/Api'

export default {
  post (data) {
    return Api().post('/instructions', data)
  },
  getByID (data) {
    return Api().post('/instructions/getByID', data)
  }
}
