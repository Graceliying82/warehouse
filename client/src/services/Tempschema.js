import Api from '@/services/Api'

export default {
  post (data) {
    return Api().post('/tempschema', data)
  },
  getByID (id) {
    return Api().get('/tempschema' + '?id=' + id)
  },
  deleteSchemaValue (data) {
    return Api().post('/tempschema/deleteValue', data)
  }
}
