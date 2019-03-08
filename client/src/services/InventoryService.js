import Api from '@/services/Api'

export default {
  post (data) {
    return Api().post('/inventory', data)
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
  },
  checkTrackingExisted (trackingNo) {
    return Api().get('/inventory' + '?trackingNo=' + trackingNo)
  }
}
