import Api from '@/services/Api'

export default {
  post (data) {
    return Api().post('/orgs', data)
  },
  get () {
    return Api().get('/orgs')
  },
  getByName (name) {
    return Api().get('/orgs/' + name)
  },
  put (data) {
    return Api().put('/orgs', data)
  }
}
