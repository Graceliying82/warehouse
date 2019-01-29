<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-layout column>
      <!-- Upload orders-->
      <v-flex mx-5>
          <v-alert
            v-show = showAlert1
            :type = alertType1
            outline>
              {{message1}}
            </v-alert>
          </v-flex>
      <v-flex ma-5>
        <panel title = 'Upload Orders'>
          <input type= "file" id="orderFile" @change='readFile($event)' accept=".csv">
        </panel>
        <v-card>
          <v-data-table
            :headers="ordersHeaders"
            :items="orderUpload"
            :rows-per-page-items="rowsPerPageItems"
            class="elevation-1"
          >
          <template v-for = "it in orderUpload" slot="items" slot-scope="props">
              <td
                :key="it.status + '-status'"
                class="text-xs-left">{{ props.item.status }}</td>
              <td
                :key="it.OrderID + '-OrderID'"
                class="text-xs-left">{{ props.item.OrderID }}</td>
              <td
                :key="it.TrackingNo + '-TrackingNo'"
                class="text-xs-left">
                {{ props.item.TrackingNo }}
              </td>
              <td
                :key="it.OrgName + '-OrgName'"
                class="text-xs-left">
                {{ props.item.OrgName }}
              </td>
              <td
                :key="it.UPC1 + '-UPC1'"
                class="text-xs-left">
                {{ props.item.UPC1 }}
              </td>
              <td
                :key="it.Qty1 + '-Qty1'"
                class="text-xs-left">
                {{ props.item.Qty1 }}
              </td>
              <td
                :key="it.UPC2 + '-UPC2'"
                class="text-xs-left">
                {{ props.item.UPC2 }}
              </td>
              <td
                :key="it.Qty2 + '-Qty2'"
                class="text-xs-left">
                {{ props.item.Qty2 }}
              </td>
              <td
                :key="it.UPC3 + '-UPC3'"
                class="text-xs-left">
                {{ props.item.UPC3 }}
              </td>
              <td
                :key="it.Qty3 + '-Qty3'"
                class="text-xs-left">
                {{ props.item.Qty3 }}
              </td>
              <td
                :key="it.UPC4 + '-UPC4'"
                class="text-xs-left">
                {{ props.item.UPC4 }}
              </td>
              <td
                :key="it.Qty4 + '-Qty4'"
                class="text-xs-left">
                {{ props.item.Qty4 }}
              </td>
              <td
                :key="it.UPC5 + '-UPC5'"
                class="text-xs-left">
                {{ props.item.UPC5 }}
              </td>
              <td
                :key="it.Qty5 + '-Qty5'"
                class="text-xs-left">
                {{ props.item.Qty5 }}
              </td>
            </template>
          </v-data-table>
        </v-card>
        <v-btn dark v-if='uploadButton' @click.prevent="upload">Upload to Server</v-btn>
        <v-btn dark @click.prevent="reset">Reset</v-btn>
      </v-flex>
      <!-- End Upload orders-->
      <!-- Show Orders For Shipping-->
        <v-layout row>
          <!-- Show OrderIDs-->
          <v-flex mx-5>
          <panel title="Show Orders for Shipping">
              <v-data-table
              :headers="shipmentHeaders"
              :items="orderForShip"
              :rows-per-page-items="rowsPerPageItems"
              class="elevation-1"
            >
            </v-data-table>
          </panel>
          </v-flex>
          <!-- End Show OrderIDs-->
          <v-flex>
            <v-flex >
                <v-text-field
                  autofocus
                  label="Order ID"
                  required
                  ></v-text-field>
              </v-flex>
          </v-flex>
          <!-- Show OrdersItems For Shipping-->
          <!-- End Show OrdersItems For Shipping-->
        </v-layout>
      <!-- End Show Orders For Shipping-->
    </v-layout>
  </div>
</template>

<script>
import * as csv from 'csvtojson'
import Shipment from '@/services/shipment'
export default {
  data () {
    return {
      ordersHeaders: [
        {
          text: 'Data Check',
          align: 'left',
          value: 'status'
        },
        { text: 'OrderID', align: 'left', value: 'OrderID' },
        { text: 'TrackingNo', align: 'left', value: 'TrackingNo' },
        { text: 'OrgName', align: 'left', value: 'OrgName' },
        { text: 'UPC1', align: 'left', value: 'UPC1' },
        { text: 'Qty1', align: 'left', value: 'Qty1' },
        { text: 'UPC2', align: 'left', value: 'UPC2' },
        { text: 'Qty2', align: 'left', value: 'Qty2' },
        { text: 'UPC3', align: 'left', value: 'UPC3' },
        { text: 'Qty3', align: 'left', value: 'Qty3' },
        { text: 'UPC4', align: 'left', value: 'UPC4' },
        { text: 'Qty4', align: 'left', value: 'Qty4' },
        { text: 'UPC5', align: 'left', value: 'UPC5' },
        { text: 'Qty5', align: 'left', value: 'Qty5' }
      ],
      shipmentHeaders: [
        { text: 'OrderID', align: 'left', value: 'orderID' },
        { text: 'TrackingNo', align: 'left', value: 'trNo' },
        { text: 'OrgName', align: 'left', value: 'orgNm' },
        { text: 'Status', align: 'left', value: 'status' },
        { text: 'Actions', align: 'left', value: 'TrackingNo' },
      ],
      orderForShip: [],
      alertType1: 'success',
      showAlert1: false,
      message1: '',
      orderUpload: [],
      serverOrder: [],
      uploadButton: false,
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
    reset () {
      this.clearAlert()
      this.orderUpload = []
      this.serverOrder = []
      this.uploadButton = false
    },
    // Wrap up FileReader as a promise
    readUploadedFileAsText (inputFile) {
      const temporaryFileReader = new FileReader()
      return new Promise((resolve, reject) => {
        temporaryFileReader.onerror = () => {
          temporaryFileReader.abort()
          reject(new DOMException('Problem parsing input file.'))
        }
        temporaryFileReader.onload = () => {
          resolve(temporaryFileReader.result)
        }
        temporaryFileReader.readAsText(inputFile)
      })
    },
    async readFile (event) {
      this.clearAlert()
      this.orderUpload = []
      let csvFile = event.target.files[0]
      try {
        let csvString = await this.readUploadedFileAsText(csvFile)
        this.orderUpload = await csv().fromString(csvString)
        this.parseOrder(this.orderUpload)
      } catch (error) {
        this.setAlert('error', error)
      }
    },
    // Check upload CSV file. If fields not pass check, user can not update it to server.
    parseOrder (orders) {
      this.uploadButton = true
      for (let aOrder of orders) {
        // aOrder[status] = 'Success'
        aOrder.status = 'Pass Check'
        // Order ID, trackingNo can not be empty. UPC is a must have
        if ((aOrder.OrderID === '') || (aOrder.TrackingNo === '') || (aOrder.UPC1 === '')) {
          aOrder.status = 'Fail Check'
        } else if (aOrder.UPC1 !== '') {
          if (isNaN(parseInt(aOrder.Qty1))) {
            aOrder.status = 'Fail Check'
            this.uploadButton = false
          }
          if (aOrder.UPC2 !== '') {
            if (isNaN(parseInt(aOrder.Qty2))) {
              aOrder.status = 'Fail Check'
              this.uploadButton = false
            }
            if (aOrder.UPC3 !== '') {
              if (isNaN(parseInt(aOrder.Qty3))) {
                aOrder.status = 'Fail Check'
                this.uploadButton = false
              }
              if (aOrder.UPC4 !== '') {
                if (isNaN(parseInt(aOrder.Qty4))) {
                  aOrder.status = 'Fail Check'
                  this.uploadButton = false
                }
                if (aOrder.UPC5 !== '') {
                  if (isNaN(parseInt(aOrder.Qty5))) {
                    aOrder.status = 'Fail Check'
                    this.uploadButton = false
                  }
                }
              }
            }
          }
        }
        if (aOrder.status === 'Fail Check') {
          this.setAlert('error', 'Not All Data passed! Please check before upload!')
        }
      }
    },
    // In upload json object, data are flat. Need to transfer it to nested Json. Also need to handle
    // one orderID with multiple lines.
    prepareForUpload (orders) {
      let readyUploadOrders = []
      for (let aOrder of orders) {
        if (aOrder.status === 'Pass Check') {
          let orderItems = []
          // Find UPCs which are not empty. Push them to orderItems
          if (aOrder.UPC1 !== '') {
            orderItems.push({'UPC': aOrder.UPC1.trim(), 'qty': parseInt(aOrder.Qty1)})
            if (aOrder.UPC2 !== '') {
              orderItems.push({'UPC': aOrder.UPC2.trim(), 'qty': parseInt(aOrder.Qty2)})
              if (aOrder.UPC3 !== '') {
                orderItems.push({'UPC': aOrder.UPC3.trim(), 'qty': parseInt(aOrder.Qty3)})
                if (aOrder.UPC4 !== '') {
                  orderItems.push({'UPC': aOrder.UPC4.trim(), 'qty': parseInt(aOrder.Qty4)})
                  if (aOrder.UPC5 !== '') {
                    orderItems.push({'UPC': aOrder.UPC5.trim(), 'qty': parseInt(aOrder.Qty5)})
                  }
                }
              }
            }
          }
          // Handle Merge Order
          let mergeOrder = false
          for (let aReadyUpload of readyUploadOrders) {
            // When orderID and tracking are equal, the orders should be merged
            if ((aReadyUpload.orderID === aOrder.OrderID.trim()) && (aReadyUpload.trNo === aOrder.TrackingNo.trim())) {
              // aReadyUpload.rcIts.concat(orderItems)
              Array.prototype.push.apply(aReadyUpload.rcIts, orderItems)
              mergeOrder = true
            }
          }
          if (!mergeOrder) {
            readyUploadOrders.push({
              'orderID': aOrder.OrderID.trim(),
              'trNo': aOrder.TrackingNo.trim(),
              'orgNm': aOrder.OrgName.trim(),
              'rcIts': orderItems,
              'status': 'ready'
            })
          }
        }
      }
      return readyUploadOrders
    },
    setOrderUploadStatus (orderID, status) {
      for (let aOrder of this.orderUpload) {
        if (aOrder.OrderID === orderID) {
          aOrder.status = status
          // console.log("After: " + aOrder.status )
        }
      }
      // console.log(this.orderUpload)
    },
    async uploadToServer () {
      // console.log(this.prepareForUplaod(this.orderUpload))
      try {
        let preparedUpload = this.prepareForUpload(this.orderUpload)
        for (let aUpload of preparedUpload) {
          let result = (await Shipment.post(aUpload)).data
          // console.log("Before: " + aUpload.orderID + '  ' + result)
          this.setOrderUploadStatus(aUpload.orderID, result)
        }
        this.setAlert('success', 'Done Uploading. Check each line for result.')
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
    upload () {
      this.uploadToServer().then(() => {
        this.$forceUpdate()
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
