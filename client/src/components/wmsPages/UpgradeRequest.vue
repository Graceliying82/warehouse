<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-layout justify-center column ma-5>
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
                  id="UPC"
                  clearable
                ></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field
                  label="Organization Name"
                  v-model="orgNm"
                  id="UPC"
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
              <span style='margin-right:1.25em; display:inline-block;'>Step 2 : Choose configrations for target UPC</span>
            </v-card-title>
            <v-card-text>
              <v-layout row justify-space-around>
                <v-flex lg6 mr-3>
                  <v-text-field
                    label='Current UPC'
                    v-model="UPCInvList.UPC"
                    box
                    readonly
                  ></v-text-field>
                </v-flex >
                <v-flex lg3 mx-3>
                  <v-text-field
                    label='Product Name'
                    v-model="UPCInvList.prdNm"
                    box
                    readonly
                  ></v-text-field>
                </v-flex >
                <v-flex lg3 ml-3>
                  <v-text-field
                    label='Total'
                    v-model="UPCInvList.qty"
                    box
                    readonly
                  ></v-text-field>
                </v-flex >
              </v-layout>
              <!-- Upgrade Choice -->
              <!-- End Upgrade Choice -->
              <v-layout row justify-space-around>
                <v-flex lg3>
                  <v-select
                    :items ="memItems"
                    v-model="selectMem"
                    label="Memory"
                  ></v-select>
                </v-flex >
                <v-flex lg3>
                  <v-select
                    :items ="HDItems"
                    v-model="selectHD"
                    label="Hard Drive"
                  ></v-select>
                </v-flex >
                <v-flex lg3>
                  <v-select
                    :items ="cdItems"
                    v-model="cdDrive"
                    label="Hard Drive"
                  ></v-select>
                </v-flex >
              </v-layout>
            </v-card-text>
          </v-card>
          <!-- Locatin Inventory table -->
          <v-card>
            <v-card-title class="title font-weight-light blue-grey lighten-5">
              <span style='margin-right:1.25em; display:inline-block;'>
                Step 3 : Choose Upgrade quantity</span>
            </v-card-title>
            <v-card-text>
              <v-layout row>
                  <v-flex lg6 ma-2>
                    <v-card>
                      <v-card-title class="title font-weight-light cyan lighten-4">
                        Location Inventory
                        <v-spacer></v-spacer>
                        <span > Total Upgrade {{total4Loc}}</span>
                      </v-card-title>
                      <v-data-table
                        :headers="locInvHeader"
                        :items="locInv"
                        :rows-per-page-items="rowsPerPageItems"
                        class="elevation-1"
                        >
                        <template slot="items" slot-scope="props">
                          <td class="text-xs-left">{{ props.item.loc }}</td>
                          <td class="text-xs-left">{{ props.item.qty }}</td>
                          <td class="text-xs-left">
                            <v-btn icon class="mx-0" @click.prevent= addLoc(props.item)>
                              <v-icon color="teal">add_circle</v-icon>
                            </v-btn>
                              {{ props.item.qtyDelta }}
                            <v-btn icon class="mx-0" @click.prevent= subLoc(props.item)>
                              <v-icon color="teal">remove_circle</v-icon>
                            </v-btn>
                          </td>
                        </template>
                      </v-data-table>
                    </v-card>
                  </v-flex>
                  <!-- End Locatin Inventory table -->
                  <!-- Seller Inventory table -->
                  <v-flex lg6 ma-2>
                    <v-card-title class="title font-weight-light cyan lighten-4">
                      Seller Inventory
                      <v-spacer></v-spacer>
                      <span > Total Upgrade {{total4Seller}}</span>
                    </v-card-title>
                    <v-data-table
                      :headers="sellerInvHead"
                      :items="sellerInv"
                      :rows-per-page-items="rowsPerPageItems"
                      class="elevation-1"
                      >
                      <template slot="items" slot-scope="props">
                        <td class="text-xs-left">{{ props.item.org }}</td>
                        <td class="text-xs-left">{{ props.item.qty }}</td>
                        <td class="text-xs-left">
                          <v-btn icon class="mx-0" @click.prevent= addSeller(props.item)>
                            <v-icon color="teal">add_circle</v-icon>
                          </v-btn>
                            {{ props.item.qtyDelta }}
                          <v-btn icon class="mx-0" @click.prevent= subSeller(props.item)>
                            <v-icon color="teal">remove_circle</v-icon>
                          </v-btn>
                        </td>
                      </template>
                    </v-data-table>
                  </v-flex>
                </v-layout>
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
      // Detail info
      UPCInvList: [],
      locInv: [],
      sellerInv: [],
      showDetail: false,
      total4Seller: 0,
      total4Loc: 0,
      changed: false,
      // Select Items
      selectMem: '',
      selectHD: '',
      cdDrive: '',
      memItems: ['8g', '16g', '64g', '128g'],
      HDItems: ['256g', '512g', '1T'],
      cdItems: ['Dvd'],
      // tabel headers
      locInvHeader: [
        { text: 'Location', align: 'left', value: 'loc' },
        { text: 'Quantity', align: 'left', value: 'qty' },
        { text: 'Upgrade Qty', align: 'left', value: 'qtyDelta' }
      ],
      sellerInvHead: [
        {
          text: 'Organization Name',
          align: 'left',
          value: 'org'
        },
        { text: 'Quantity', value: 'qty' },
        { text: 'Upgrade Qty', value: 'qtyDelta' }
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
      this.UPCInvList = []
      this.locInv = []
      this.sellerInv = []
      this.showDetail = false
      this.total4Seller = 0
      this.total4Loc = 0
      this.changed = false
      this.selectMem = ''
      this.selectHD = ''
      this.cdDrive = ''
    },
    async find () {
      this.clearAlert()
      if (this.UPCInput === '') {
        this.setAlert('error', ' Missing UPC')
        return
      }
      if (this.orgNmInput === '') {
        this.setAlert('error', ' Missing UPC')
        return
      }
      try {
        await this.getDetailByUPC(this.UPCInput)
        console.log(this.UPCInvList)
        this.UPCInput = ''
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
    setDelta (list) {
      for (let item of list) {
        item.qtyDelta = 0
      }
    },
    async getDetailByUPC (UPC) {
      try {
        this.UPCInvList = (await ProductInv.getByUPC(UPC)).data[0]
        this.locInv = this.UPCInvList.locationInventory
        this.sellerInv = this.UPCInvList.sellerInventory
        // Delta are qty for upgrade
        this.setDelta(this.locInv)
        this.setDelta(this.sellerInv)
        this.UPCInvList.qtyDelta = 0
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

    addLoc (item) {
      this.clearAlert()
      this.changed = true
      item.qtyDelta += 1
      this.total4Loc += 1
    },
    subLoc (item) {
      this.clearAlert()
      if (item.qtyDelta > 0) {
        this.changed = true
        item.qtyDelta -= 1
        this.total4Loc -= 1
      }
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
      console.log(this.UPCInvList)
    },
    reset () {
      this.total4Loc = 0
      this.total4Seller = 0
      for (let aLoc of this.locInv) {
        aLoc.qtyDelta = 0
      }
      for (let aSeller of this.sellerInv) {
        aSeller.qtyDelta = 0
      }
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
