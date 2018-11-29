import Api from '@/services/Api'

export default {
  post (credentials) {
    return Api().post('/inventory', credentials)
  },
  get () {
    return Api().get('/inventory')
  },
  getByDates (startDate, endDate, orgName) {
    if ((orgName === 'All') || (orgName === '')) {
      return Api().get('/inventory' + '?startDate=' +
      startDate + ' 00:00:00' + '&endDate=' + endDate + ' 23:59:59')
    } else {
      return Api().get('/inventory' + '?startDate=' +
      startDate + ' 00:00:00' + '&endDate=' + endDate + ' 23:59:59' +
      '&orgNm=' + orgName)
    }
  }
}
