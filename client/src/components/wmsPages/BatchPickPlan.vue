<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-layout>
      <v-flex>
          <v-alert
            v-show = "showAlert"
            :type = "alertType"
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
    <v-flex mt-5>
      <v-layout row>
      <v-btn dark @click.prevent="planPickUp()">Plan a Pick Up</v-btn>
      <v-checkbox
        v-model="includeWMS"
        label="Include WMS Inventory"
        value=true
      ></v-checkbox>
      </v-layout>
      <!-- Show Order Detail-->
      <div id="printable">
        <!-- Planned Pick Up-->
          <panel title='Planned Pick Up' v-if=showPickUp>
            <v-flex v-for = "(pick, i) in pickUPList" :key = i my-2>
                <p class="font-weight-bold text-xs-left">Location  :  {{ pick.loc}}</p>
                <div v-for="(item,index) in pick.items" :key=index>
                  <v-layout row>
                    <v-flex class="font-weight-regular text-xs-left">UPC: {{item.UPC}}</v-flex>
                    <v-flex class="font-weight-regular text-xs-left">PID: {{item.pid}}</v-flex>
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
                  <v-list-tile-sub-title >PID  :  {{ item.pid }}</v-list-tile-sub-title>
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
  </div>
</template>

<script>
import ProductInv from '@/services/ProductInvService'
export default {
  data () {
    return {
      alertType: 'success',
      showAlert: false,
      message: '',
      showAlertDialog: false,
      includeWMS: false,
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
      // console.log(this.upcQtyList)
      let upcList = ''
      for (let i = 0; i < this.upcQtyList.length; i++) {
        upcList = upcList + this.upcQtyList[i].UPC
        if (i !== (this.upcQtyList.length - 1)) {
          upcList = upcList + ','
        }
      }
      try {
        this.retUPCQtyList = (await ProductInv.getByUPC(upcList)).data
        console.log(this.retUPCQtyList)
        this.mergeRetAndReq()
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
    min (a, b) {
      if (a < b) {
        return a
      } else {
        return b
      }
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
        this.setAlertDialog('Some Orders have not enough inventory. Please check.')
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
                  this.pickUPList[i].items.push({UPC: aUPC.UPC, pid: aUPC.pid, prdNm: aUPC.prdNm, qty: alocIn.qty})
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
                    pid: aUPC.pid,
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
            console.log(aUPC)
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
                    this.pickUPList[i].items.push({UPC: aUPC.UPC, pid: aUPC.pid, prdNm: aUPC.prdNm, qty: alocIn.qty})
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
                      pid: aUPC.pid,
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
        console.log(this.pickUPList)
      }
    },
    printContent () {
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
    this.upcQtyList = this.$store.state.route.params.upcQtyList
    this.getLocByUPCs()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
