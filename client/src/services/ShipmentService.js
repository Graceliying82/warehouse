import Api from '@/services/Api'

export default {
  post (data) {
    return Api().post('/shipments', data)
  },
  getShipingOrders (startDate, endDate, status) {
    return Api().get('/shipments' + '?startDate=' +
       startDate + ' 00:00:00' + '&endDate=' + endDate + ' 23:59:59' + '&status=' + status)
  },
  getByShipmentId (data) {
    return Api().post('/shipments/getByShipmentId', data)
  },
  ship (data) {
    return Api().post('/shipments/ship', data)
  },
  // app.post('/shipment/deleteByTracking', Shipment.deleteByTracking)
  deleteByTracking (data) {
    return Api().post('/shipments/deleteByTracking', data)
  },
  refreshShipStatus () {
    return Api().post('/shipments/refreshShipStatus')
  }
}
