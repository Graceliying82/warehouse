<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-layout justify-center column mx-5>
      <panel title='Step 1: Input a Target UPC for upgrading'>
        <v-flex>
          <v-alert
            v-show = showAlert1
            :type = alertType1
            outline>
              {{message1}}
          </v-alert>
        </v-flex>
        <v-flex>
          <v-layout>
              <v-flex mr-3>
                <v-text-field
                  label="UPC"
                  v-model="UPCInput"
                  clearable
                ></v-text-field>
              </v-flex>
              <v-flex ml-3>
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
                <v-flex lg9 mr-3>
                  <v-text-field
                    label='Target UPC'
                    v-model="upgradeInfo.targetUPC"
                    outline
                    readonly
                  ></v-text-field>
                </v-flex >
                <v-flex lg3 mx-3>
                  <v-text-field
                    label='Organization Name'
                    v-model="upgradeInfo.orgNm"
                    outline
                    readonly
                  ></v-text-field>
                </v-flex >
              </v-layout>
              <v-layout row justify-space-around>
                <v-flex lg6 mr-3>
                  <v-text-field
                    label='Product Name'
                    v-model="upgradeInfo.prdNm"
                    outline
                    readonly
                  ></v-text-field>
                </v-flex >
                <v-flex lg3 mx-3>
                  <v-text-field
                    label='PID'
                    v-model="upgradeInfo.pid"
                    outline
                    readonly
                  ></v-text-field>
                </v-flex >
                <v-flex lg3 mx-3>
                  <v-text-field
                    label='Total Upgrade'
                    v-model="upgradeInfo.qty"
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
                <v-flex>
                  <v-data-table
                    :headers="header"
                    :items="UPCFamilyList"
                    :rows-per-page-items="rowsPerPageItems"
                    class="elevation-1"
                  >
                    <template slot="items" slot-scope="props">
                      <td class="text-xs-left">{{ props.item.UPC }}</td>
                      <td class="text-xs-left">{{ props.item.prdNm }}</td>
                      <td class="text-xs-left">{{ props.item.pid }}</td>
                      <td class="text-xs-left">{{ props.item.qty }}</td>
                      <td class="text-xs-left">
                        <v-btn icon class="mx-0" @click="addQty(props.item)" v-if="!props.item.isTarget">
                          <v-icon color="teal">add_circle</v-icon>
                        </v-btn>
                          {{ props.item.upgQty }}
                        <v-btn icon class="mx-0" @click="delQty(props.item)" v-if="!props.item.isTarget">
                          <v-icon color="teal">remove_circle</v-icon>
                        </v-btn>
                      </td>
                    </template>
                  </v-data-table>
                </v-flex>
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
import Upgrade from '@/services/upgrade'
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
        'prdNm': '',
        'pid': '',
        'qty': 0,
        'baseUPCList': [] // upc: '123', qty: 1
      },
      // Detail info
      UPCFamilyList: [],
      showDetail: true,
      changed: false,
      // tabel headers
      header: [
        { text: 'UPC', align: 'left', value: 'UPC' },
        { text: 'Product Name', align: 'left', value: 'prdNm' },
        { text: 'PID', align: 'left', value: 'pid' },
        { text: 'Available Qty', align: 'left', value: 'qty' },
        { text: 'Upgrade Qty', align: 'left', value: 'upgQty' }
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
    resetData () {
      this.showDetail = false
      this.changed = false
      this.UPCFamilyList = []
      this.upgradeInfo.targetUPC = ''
      this.upgradeInfo.orgNm = ''
      this.upgradeInfo.prdNm = ''
      this.upgradeInfo.pid = ''
      this.upgradeInfo.qty = 0
      this.upgradeInfo.baseUPCList = []
    },
    clearData () {
      this.UPCInput = ''
      this.orgNmInput = ''
      this.resetData()
    },
    addQty (item) {
      if (item.upgQty < item.qty) {
        item.upgQty += 1
        this.upgradeInfo.qty += 1
      }
      this.changed = true
      this.$forceUpdate()
    },
    delQty (item) {
      if (item.upgQty > 0) {
        item.upgQty -= 1
        this.upgradeInfo.qty -= 1
      }
      this.changed = true
      this.$forceUpdate()
    },
    async find () {
      this.clearAlert()
      this.resetData()
      // console.log('Here')
      if (this.UPCInput === '') {
        this.setAlert('error', ' Missing UPC')
        return
      }
      if (this.orgNmInput === '') {
        this.setAlert('error', ' Missing Organization Name')
        return
      }
      try {
        await this.getUPCFamilyListByOrg(this.UPCInput.trim(), this.orgNmInput.trim())
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
        item.upgQty = 0
        if (item.UPC === this.upgradeInfo.targetUPC) {
          item.isTarget = true
          this.upgradeInfo.pid = item.pid
          this.upgradeInfo.prdNm = item.prdNm
        } else {
          item.isTarget = false
        }
      }
    },
    async getUPCFamilyListByOrg (baseUPC, orgNm) {
      try {
        this.UPCFamilyList = (await ProductInv.getUPCFamilyListByOrg({
          'UPC': baseUPC,
          'orgNm': orgNm,
          'includeTarget': true
        })).data
        // console.log(this.UPCFamilyList)
        this.upgradeInfo.targetUPC = this.UPCInput
        this.upgradeInfo.orgNm = this.orgNmInput
        this.UPCInput = ''
        this.orgNmInput = ''
        // Delta are qty for upgrade
        this.setDelta()
        // console.log(this.UPCFamilyList)
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
    async submit () {
      try {
        // Prepare upgrade data
        this.upgradeInfo.baseUPCList = []
        for (let aUPC of this.UPCFamilyList) {
          if (aUPC.upgQty > 0) {
            this.upgradeInfo.baseUPCList.push({'UPC': aUPC.UPC, 'PID': aUPC.pid, 'qty': aUPC.upgQty})
          }
        }
        await Upgrade.post(this.upgradeInfo)
        this.clearData()
        this.setAlert('success', 'Added a upgrade request.')
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
