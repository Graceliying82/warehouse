import Api from '@/services/Api'

export default {
  post (data) {
    return Api().post('/instructions', data)
  },
  get () {
    return Api().get('/instructions')
  },
  getByID (data) {
    return Api().post('/instructions/getByID', data)
  }
}
