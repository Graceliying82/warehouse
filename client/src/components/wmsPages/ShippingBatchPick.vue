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
      <v-flex v-if = showPrintable mt-5>
        <v-layout row>
        <v-btn dark @click.prevent="planPickUp()">Plan a Pick Up</v-btn>
        <v-checkbox
          v-model="includeWMS"
          label="Include WMS Inventory"
          value=true
        ></v-checkbox>
        </v-layout>
        <v-flex>
          <v-alert
            v-show = showAlert2
            :type = alertType2
            outline>
              {{message2}}
            </v-alert>
        </v-flex>
        <!-- Show Order Detail-->
        <div id="printable">
          <!-- Planned Pick Up-->
            <panel title='Planned Pick Up' v-if=showPickUp>
              <v-flex v-for = "(pick, i) in pickUPList" :key = i my-2>
                 <p class="font-weight-bold text-xs-left">Location  :  {{ pick.loc}}</p>
                  <div v-for="(item,index) in pick.items" :key=index>
                    <v-layout row>
                      <v-flex class="font-weight-regular text-xs-left">UPC: {{item.UPC}}</v-flex>
                      <v-flex class="font-weight-regular text-xs-left">Product Name: {{item.prdNm}}</v-flex>
                      <v-flex class="font-weight-regular text-xs-left">Qty: {{item.qty}}</v-flex>
                    </v-layout>
                    <v-divider></v-divider>
                  </div>
                  <br>
              </v-flex>
              <v-btn dark @click.prevent='printContent()'>Print</v-btn>
            </panel>
          <panel title='Current Inventory'>
            <v-flex v-for = "(item, i) in retUPCQtyList" :key = i my-2>
              <v-card v-bind:class = item.color>
                <v-card-title>
                  <v-list-tile-content>
                    <v-list-tile-sub-title >UPC  :  {{ item.UPC }}</v-list-tile-sub-title>
                    <v-list-tile-sub-title >Product Name  :  {{ item.prdNm }}</v-list-tile-sub-title>
                    <v-list-tile-sub-title>Total available  :  {{ item.qty }}</v-list-tile-sub-title>
                    <v-list-tile-sub-title>Total required by orders  :  {{ item.reqQty }}</v-list-tile-sub-title>
                    <br>
                  <v-layout column>
                    <template v-for="(alocInv,index) in item.locationInventory">
                      <v-layout :key="index">
                        <v-flex mr-5>
                          <p :key="index+ '-loc'">Location  :  {{ alocInv.loc }}</p>
                        </v-flex>
                        <v-flex>
                          <p :key="index+ '-qty'">Quantity  :  {{ alocInv.qty }}</p>
                        </v-flex>
                      </v-layout>
                    </template>
                    <br>
                  </v-layout>
                </v-list-tile-content>
                </v-card-title>
              </v-card>
            </v-flex>
          </panel>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Shipment from '@/services/Shipment'
import ProductInv from '@/services/productInv'
export default {
  data () {
    return {
      alertType1: 'success',
      showAlert1: false,
      message1: '',
      alertType2: 'success',
      showAlert2: false,
      message2: '',
      includeWMS: false,
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
      showPrintable: false,
      showPickUp: false,
      upcQtyList: [],
      retUPCQtyList: [],
      pickUPList: [],
      Colors: ['grey lighten-4', 'red']
    }
  },
  methods: {
    clearAlert () {
      this.showAlert1 = false
      this.message1 = ''
      this.showAlert2 = false
      this.message2 = ''
    },
    setAlert (type, message) {
      this.message1 = message
      this.alertType1 = type
      this.showAlert1 = true
    },
    setAlert2 (type, message) {
      this.message2 = message
      this.alertType2 = type
      this.showAlert2 = true
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
    checkBackOrders () {
      for (let aShip of this.shipments) {
        if (aShip.status === 'backOrder') {
          return true
        }
      }
      return false
    },
    mergeRetAndReq () {
      // merge upcQtyList and retUPCQtyList
      for (let aUQL of this.upcQtyList) {
        for (let aRUQL of this.retUPCQtyList) {
          if (aUQL.UPC === aRUQL.UPC) {
            // Need merge
            aRUQL.reqQty = aUQL.qty
            if (aRUQL.qty < aRUQL.reqQty) {
              // Not enough inventory
              aRUQL.color = this.Colors[1]
            } else {
              aRUQL.color = this.Colors[0]
            }
          }
        }
      }
    },
    async getLocByUPCs () {
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
      // console.log(this.upcQtyList)
      let upcList = ''
      for (let i = 0; i < this.upcQtyList.length; i++) {
        upcList = upcList + this.upcQtyList[i].UPC
        if (i !== (this.upcQtyList.length - 1)) {
          upcList = upcList + ','
        }
      }
      // console.log(upcList)
      try {
        this.retUPCQtyList = (await ProductInv.getByUPC(upcList)).data
        this.mergeRetAndReq()
        console.log(this.retUPCQtyList)
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
            this.getLocByUPCs()
            this.showPrintable = true
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
    min (a, b) {
      if (a < b) {
        return a
      } else {
        return b
      }
    },
    // This function will be called before trying to plan a pickup.
    // System will not plan a pick up if there are backorders in batch orders
    // If includeWMS not true, the function has to went through every UPC and minors WMS inventory before calculate backorders.
    isBatchBackOrder (includeWMS) {
      let backOrder = false
      if (includeWMS) {
        for (let aUPC of this.retUPCQtyList) {
          if (aUPC.color === this.Colors[1]) {
            backOrder = true
            break
          }
        }
      } else {
        // not include WMS inventory
        let actQty = 0
        for (let item of this.retUPCQtyList) {
          for (let aInv of item.locationInventory) {
            if (aInv.loc !== 'WMS') {
              actQty += aInv.qty
            }
          }
          if (actQty < item.reqQty) {
            backOrder = true
            break
          }
        }
      }
      return backOrder
    },
    planPickUp () {
      // make a pickUPList
      // {loc: 'A001',
      //  items: {UPC: '12345', qty: 3}
      // }
      // check order availability
      // console.log(this.includeWMS)
      let backOrder = this.isBatchBackOrder(this.includeWMS)
      if (backOrder) {
        this.setAlert2('error', 'Some Orders have not enough inventory. Please check.')
      } else {
        this.pickUPList = []
        this.showPickUp = true
        if (this.includeWMS) {
          for (let aUPC of this.retUPCQtyList) {
            let leftQty = aUPC.reqQty
            for (let alocIn of aUPC.locationInventory) {
              let idx = -1
              for (let i = 0; i < this.pickUPList.length; i++) {
                if (alocIn.loc === this.pickUPList[i].loc) {
                  // Add one more pick up to this loc
                  let minQty = this.min(leftQty, alocIn.qty)
                  this.pickUPList[i].items.push({UPC: aUPC.UPC, prdNm: aUPC.prdNm, qty: alocIn.qty})
                  leftQty = leftQty - minQty
                  idx = i
                  break
                }
              }
              if (idx === -1) {
                // Not found this loc before
                let minQty = this.min(leftQty, alocIn.qty)
                this.pickUPList.push({
                  loc: alocIn.loc,
                  items: [{
                    UPC: aUPC.UPC,
                    prdNm: aUPC.prdNm,
                    qty: minQty
                  }]
                })
                leftQty = leftQty - minQty
              }
              if (leftQty === 0) {
                break
              }
            }
          }
        } else {
          for (let aUPC of this.retUPCQtyList) {
            let leftQty = aUPC.reqQty
            for (let alocIn of aUPC.locationInventory) {
              let idx = -1
              if (alocIn.loc === 'WMS') {
                continue
              } else {
                for (let i = 0; i < this.pickUPList.length; i++) {
                  if (alocIn.loc === this.pickUPList[i].loc) {
                    // Add one more pick up to this loc
                    let minQty = this.min(leftQty, alocIn.qty)
                    this.pickUPList[i].items.push({UPC: aUPC.UPC, prdNm: aUPC.prdNm, qty: alocIn.qty})
                    leftQty = leftQty - minQty
                    idx = i
                    break
                  }
                }
                if (idx === -1) {
                  // Not found this loc before
                  let minQty = this.min(leftQty, alocIn.qty)
                  this.pickUPList.push({
                    loc: alocIn.loc,
                    items: [{
                      UPC: aUPC.UPC,
                      prdNm: aUPC.prdNm,
                      qty: minQty
                    }]
                  })
                  leftQty = leftQty - minQty
                }
                if (leftQty === 0) {
                  break
                }
              }
            }
          }
        }
      }
    },
    printContent () {
      // console.log('Here')
      // let restorepage = document.body.innerHTML
      let printcontent = document.getElementById('printable').innerHTML
      let frame = document.createElement('IFRAME')
      frame.width = 0
      frame.height = 0
      document.body.appendChild(frame)
      frame.contentWindow.document.write(printcontent)
      frame.contentWindow.document.close()
      frame.contentWindow.focus()
      frame.contentWindow.print()
      document.body.removeChild(frame)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
