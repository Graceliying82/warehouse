import Api from '@/services/Api'

export default {
  post (data) {
    return Api().post('/upgrade', data)
  }
}
