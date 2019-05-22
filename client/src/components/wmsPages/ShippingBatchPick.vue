<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-layout column ma-5>
      <v-flex xs8>
        <v-alert
          v-show = showAlert
          :type = alertType
          outline>
            {{message}}
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
import Shipment from '@/services/ShipmentService'
export default {
  data () {
    return {
      alertType: 'success',
      showAlert: false,
      message: '',
      inputTracking: '',
      shipments: [],
      shipmentHeaders: [
        { text: 'OrderID', align: 'left', value: 'orderID' },
        { text: 'TrackingNo', align: 'left', value: 'trNo' },
        { text: 'OrgName', align: 'left', value: 'orgNm' },
        { text: 'Status', align: 'left', value: 'status' },
        { text: 'Actions', align: 'left', value: 'TrackingNo' }
      ],
      rowsPerPageItems: [30, 60, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 }],
      upcQtyList: [],
      Colors: ['grey lighten-4', 'red'],
      // handle barcode scanning
      attributes: {
        barcode: '',
        scannerSensitivity: 100,
        callback: null,
        hasListener: false,
        pressedTime: []
      }
    }
  },
  methods: {
    clearAlert () {
      this.showAlert = false
      this.message = ''
    },
    setAlert (type, message) {
      this.message = message
      this.alertType = type
      this.showAlert = true
    },
    clearData () {
      this.inputTracking = ''
      this.shipments = []
      this.showPrintable = false
      this.showPickUp = false
      this.includeWMS = false
      this.upcQtyList = []
      this.retUPCQtyList = []
      this.pickUPList = []
    },
    isTrackingScanned (tracking) {
      let scanned = false
      for (let shipment of this.shipments) {
        if (shipment._id === tracking) {
          scanned = true
          break
        }
      }
      return scanned
    },
    async getShipmentByTracking (tracking) {
      try {
        this.clearAlert()
        if (this.isTrackingScanned(tracking)) {
          this.setAlert('error', 'Tracking no ' + tracking + ' has been scanned!')
          this.inputTracking = ''
        } else {
          let result = (await Shipment.getByShipmentId({
            'trackingNo': tracking,
            'orderID': ''
          })).data
          if (result) {
            this.shipments.push(result)
            this.inputTracking = ''
          } else {
            this.setAlert('error', 'Tracking no ' + tracking + ' not found!')
            this.inputTracking = ''
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
    },
    deleteItem (item) {
      let idx = this.shipments.indexOf(item)
      if (idx !== -1) {
        this.shipments.splice(idx, 1)
      }
    },
    addTracking () {
      if (this.inputTracking !== '') {
        this.getShipmentByTracking(this.inputTracking.trim())
      }
    },
    async onBarcodeScanned (barcode) {
      this.getShipmentByTracking(barcode)
    },
    checkBackOrders () {
      for (let aShip of this.shipments) {
        if (aShip.status === 'backOrder') {
          return true
        }
      }
      return false
    },
    async createPickList () {
      // prepare UPC list from this.shipments
      for (let ship of this.shipments) {
        for (let item of ship.rcIts) {
          let idx = -1
          for (let i = 0; i < this.upcQtyList.length; i++) {
            if (item.UPC === this.upcQtyList[i].UPC) {
              this.upcQtyList[i].qty += item.qty
              idx = i
              break
            }
          }
          if (idx === -1) {
            this.upcQtyList.push({UPC: item.UPC, qty: item.qty})
          }
        }
      }
      console.log(this.upcQtyList)
      this.$router.push({
        name: 'batchPickPlan',
        params: { upcQtyList: this.upcQtyList }
      })
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
            console.log(this.shipments)
            this.createPickList()
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
    },
    // Handle Barcode Input
    // check whether the keystrokes are considered as scanner or human
    checkInputElapsedTime (timestamp) {
      // push current timestamp to the register
      this.attributes.pressedTime.push(timestamp)
      // when register is full (ready to compare)
      if (this.attributes.pressedTime.length === 2) {
        // compute elapsed time between 2 keystrokes
        let timeElapsed = this.attributes.pressedTime[1] - this.attributes.pressedTime[0]
        // too slow (assume as human)
        if (timeElapsed >= this.attributes.scannerSensitivity) {
          // put latest key char into barcode
          this.attributes.barcode = event.key
          // remove(shift) first timestamp in register
          this.attributes.pressedTime.shift()
          // not fast enough
          return false
        } else {
          // fast enough (assume as scanner)
          // reset the register
          this.attributes.pressedTime = []
        }
      }
      // not able to check (register is empty before pushing) or assumed as scanner
      return true
    },
    addListener (type) {
      if (this.attributes.hasListener) {
        this.removeListener(type)
      }
      window.addEventListener(type, this.onInputScanned)
      this.attributes.hasListener = true
    },
    removeListener (type) {
      if (this.attributes.hasListener) {
        window.removeEventListener(type, this.onInputScanned)
        this.attributes.hasListener = false
      }
    },
    onInputScanned (event) {
      // ignore other keydown event that is not a TAB, so there are no duplicate keys
      if (event.type === 'keydown' && event.keyCode !== 9) {
        return
      }
      if (this.checkInputElapsedTime(Date.now())) {
        if ((event.keyCode === 13 || event.keyCode === 9) && this.attributes.barcode !== '') {
          // scanner is done and trigger Enter/Tab then clear barcode and play the sound if it's set as true
          this.attributes.callback(this.attributes.barcode)
          // clear textbox
          this.attributes.barcode = ''
          // clear pressedTime
          this.attributes.pressedTime = []
          // prevent TAB navigation for scanner
          if (event.keyCode === 9) {
            event.preventDefault()
          }
        } else {
          // scan and validate each charactor
          this.attributes.barcode += event.key
        }
      }
    },
    barcodeInit (callback) {
      this.addListener('keypress')
      this.addListener('keydown')
      this.attributes.callback = callback
    },
    barcodeDestroy () {
      this.removeListener('keypress')
      this.removeListener('keydown')
    }
  },
  created () {
    this.barcodeInit(this.onBarcodeScanned)
  },
  destroyed () {
    this.barcodeDestroy()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
