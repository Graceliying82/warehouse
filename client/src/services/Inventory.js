import Api from '@/services/Api'

export default {
  post (credentials) {
    return Api().post('/inventory', credentials)
  },
  get () {
    return Api().get('/inventory')
  },
  getByDates (startDate, endDate) {
    return Api().get('/inventory' + '?startDate=' + startDate + ' 00:00:00' + '&endDate=' + endDate + ' 23:59:59')
  }
}
