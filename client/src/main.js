// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import { sync } from 'vuex-router-sync'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import store from '@/store/store'
import Panel from '@/components/globals/Panel'
import JsonExcel from 'vue-json-excel'
import VueBarcodeScanner from 'vue-barcode-scanner'

Vue.config.productionTip = false

Vue.use(Vuetify)

Vue.component('panel', Panel)

Vue.use(VueBarcodeScanner)

sync(store, router)

Vue.component('downloadExcel', JsonExcel)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
