<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-layout justify-center>
      <h1>Package your order</h1>
    </v-layout>
    <v-layout>
      <v-flex>
          <v-alert
            v-show = showAlert
            :type = alertType
            outline>
              {{message}}
            </v-alert>
        </v-flex>
    </v-layout>
    <v-dialog v-model="showAlertDialog" max-width="1000px">
      <v-card>
        <v-card-text>
            <h2 pt-8>{{message}}</h2>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-layout justify-center column>
        <!-- Scan area -->
          <v-layout justify-center>
            <v-toolbar-title>Please scan or input : </v-toolbar-title>
            <v-toolbar-title style="color:red;font-weight:bold">{{currentScan}}</v-toolbar-title>
          </v-layout>
          <!-- Manual input area-->
          <v-layout mx-5 >
            <v-text-field
              label="Tracking No"
              v-model="trackingInput"
              id="trackingNo"
              clearable
              v-on:keydown.enter="changeTrackingMan"
            ></v-text-field>
            <v-btn @click = "changeTrackingMan">Find</v-btn>
          </v-layout>
    </v-layout>
    <!-- End Manual input area-->
    <v-layout row v-if="showResult" justify-center>
      <v-flex mx-5>
        <v-text-field
          slot="activator"
          label='Tracking No'
          v-model="trackingNo"
          readonly
        ></v-text-field>
      </v-flex >
      <v-flex mx-5>
        <v-text-field
          slot="activator"
          label="Order ID"
          v-model="orderID"
          readonly
        ></v-text-field>
      </v-flex>
      <v-flex mx-5>
        <v-text-field
          slot="activator"
          label="Organization Name"
          v-model="orgName"
          readonly
        ></v-text-field>
      </v-flex>
      <v-flex mx-5>
        <v-text-field
          slot="activator"
          label="Status"
          v-model="status"
          readonly
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row v-if="showResult" justify-center mx-5>
    <!-- Show Order Detail-->
    <v-flex lg4 mr-5>
      <v-flex v-for = "(detail, i) in orderItems" :key = i my-2 >
        <v-card v-bind:class = detail.style :key="'card'+ i" >
          <v-layout row align-start>
          <v-flex mt-2 mx-2 wrap>
            <v-list-tile-content>
              <v-list-tile-sub-title :key="'UPC'+ i" >UPC  :  {{ detail.UPC }}</v-list-tile-sub-title>
              <v-list-tile-sub-title :key="'PID'+ i" >PID  :  {{ detail.pid }}</v-list-tile-sub-title>
              <v-list-tile-sub-title :key="'PrdName'+ i">Product Name  :  {{ detail.prdNm }}</v-list-tile-sub-title>
              <v-list-tile-sub-title :key="'RQTY'+ i">Required Qty  :  {{ detail.qty }}</v-list-tile-sub-title>
              <v-list-tile-sub-title :key="'SQTY'+ i">Scanned Qty  :  {{ detail.scQty }}</v-list-tile-sub-title>
              <v-list-tile-sub-title>Seller Inventroy  :  {{ detail.sellerInv }}</v-list-tile-sub-title>
              <v-list-tile-sub-title style="color:red;" v-if=detail.warning>Not Enough Inventory for this Seller</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-flex>
    <v-flex lg4>
      <h1>Scan Items</h1>
      <v-data-table
        :headers="scanItemsHeader"
        :items="UPCandSN"
        :rows-per-page-items="rowsPerPageItems"
        class="elevation-1"
        >
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">{{ props.item.UPC }}</td>
          <td class="text-xs-left">{{ props.item.SN }}</td>
        </template>
      </v-data-table>
      <v-btn dark @click.prevent="submit">submit</v-btn>
      <v-btn dark @click.prevent="clearUp">Clear</v-btn>
    </v-flex>
    <v-flex lg4>
    </v-flex>
    </v-layout>
  <!-- End Show Order Detail-->
  <!-- Scaned Items -->
  <!-- End Scaned Items -->
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
      showAlertDialog: false,
      attributes: {
        barcode: '',
        scannerSensitivity: 100,
        callback: null,
        hasListener: false,
        pressedTime: []
      },
      currentScan: 'Tracking No',
      trackingInput: '',
      // items to be showed on pages
      trackingNo: '',
      orderID: '',
      orgName: '',
      status: '',
      showResult: false,
      scannedItems: [],
      UPCandSN: [],
      orderItems: [],
      scanItemsHeader: [
        { text: 'UPC', align: 'left', value: 'UPC' },
        { text: 'SN', align: 'left', value: 'SN' }
      ],
      scannedUPC: '',
      scannedSN: '',
      HighLightIdx: -1,
      styles: ['grey lighten-4', 'deep-orange lighten-1', 'green darken-3'],
      rowsPerPageItems: [30, 60, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 }]
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
    setAlertDialog (message) {
      this.message = message
      this.showAlertDialog = true
    },
    clearUp () {
      this.currentScan = 'Tracking No'
      this.trackingNo = ''
      this.orderID = ''
      this.orgName = ''
      this.status = ''
      this.showResult = false
      this.scannedItems = []
      this.orderItems = []
      this.UPCandSN = []
      this.scannedUPC = ''
      this.scannedSN = ''
      this.HighLightIdx = -1
      this.trackingInput = ''
    },
    async handleTrackingNo (trackingNo) {
      // console.log(trackingNo)
      // Logic to get order information by tracking No
      try {
        let result = (await Shipment.getByShipmentId(trackingNo)).data
        if (result) {
          // console.log('Tracking found!')
          console.log(result)
          this.trackingNo = result._id
          this.orderID = result.orderID
          this.orgName = result.orgNm
          this.status = result.status
          this.orderItems = result.rcIts
          for (let item of this.orderItems) {
            item.scQty = 0
            item.style = this.styles[0]
          }
          this.showResult = true
          // console.log(this.orderItems)
          if ((this.status === 'ready')) {
            this.currentScan = 'UPC'
          } else if ((this.status === 'upgrade')) {
            this.setAlert('error', 'Package has item upgrading!')
          } else if ((this.status === 'shipped')) {
            this.setAlert('error', 'Package has been shipped! Try other tracking no.')
          }
        } else {
          this.setAlert('error', 'Tracking ' + trackingNo + ' is not existed! Please create before use!')
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
    changeTrackingMan () {
      this.clearAlert()
      this.clearUp()
      let aTracking = document.getElementById('trackingNo').value.trim()
      this.handleTrackingNo(aTracking)
    },
    getIndexUPC (UPC, items) {
      let index = -1
      for (let i = 0; i < items.length; i++) {
        if (items[i].UPC === UPC) {
          index = i
          break
        }
      }
      return index
    },
    updateScannedItems () {
      let idxScannedItems = -1
      this.UPCandSN.push({
        UPC: this.scannedUPC,
        SN: this.scannedSN
      })
      for (let i = 0; i < this.scannedItems.length; i++) {
        if ((this.scannedItems[i].UPC === this.scannedUPC)) {
          idxScannedItems = i
          break
        }
      }
      if (idxScannedItems !== -1) {
        this.$set(this.scannedItems[idxScannedItems], 'qty', (this.scannedItems[idxScannedItems].qty + 1))
        // console.log(this.scannedItems)
      } else {
        this.scannedItems.push({
          UPC: this.scannedUPC,
          qty: 1
        })
      }
    },
    onBarcodeScanned (barcode) {
      this.clearAlert()
      if (this.currentScan === 'Tracking No') {
        this.handleTrackingNo(barcode)
      } else if (this.currentScan === 'UPC') {
        // this is a UPC
        let idx = this.getIndexUPC(barcode, this.orderItems)
        if (idx === -1) {
          this.setAlertDialog('UPC not for this Order. Please check!')
        } else {
          // Hight Light UPC chosen
          // if (this.HighLightIdx !== idx) {
          //   if ((this.HighLightIdx !== -1) && (this.orderItems[idx].style !== this.styles[2])) {
          //     // If Style already changed to green. Don't change color any more
          //     console.log(this.HighLightIdx)
          //     console.log(this.orderItems[this.HighLightIdx].style)
          //     console.log(this.styles[2])
          //     this.orderItems[this.HighLightIdx].style = this.styles[0]
          //   }
          //   this.orderItems[idx].style = this.styles[1]
          //   this.HighLightIdx = idx
          //   this.$forceUpdate()
          // }
          if (this.HighLightIdx !== idx) {
            // current : this.orderItems[idx].style
            // previous: this.orderItems[this.HighLightIdx].style
            if (this.HighLightIdx !== -1) {
              if (this.orderItems[this.HighLightIdx].style !== this.styles[2]) {
                this.orderItems[this.HighLightIdx].style = this.styles[0]
              }
            }
            if (this.orderItems[idx].style !== this.styles[2]) {
              this.orderItems[idx].style = this.styles[1]
            }
            this.HighLightIdx = idx
            this.$forceUpdate()
          }
          // Handle logic to decrease UPC from current available inventory
          if (this.orderItems[idx].scQty < this.orderItems[idx].qty) {
            // this.orderItems[idx].scQty++
            this.$set(this.orderItems[idx], 'scQty', (this.orderItems[idx].scQty + 1))
            if (this.orderItems[idx].qty === this.orderItems[idx].scQty) {
              this.orderItems[idx].style = this.styles[2]
            }
            this.scannedUPC = barcode
            // console.log(this.orderItems)
            this.currentScan = 'SN'
            this.$forceUpdate()
          } else {
            this.setAlertDialog('Scanned more than required. Please check!')
          }
        }
      } else if (this.currentScan === 'SN') {
        this.scannedSN = barcode
        this.updateScannedItems()
        this.currentScan = 'UPC'
      }
    },
    checkData () {
      let passCheck = true
      for (let aOrder of this.orderItems) {
        if (aOrder.qty !== aOrder.scQty) {
          passCheck = false
          break
        }
      }
      return passCheck
    },
    async submit () {
      this.clearAlert()
      if (this.checkData()) {
        console.log('Passed Check!')
        try {
          await Shipment.ship({
            '_id': this.trackingNo,
            'orgNm': this.orgName,
            'rcIts': this.scannedItems,
            'UPCandSN': this.UPCandSN
          })
          this.setAlertDialog('Shipment submit successfully.')
          this.clearUp()
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
      } else {
        this.setAlertDialog('Not all items been scanned. Please check!')
      }
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
.HLclass {
  color: red;
}
</style>
