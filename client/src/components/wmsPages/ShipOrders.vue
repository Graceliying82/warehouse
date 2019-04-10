<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-dialog v-model="showAlertDialog" max-width="1000px">
      <v-card>
        <v-card-text>
            <h2 pt-8>{{message}}</h2>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showDeleteDialog" max-width="1000px">
      <v-card>
        <v-card-text>
            <h2 pt-8>{{message4Delete}}</h2>
        </v-card-text>
        <v-btn dark @click.prevent="confirmDialog">confirm</v-btn>
        <v-btn dark @click.prevent="cancelDialog">cancel</v-btn>
      </v-card>
    </v-dialog>
    <v-layout mx-5>
      <v-flex sm6>
        <v-select
          :items="actionChoice"
          v-model="action"
          label="Please Choose What to Do"
          @change="changeAction()"
          required></v-select>
      </v-flex>
    </v-layout>
    <v-layout column>
      <!-- Show Orders For Shipping-->
        <v-layout column v-if=showAction0>
          <!-- Show OrderIDs-->
          <v-flex mx-5>
          <panel title="Show Orders for Shipping">
            <!-- Filter Set-->
              <v-layout>
                <v-flex mr-5 lg3 xs5>
                <v-select
                  :items ="statusType"
                  v-model="statusTypeFilter"
                  label="Status"
                  @change = "changeFilter()"
                  required></v-select>
                </v-flex>
                <v-flex mx-5 v-if="statusTypeFilter === 'all'">
                <v-menu
                  :close-on-content-click="false"
                  v-model="menu"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px">
                  <v-text-field
                    slot="activator"
                    v-model="startDate"
                    label="Choose a start Date"
                    prepend-icon="event"
                    readonly
                  ></v-text-field>
                  <v-date-picker
                    v-model="startDate"
                    @change = "changeFilter()"
                    @input="menu = false">
                  </v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex mx-5 v-if="statusTypeFilter === 'all'">
                <span
                  class="title font-weight-light"
                  v-text="slider"
                  ></span>
                <span class="subheading font-weight-light mr-3">Days</span>
                <span class="body-1 font-weight-light">End Date: </span>
                <span class="subheading font-weight-light"
                  v-text="endDate"></span>
                <v-slider
                  v-model="slider"
                  :min="1"
                  :max="30"
                  label="Days to show"
                  light
                  @change = "changeFilter()"
                ></v-slider>
              </v-flex>
            </v-layout>
          <!-- End Filter Set-->
              <v-data-table
              :headers="shipmentHeaders"
              :items="orderForShip"
              :rows-per-page-items="rowsPerPageItems"
              class="elevation-1"
              >
                <template  slot="items" slot-scope="props">
                  <tr @click="showDetail4Item(props.item)" >
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
                      class="text-xs-left">
                      <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                        <v-icon color="teal">delete_forever</v-icon>
                      </v-btn>
                    </td>
                  </tr>
              </template>
              </v-data-table>
          </panel>
          </v-flex>
          <!-- End Show OrderIDs-->
          <v-flex mt-5>
            <!--
            <v-btn dark
              v-if = showOrderInv
              @click.prevent="printContent()">Print Detail</v-btn>
            -->
            <v-layout>
              <v-flex mx-5>
                <v-text-field
                  label="Search By Tracking No"
                  v-model="trackingMan"
                  v-on:keydown.enter="showDetailManByTracking"
                  ></v-text-field>
              </v-flex>
              <v-flex mx-5>
                <v-text-field
                  label="Search By Order ID"
                  v-model="orderID"
                  v-on:keydown.enter="showDetailManByOID"
                  ></v-text-field>
              </v-flex>
            </v-layout>
            <v-flex mx-5>
              <v-alert
                v-show = showAlert
                :type = alertType
                outline>
                  {{message}}
                </v-alert>
            </v-flex>
            <!-- Show Order Detail-->
            <div>
            <v-flex v-if = showOrderInv>
              <div class="font-weight-bold text-xs-left">Order ID: {{orderBasic.orderID}} </div>
              <div class="font-weight-bold text-xs-left">Tracking NO: {{orderBasic._id}}</div>
              <div class="font-weight-bold text-xs-left">Org Name : {{orderBasic.orgNm}}</div>
              <div class="font-weight-bold text-xs-left">Status : {{orderBasic.status}}</div>
              <br>
              <v-card color = 'grey lighten-4' v-if="orderBasic.status==='shipped'">
                <v-layout column>
                  <v-flex>
                    <h2>UPC and Quantity</h2>
                    <v-data-table
                      :headers="shippedHeader1"
                      :items="orderBasic.orderDetail"
                      :rows-per-page-items="rowsPerPageItems"
                      class="elevation-1"
                      >
                        <template  slot="items" slot-scope="props">
                            <td class="text-xs-left">{{ props.item.UPC }}</td>
                            <td class="text-xs-left">{{ props.item.pid }}</td>
                            <td class="text-xs-left">{{ props.item.qty }}</td>
                        </template>
                    </v-data-table>
                  </v-flex>
                  <v-flex>
                    <h2>UPC and SN</h2>
                    <v-data-table
                      :headers="shippedHeader2"
                      :items="orderBasic.UPCandSN"
                      :rows-per-page-items="rowsPerPageItems"
                      class="elevation-1"
                      >
                        <template  slot="items" slot-scope="props">
                            <td class="text-xs-left">{{ props.item.UPC }}</td>
                            <td class="text-xs-left">{{ props.item.SN }}</td>
                        </template>
                    </v-data-table>
                  </v-flex>
                </v-layout>
              </v-card>
              <v-card color = 'grey lighten-4' v-if="orderBasic.status!=='shipped'">
                <v-data-table
                  :headers="detailHeader"
                  :items="orderBasic.orderDetail"
                  :rows-per-page-items="rowsPerPageItems"
                  class="elevation-1"
                  >
                    <template  slot="items" slot-scope="props">
                      <tr :style="props.item.enough? '': 'color:red;'">
                        <td class="text-xs-left">{{ props.item.UPC }}</td>
                        <td class="text-xs-left">{{ props.item.pid }}</td>
                        <td class="text-xs-left">{{ props.item.qty }}</td>
                        <td class="text-xs-left">{{ props.item.sellerInv }}</td>
                        <td class="text-xs-left" >{{ props.item.enough }}</td>
                        <td class="text-xs-left">{{ props.item.status }}</td>
                        <td class="text-xs-left">{{ props.item.taskID }}</td>
                        <td
                          class="text-xs-left">
                          <v-btn dark small color="teal" class="mx-0" @click.prevent="fastUpgrade(orderBasic, props.item, true)">
                            Urgent
                          </v-btn>
                           <v-btn dark small color="teal" class="mx-0" @click.prevent="fastUpgrade(orderBasic, props.item ,false)">
                            Normal
                          </v-btn>
                        </td>
                        <td
                          class="text-xs-left">
                          <v-btn icon class="mx-0"
                            @click.prevent="configUpgrade(orderBasic, props.item)"
                          >
                            <v-icon color="teal">build</v-icon>
                          </v-btn>
                        </td>
                        <td
                          class="text-xs-left">
                          <v-btn icon class="mx-0" @click.prevent="cancelUpgrade(orderBasic, props.item)">
                            <v-icon color="teal">cancel</v-icon>
                          </v-btn>
                        </td>
                      </tr>
                    </template>
                </v-data-table>
              </v-card>
            </v-flex>
            </div>
            <!-- End Show Order Detail-->
          </v-flex>
          <!-- Show OrdersItems For Shipping-->
          <!-- End Show OrdersItems For Shipping-->
        </v-layout>
        <!-- Upload orders-->
        <div v-if="showAction1">
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
              <template slot="items" slot-scope="props">
                  <td
                    class="text-xs-left">{{ props.item.status }}</td>
                  <td
                    class="text-xs-left">{{ props.item.OrderID }}</td>
                  <td
                    class="text-xs-left">
                    {{ props.item.TrackingNo }}
                  </td>
                  <td
                    class="text-xs-left">
                    {{ props.item.OrgName }}
                  </td>
                  <td
                    class="text-xs-left">
                    {{ props.item.UPC1 }}
                  </td>
                  <td
                    class="text-xs-left">
                    {{ props.item.Qty1 }}
                  </td>
                  <td
                    class="text-xs-left">
                    {{ props.item.UPC2 }}
                  </td>
                  <td
                    class="text-xs-left">
                    {{ props.item.Qty2 }}
                  </td>
                  <td
                    class="text-xs-left">
                    {{ props.item.UPC3 }}
                  </td>
                  <td
                    class="text-xs-left">
                    {{ props.item.Qty3 }}
                  </td>
                  <td
                    class="text-xs-left">
                    {{ props.item.UPC4 }}
                  </td>
                  <td
                    class="text-xs-left">
                    {{ props.item.Qty4 }}
                  </td>
                  <td
                    class="text-xs-left">
                    {{ props.item.UPC5 }}
                  </td>
                  <td
                    class="text-xs-left">
                    {{ props.item.Qty5 }}
                  </td>
                </template>
              </v-data-table>
            </v-card>
            <v-btn dark v-if='uploadButton' @click.prevent="upload">Upload to Server</v-btn>
            <v-btn dark @click.prevent="reset">Reset</v-btn>
          </v-flex>
        </div>
        <!-- End Upload orders-->
      <!-- End Show Orders For Shipping-->
    </v-layout>
    <div id="printable" v-show=false>
      <h2>Detail of Order Inventory</h2>
      <p>
        <b>Order ID:&nbsp;</b>{{orderBasic.orderID}}&nbsp;&nbsp;&nbsp;&nbsp;
        <b>Tracking NO:&nbsp;</b>{{orderBasic._id}}&nbsp;&nbsp;&nbsp;&nbsp;
      </p>
      <p>
        <b>Org Name:&nbsp;</b>{{orderBasic.orgNm}}&nbsp;&nbsp;&nbsp;&nbsp;
        <b>Status:&nbsp;</b>{{orderBasic.status}}&nbsp;&nbsp;&nbsp;&nbsp;
      </p>
      <v-divider></v-divider>
      <div v-for = "(detail, i) in orderBasic.orderDetail" :key = i my-2>
        <p><b>UPC:&nbsp;</b>&nbsp;{{ detail.UPC }}&nbsp;&nbsp;&nbsp;&nbsp;
          <b>PID:&nbsp;</b>{{ detail.pid }}&nbsp;&nbsp;&nbsp;&nbsp;
          <b>Required by this order:&nbsp;</b>&nbsp;{{ detail.qty }}&nbsp;&nbsp;&nbsp;&nbsp;
          <b>Seller Inventroy:&nbsp;</b>{{ detail.sellerInv }}
        </p>
        <table  :key ="i+ '-tb'">
            <tr :key="i+ '-hd'">
              <th>Location</th>
              <th>Quantity</th>
            </tr>
            <tr v-for="(alocInv,index) in detail.locInv" :key="index+ '-ct'">
              <th>{{ alocInv._id.loc }}</th>
              <th>{{ alocInv.qty }}</th>
            </tr>
        </table>
        <v-divider></v-divider>
      </div>
    </div>
  </div>
</template>

<script>
import * as csv from 'csvtojson'
import Shipment from '@/services/ShipmentService'
import Upgrade from '@/services/UpgradeService'
export default {
  data () {
    return {
      // <p :key="index+ '-p'">
      //       <b>Location:&nbsp;</b>{{ alocInv._id.loc }}&nbsp;&nbsp;&nbsp;&nbsp;
      //       <b>Quantity:&nbsp;</b>{{ alocInv.qty }}&nbsp;&nbsp;&nbsp;&nbsp;
      //     </P>
      actionChoice: [
        'Show Orders for Shipping',
        'Upload Orders'
      ],
      action: '',
      showAction0: true,
      showAction1: false,
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
        { text: 'Delete', align: 'left', value: 'TrackingNo' }
      ],
      detailHeader: [
        { text: 'UPC', align: 'left', value: 'UPC' },
        { text: 'PID', align: 'left', value: 'pid' },
        { text: 'Required Qty', align: 'left', value: 'qty' },
        { text: 'Seller Inventory', align: 'left', value: 'sellerInv' },
        { text: 'Enough', align: 'left', value: 'enough' },
        { text: 'status', align: 'left', value: 'status' },
        { text: 'Upgrade TaskID', align: 'left', value: 'taskID' },
        { text: 'Fast Upgrade', align: 'left', value: 'TrackingNo' },
        { text: 'Config Upgrade', align: 'left', value: 'TrackingNo' },
        { text: 'Cancel Upgrade', align: 'left', value: 'TrackingNo' }
      ],
      shippedHeader1: [
        { text: 'UPC', align: 'left', value: 'UPC' },
        { text: 'PID', align: 'left', value: 'pid' },
        { text: 'Required Qty', align: 'left', value: 'qty' }
      ],
      shippedHeader2: [
        { text: 'UPC', align: 'left', value: 'UPC' },
        { text: 'SN', align: 'left', value: 'SN' }
      ],
      locInvs: [],
      showOrderInv: false,
      orderBasic: {
        orderID: '',
        _id: '',
        orgNm: '',
        status: '',
        orderDetail: []
      },
      trackingMan: '',
      orderID: '',
      orderForShip: [],
      menu: false,
      slider: 1,
      statusType: ['ready', 'backOrder', 'upgrade', 'all'],
      statusTypeFilter: 'ready',
      currentDate: new Date(new Date().toLocaleString() + ' UTC').toISOString().split('T')[0],
      startDate: new Date(new Date().toLocaleString() + ' UTC').toISOString().split('T')[0],
      endDate: new Date(new Date().toLocaleString() + ' UTC').toISOString().split('T')[0],
      alertType: 'success',
      showAlert: false,
      message: '',
      message4Delete: '',
      showAlertDialog: false,
      item4Delete: '',
      showDeleteDialog: false,
      orderUpload: [],
      serverOrder: [],
      uploadButton: false,
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
    clearShows () {
      this.showAction0 = false
      this.showAction1 = false
    },
    changeAction () {
      this.clearShows()
      this.clearAlert()
      if (this.action === this.actionChoice[0]) {
        this.showAction0 = true
      } else if (this.action === this.actionChoice[1]) {
        this.showAction1 = true
      }
    },
    reset () {
      this.clearAlert()
      this.orderUpload = []
      this.serverOrder = []
      this.uploadButton = false
    },
    navigateTo (route) {
      this.$router.push(route)
    },
    checkOrderStatus (item, status) {
      if (item.status === 'shipped') {
        this.setAlertDialog('Order :' + item.orderID + ' has been shipped. A shipped order can not upgrade.')
        return false
      } else if (status === 'upgrade') {
        // this status is not the status of whole order. It's status of one UPC
        this.setAlertDialog('Order :' + item.orderID + ' is upgrading.')
        return false
      }
      return true
    },
    configUpgrade (orderBasic, orderDetail) {
      if (orderDetail.status === 'upgrade') {
        this.setAlertDialog('Error: Product ' + orderDetail.UPC + ' is upgrading.')
      }
      this.navigateTo({
        name: 'upgradeRequest',
        params: {
          targetUPC: orderDetail.UPC,
          orgNm: orderBasic.orgNm,
          trNo: orderBasic._id,
          orderQty: orderDetail.qty
        }
      })
    },
    async fastUpgrade (orderBasic, orderDetail, urgent) {
      if (orderDetail.status === 'upgrade') {
        this.setAlertDialog('Error: Product ' + orderDetail.UPC + ' is upgrading.')
      }
      if (this.checkOrderStatus(orderBasic, orderDetail.status)) {
        let result = (await Upgrade.fastUpgrade({
          'trNo': orderBasic._id,
          'targetUPC': orderDetail.UPC,
          'qty': orderDetail.qty,
          'orgNm': orderBasic.orgNm,
          'urgent': urgent
        })).data
        this.setAlertDialog(result.message)
        if (result.upgradable === true) {
          await this.showDetail4Item(orderBasic)
        }
      }
    },
    async cancelUpgrade (orderBasic, orderDetail) {
      try {
        if ((orderDetail.status !== 'upgrade')) {
          this.setAlertDialog('Error: Product ' + orderDetail.UPC + ' is not upgrading. Can not be canceled.')
        } else {
          // Cancel upgrade Task. input: shipmentID; UPC; taskID
          await Upgrade.cancelUpgrade({'taskID': orderDetail.taskID})
          await this.showDetail(orderBasic._id, '')
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
      if (item.status === 'shipped') {
        this.setAlertDialog('Shipped order can not be deleted')
      } else if (item.status === 'upgrade') {
        this.setAlertDialog('Upgrade order can not be deleted')
      } else {
        this.message4Delete = 'Delete Order: ' + item.orderID + ' Tracking No: ' + item._id
        this.item4Delete = item
        this.showDeleteDialog = true
      }
    },
    cancelDialog () {
      this.showDeleteDialog = false
    },
    async confirmDialog () {
      await Shipment.deleteByTracking({id: this.item4Delete._id})
      await this.changeFilter()
      this.showDeleteDialog = false
      this.setAlertDialog('Delete Order success')
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
    },
    async changeFilter () {
      this.clearAlert()
      let result = new Date(this.startDate)
      result.setDate(result.getDate() + this.slider - 1)
      this.endDate = result.toISOString().split('T')[0]
      try {
        // result from inventory collection
        let shipData = await Shipment.getShipingOrders(this.startDate, this.endDate, this.statusTypeFilter)
        this.orderForShip = shipData.data
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
    async showDetail (trackingNo, orderID) {
      this.showOrderInv = true
      let result = (await Shipment.getByShipmentId({
        'trackingNo': trackingNo,
        'orderID': orderID
      })).data
      this.orderBasic._id = result._id
      this.orderBasic.orderID = result.orderID
      this.orderBasic.orgNm = result.orgNm
      this.orderBasic.status = result.status
      this.orderBasic.orderDetail = result.rcIts
      if (this.orderBasic.status === 'shipped') {
        this.orderBasic.UPCandSN = result.UPCandSN
      } else {
        this.orderBasic.UPCandSN = ''
      }
      console.log(this.orderBasic)
    },
    async showDetail4Item (item) {
      await this.showDetail(item._id, '')
      item.status = this.orderBasic.status
    },
    showDetailManByTracking () {
      this.showDetail(this.trackingMan.trim(), '')
    },
    showDetailManByOID () {
      this.showDetail('', this.orderID)
    },
    printContent () {
      // console.log('Here')
      // let restorepage = document.body.innerHTML
      // let printcontent = document.getElementById('printable').innerHTML
      // let frame = document.createElement('IFRAME')
      // frame.width = 0
      // frame.height = 0
      // document.body.appendChild(frame)
      // frame.contentWindow.document.write(`
      //   <html>
      //     <head>
      //       <title>
      //         Inventory List
      //       </title>
      //     </head>
      //     <body>
      //      ${printcontent}
      //     </body>
      //   </html>
      // `)
      // frame.contentWindow.document.close()
      // frame.contentWindow.focus()
      // frame.contentWindow.print()
      // document.body.removeChild(frame)
      const element = document.getElementById('printable')
      if (!element) {
        this.setAlertDialog('Element to print not found!')
        return
      }
      const win = window.open('', 'PrintWindow', 'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,fufullscreen=yes,left=100,top=100')
      win.document.write(`
        <html>
          <head>
            <style>
              .page { size: A4; margin: 11mm 17mm 17mm 17mm; page-break-after: always;}
              body {margin-left:2em;margin-right:2em;}
              h1 {margin-top:5em;}
              p { margin-top:5mm; page-break-inside:avoid; }
              @page { margin-top: 5cm； margin-bottom: 5cm }
              table, th, td { border: 1px solid black; border-collapse: collapse; white-space: nowrap; page-break-inside:avoid；page-break-after:auto}
            </style>
          </head>
          <body>
            ${element.innerHTML}
          </body>
        </html>
      `)
      win.document.close()
      win.focus()
      // win.print()
      // win.close()
      setTimeout(function () { win.print() }, 500)
      win.onfocus = function () { setTimeout(function () { win.close() }, 500) }
    }
  },
  created () {
    // console.log('Come here!')
    this.changeFilter()
    this.action = this.actionChoice[0]
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* @media print {
  .orientation {width: 100% !important;}
  .h2 {
    font-family: "Palatino Linotype", "Book Antiqua", Palatino, serif !important;
  }
  .table {
    border: 1px solid black !important;
    border-collapse: collapse !important;
    color: red !important;
  }
} */
</style>
