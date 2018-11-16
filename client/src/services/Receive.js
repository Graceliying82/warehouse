import Api from '@/services/Api'

export default {
  receive (credentials) {
    return Api().post('/receive', credentials)
  }
}
