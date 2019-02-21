<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-layout column ma-5>
      <v-flex xs8>
        <v-alert
          v-show = showAlert1
          :type = alertType1
          outline>
            {{message1}}
          </v-alert>
      </v-flex>
      <!-- Scan trackings for batch picking -->
      <v-flex>
        <panel title='Batch Pick'>
          <h1>Please Scan trackings</h1>
          <!-- Tracking Manually Input -->
          <v-layout row>
            <v-flex>
            <v-text-field
              label="Manually Add Tracking Here"
              v-model="inputTracking"
              v-on:keydown.enter="addTracking()"
              required
              ></v-text-field>
          </v-flex>
          <v-btn dark @click.prevent="addTracking()">Add</v-btn>
          </v-layout>
          <!-- Show Tracking List -->
          <v-flex my-2>
            <v-data-table
              :headers="shipmentHeaders"
              :items="shipments"
              :rows-per-page-items="rowsPerPageItems"
              class="elevation-1"
              >
              <template  slot="items" slot-scope="props">
                <td
                  class="text-xs-left">{{ props.item.orderID }}</td>
                <td
                  class="text-xs-left">
                  {{ props.item._id }}
                </td>
                <td
                  class="text-xs-left">
                  {{ props.item.orgNm }}
                </td>
                <td
                  class="text-xs-left">
                  {{ props.item.status }}
                </td>
                <td
                  class="justify-center layout px-0">
                  <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                    <v-icon color="teal">delete_forever</v-icon>
                  </v-btn>
                </td>
              </template>
            </v-data-table>
          </v-flex>
          <v-layout row>
          <p style="color:red;font-weight:normal">Please delete all 'backOrder' orders before click process.</p>
          <p>It may take a while to process.</p>
          </v-layout>
          <v-btn dark @click.prevent="processOrders">Process</v-btn>
          <v-btn dark @click.prevent="clearData()">Clear</v-btn>
        </panel>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Shipment from '@/services/Shipment'
export default {
  data () {
    return {
      alertType1: 'success',
      showAlert1: false,
      message1: '',
      inputTracking: '',
      shipments: [],
      shipmentHeaders: [
        { text: 'OrderID', align: 'left', value: 'orderID' },
        { text: 'TrackingNo', align: 'left', value: 'trNo' },
        { text: 'OrgName', align: 'left', value: 'orgNm' },
        { text: 'Status', align: 'left', value: 'status' },
        { text: 'Actions', align: 'left', value: 'TrackingNo' }
      ],
      rowsPerPageItems: [30, 60, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 }]
    }
  },
  methods: {
    clearAlert () {
      this.showAlert1 = false
      this.message1 = ''
    },
    setAlert (type, message) {
      this.message1 = message
      this.alertType1 = type
      this.showAlert1 = true
    },
    async getShipmentByTracking (tracking) {
      try {
        this.clearAlert()
        let result = (await Shipment.getByShipmentId(tracking)).data
        if (result.length !== 0) {
          this.shipments.push(result)
          this.inputTracking = ''
        } else {
          this.setAlert('error', 'Tracking no ' + tracking + ' not found!')
          this.inputTracking = ''
        }
      } catch (error) {
        if (!error.response) {
          // network error
          this.setAlert('error', 'Network Error: Fail to connet to server')
        } else if (error.response.data.error.includes('jwt')) {
          console.log('jwt error')
          this.$store.dispatch('resetUserInfo', true)
          this.$router.push('/login')
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.statusText)
          this.setAlert('error', error.response.data.error)
        }
      }
    },
    deleteItem (item) {
      let idx = this.shipments.indexOf(item)
      if (idx !== -1) {
        this.shipments.splice(idx, 1)
      }
    },
    addTracking () {
      if (this.inputTracking !== '') {
        this.getShipmentByTracking(this.inputTracking)
      }
    },
    clearData () {
      this.shipments = []
      this.inputTracking = ''
      this.clearAlert()
    },
    checkBackOrders () {
      for (let aShip of this.shipments) {
        if (aShip.status === 'backOrder') {
          return true
        }
      }
      return false
    },
    async processOrders () {
      try {
        this.clearAlert()
        if (this.shipments.length === 0) {
          this.setAlert('error', 'Please input tracking first!')
        } else {
          if (this.checkBackOrders()) {
            this.setAlert('error', 'Please delete all `backOrder` orders before click process')
          } else {
            console.log('Passed!')
          }
        }
      } catch (error) {
        if (!error.response) {
          // network error
          this.setAlert('error', 'Network Error: Fail to connet to server')
        } else if (error.response.data.error.includes('jwt')) {
          console.log('jwt error')
          this.$store.dispatch('resetUserInfo', true)
          this.$router.push('/login')
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.statusText)
          this.setAlert('error', error.response.data.error)
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
