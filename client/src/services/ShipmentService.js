import Api from '@/services/Api'

export default {
  post (data) {
    return Api().post('/shipments', data)
  },
  getShipingOrders (startDate, endDate, status) {
    return Api().get('/shipments' + '?startDate=' +
       startDate + ' 00:00:00' + '&endDate=' + endDate + ' 23:59:59' + '&status=' + status)
  },
  getByShipmentId (id) {
    return Api().get('/shipments/' + id)
  },
  ship (data) {
    return Api().post('/shipment/ship', data)
  }
}
