<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-layout justify-center column mx-5>
      <panel title='Step 1: Input a Target UPC for upgrading'>
        <v-flex lg6>
          <v-alert
            v-show = showAlert1
            :type = alertType1
            outline>
              {{message1}}
          </v-alert>
        </v-flex>
        <v-flex>
          <v-layout mx-5 >
              <v-flex mr-5>
                <v-text-field
                  label="UPC"
                  v-model="UPCInput"
                  clearable
                ></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field
                  label="Organization Name"
                  v-model="orgNmInput"
                  clearable
                ></v-text-field>
              </v-flex>
              <v-btn dark @click="find()">Find</v-btn>
            </v-layout>
        </v-flex>
      </panel>
        <!-- Show UPC Detail Information -->
        <v-layout v-if=showDetail column>
          <v-card>
            <v-card-title class="title font-weight-light blue-grey lighten-5">
              <span style='margin-right:1.25em; display:inline-block;'>Target Product information</span>
            </v-card-title>
            <v-card-text>
              <v-layout row justify-space-around>
                <v-flex lg6 mr-3>
                  <v-text-field
                    label='Target UPC'
                    v-model="upgradeInfo.targetUPC"
                    outline
                    readonly
                  ></v-text-field>
                </v-flex >
                <v-flex lg6 mx-3>
                  <v-text-field
                    label='Organization Name'
                    v-model="upgradeInfo.orgNm"
                    outline
                    readonly
                  ></v-text-field>
                </v-flex >
              </v-layout>
            </v-card-text>
          </v-card>
          <!-- Locatin Inventory table -->
          <v-card>
            <v-card-title class="title font-weight-light blue-grey lighten-5">
              <span style='margin-right:1.25em; display:inline-block;'>
                Step 2 : Choose qualified base products</span>
            </v-card-title>
            <v-card-text>
              <template v-for="(aUPC, index) in UPCFamilyList">
                  <v-layout row :key="index + '-layout'">
                    <v-flex lg6 ma-2>
                      <p :key= "index + '-UPC'">UPC: {{aUPC.UPC}}</p>
                      <p :key= "index + '-QTY'">Available Quantity: {{aUPC.qty}}</p>
                      <p style="color:red;font-weight:bold" v-if=aUPC.isTarget>This is target Product</P>
                    </v-flex>
                    <v-flex lg6 ma-2>
                      <v-card>
                        <v-card-title class="title font-weight-light cyan lighten-4">
                          Location Inventory
                          <v-spacer></v-spacer>
                          <span v-if="!aUPC.isTarget"> Total Upgrade {{aUPC.totalUpg}}</span>
                        </v-card-title>
                        <v-data-table
                          :headers="locInvHeader"
                          :items="aUPC.locationInventory"
                          :rows-per-page-items="rowsPerPageItems"
                          class="elevation-1"
                          >
                          <template slot="items" slot-scope="props">
                            <td class="text-xs-left">{{ props.item.loc }}</td>
                            <td class="text-xs-left">{{ props.item.qty }}</td>
                            <td class="text-xs-left" v-if="!aUPC.isTarget">
                              <v-btn icon class="mx-0"
                                v-if="!aUPC.isTarget"
                                @click.prevent= addLoc(props.item,aUPC)>
                                <v-icon color="teal">add_circle</v-icon>
                              </v-btn>
                                {{ props.item.qtyDelta }}
                              <v-btn icon class="mx-0"
                                v-if="!aUPC.isTarget"
                                @click.prevent= subLoc(props.item,aUPC)>
                                <v-icon color="teal">remove_circle</v-icon>
                              </v-btn>
                            </td>
                          </template>
                        </v-data-table>
                      </v-card>
                    </v-flex>
                  </v-layout>
                  <v-divider :key="index + '-divider'" ></v-divider>
                </template>
              </v-card-text>
            </v-card>
            <v-layout v-if=changed justify-center mt-2>
              <v-btn dark @click.prevent="submit()">Submit</v-btn>
              <v-btn dark @click.prevent="reset()">Reset</v-btn>
              <v-btn dark @click.prevent="clear()">Clear</v-btn>
            </v-layout>
            <!-- End Seller Inventory table -->
          </v-layout>
        <!-- End Show UPC Detail Information -->
    </v-layout>
  </div>
</template>

<script>
import ProductInv from '@/services/productInv'
export default {
  data () {
    return {
      alertType1: 'success',
      showAlert1: false,
      // Items can be cleaned up
      message1: '',
      UPCInput: '',
      orgNmInput: '',
      upgradeInfo: {
        'targetUPC': '',
        'orgNm': '',
        'qty': 0,
        'baseUPCList': [] // upc: '123', qty: 1
      },
      // Detail info
      UPCFamilyList: [],
      showDetail: false,
      changed: false,
      // tabel headers
      locInvHeader: [
        { text: 'Location', align: 'left', value: 'loc' },
        { text: 'Quantity', align: 'left', value: 'qty' },
        { text: 'Upgrade Qty', align: 'left', value: 'qtyDelta' }
      ],
      rowsPerPageItems: [30, 60, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 }],
      // Handle barcode scanner input
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
      this.showAlert1 = false
      this.message1 = ''
    },
    setAlert (type, message) {
      this.message1 = message
      this.alertType1 = type
      this.showAlert1 = true
    },
    clearData () {
      this.UPCInput = ''
      this.showDetail = false
      this.UPCFamilyList = []
    },
    async find () {
      this.clearAlert()
      console.log('Here')
      if (this.UPCInput === '') {
        this.setAlert('error', ' Missing UPC')
        return
      }
      if (this.orgNmInput === '') {
        this.setAlert('error', ' Missing Organization Name')
        return
      }
      try {
        await this.getUPCFamilyListByOrg(this.UPCInput, this.orgNmInput)
        this.showDetail = true
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
    setDelta () {
      for (let item of this.UPCFamilyList) {
        item.totalUpg = 0
        if (item.UPC === this.upgradeInfo.targetUPC) {
          item.isTarget = true
        } else {
          item.isTarget = false
        }
        for (let aLocInv of item.locationInventory) {
          aLocInv.qtyDelta = 0
        }
      }
    },
    async getUPCFamilyListByOrg (baseUPC, orgNm) {
      try {
        this.UPCFamilyList = (await ProductInv.getUPCFamilyListByOrg({
          'UPC': baseUPC,
          'orgNm': orgNm
        })).data
        console.log(this.UPCFamilyList)
        this.upgradeInfo.targetUPC = this.UPCInput
        this.upgradeInfo.orgNm = this.orgNmInput
        this.UPCInput = ''
        this.orgNmInput = ''
        // Delta are qty for upgrade
        this.setDelta()
        console.log(this.UPCFamilyList)
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
    addLoc (item, aUPC) {
      this.clearAlert()
      this.changed = true
      item.qtyDelta += 1
      aUPC.totalUpg += 1
      this.$forceUpdate()
    },
    subLoc (item, aUPC) {
      this.clearAlert()
      if (item.qtyDelta > 0) {
        this.changed = true
        item.qtyDelta -= 1
        aUPC.totalUpg -= 1
      }
      this.$forceUpdate()
    },
    addSeller (item) {
      this.clearAlert()
      this.changed = true
      item.qtyDelta += 1
      this.total4Seller += 1
    },
    subSeller (item) {
      this.clearAlert()
      if (item.qtyDelta > 0) {
        this.changed = true
        item.qtyDelta -= 1
        this.total4Seller -= 1
      }
    },
    submit () {
      let totalQty = 0
      for (let aUPC of this.UPCFamilyList) {
        totalQty += aUPC.totalUpg
        this.upgradeInfo.baseUPCList.push({'UPC': aUPC.UPC, 'qty': aUPC.totalUpg})
      }
      this.upgradeInfo.qty = totalQty
      console.log(this.upgradeInfo)
      this.clear()
    },
    reset () {
      this.setDelta()
      this.$forceUpdate()
    },
    clear () {
      this.clearAlert()
      this.clearData()
    },
    onBarcodeScanned (barcode) {
      try {
        this.clearAlert()
        this.getDetailByUPC(barcode)
        this.showDetail = true
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
    // Code to handle scanner input
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
</style>
