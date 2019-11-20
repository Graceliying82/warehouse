<template>
  <div  v-if="$store.state.isUserLoggedIn">
    <v-layout row>
      <v-flex ma-5>
        <v-layout justify-center  column>
          <v-flex>
            <h1>Location Inventory</h1>
              <v-alert type="error"
                outline
                :value="error"
                >
                {{ error }}
              </v-alert>
          </v-flex>
          <v-layout justify-center column>
            <!-- Scan area -->
              <v-layout justify-center>
                <v-toolbar-title>You can Scan or Input a Location</v-toolbar-title>
              </v-layout>
              <v-layout justify-center>
                <v-toolbar-title>Current Showing Location:</v-toolbar-title>
                <v-toolbar-title style="color:blue;font-weight:bold">{{inputLoc}}</v-toolbar-title>
              </v-layout>
              <!-- Manual input area-->
              <v-layout mx-5 >
                <v-text-field
                  label="Location Name"
                  id="locNo"
                  clearable
                  v-on:keydown.enter="changeLocMan"
                ></v-text-field>
                <v-btn @click = "changeLocMan">Find</v-btn>
                <v-btn @click = "resetLocation">Reset</v-btn>
              </v-layout>
        </v-layout>
          <v-flex v-for = "(location, i) in locInv" :key = i>
            <panel :title = location.loc>
              <v-layout>
              <v-subheader>{{location.locName}}</v-subheader>
              <v-spacer></v-spacer>
              </v-layout>
              <v-data-table
                    :items = location.inventory
                    class="elevation-1"
                    :headers = "headers"
                    :rows-per-page-items="rowsPerPageItems"
                  >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">{{ props.item.UPC }}</td>
                  <td class="text-xs-left">{{ props.item.prdNm }}</td>
                  <td class="text-xs-left">{{ props.item.qty}}</td>
                </template>
              </v-data-table>
            </panel>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex ma-5 v-if = false>
        <v-layout justify-center  column>
          <v-flex>
            <v-alert type="error"
              outline
              :value="error1"
              >
              {{ error1 }}
            </v-alert>
          </v-flex>
          <h1>Location Search</h1>
          <panel title = 'Find location By UPC'>
            <v-flex >
              <v-text-field
                autofocus
                label="UPC"
                ref="UPC1"
                v-model="UPC1"
                v-on:keydown.enter="handleUPCInput1()"
                required
                ></v-text-field>
            </v-flex>
          </panel>
          <panel title = "Location Inventory">
          <h3>{{UPCInvList.UPC}}</h3>
          <h3>{{UPCInvList.prdNm}}</h3>
          <v-subheader>{{UPCInvList.qty}}</v-subheader>
          <v-list two-line>
            <template v-for="(item, index) in UPCInvList.locationInventory">
              <v-list-tile :key="index" avatar ripple>
                <v-list-tile-content>
                  <v-list-tile-sub-title >Location  :  {{ item.loc }}</v-list-tile-sub-title>
                  <v-list-tile-sub-title>Quantity  :  {{ item.qty }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider v-if="index + 1 < UPCInvList.locationInventory.length" :key="`divider-${index}`"></v-divider>
            </template>
          </v-list>
          </panel>
          <panel title = "Seller Inventory">
          <v-list two-line>
            <template v-for="(item, index) in UPCInvList.sellerInventory">
              <v-list-tile :key="index" avatar ripple>
                <v-list-tile-content>
                  <v-list-tile-sub-title >OrgName  :  {{ item.org }}</v-list-tile-sub-title>
                  <v-list-tile-sub-title>Quantity  :  {{ item.qty }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider v-if="index + 1 < UPCInvList.sellerInventory.length" :key="`divider-${index}`"></v-divider>
            </template>
          </v-list>
          </panel>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Location from '@/services/LocationService'
import ProductInv from '@/services/ProductInvService'
export default {
  data () {
    return {
      // The original json for locations
      locations: [],
      // The loc ID and description for locations
      locs: [],
      // location and inventory information
      locInv: [],
      // User specified Location
      inputLoc: 'all',
      error: '',
      headers: [
        {
          text: 'UPC',
          align: 'left',
          value: 'UPC'
        },
        { text: 'Product Name', value: 'prdNm' },
        { text: 'Quantity', value: 'qty' }
      ],
      rowsPerPageItems: [30, 60, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 }],
      error1: '',
      UPC1: '',
      UPCInvList: [],
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
    async getLocInfo () {
      try {
        // result from Location collection
        let locResult = await Location.get()
        this.locations = locResult.data
        for (let i = 0; i < this.locations.length; i++) {
          this.locs.push({ 'locID': this.locations[i].locID, 'dspt': this.locations[i].dspt })
        }
        console.log(this.locIDs)
      } catch (error) {
        if (!error.response) {
          // network error
          this.error = 'Network Error: Fail to connet to server'
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.data.message)
          this.error = error.response.data.error
        }
      }
    },
    async getProdInvByLoc (loc) {
      try {
        // let locInvRes = await Location.getProdInvByLoc(loc)
        // this.locInv = locInvRes.data
        this.locInv = (await Location.getProdInvByLoc(loc)).data
      } catch (error) {
        if (!error.response) {
          // network error
          this.error = 'Network Error: Fail to connet to server'
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.data.message)
          this.error = error.response.data.error
        }
      }
    },
    async handleUPCInput1 () {
      try {
        this.UPCInvList = (await ProductInv.getByUPC(this.UPC1)).data[0]
        console.log(this.UPCInvList)
        this.UPC1 = ''
      } catch (error) {
        if (!error.response) {
          // network error
          this.error1 = 'Network Error: Fail to connet to server'
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.data.message)
          this.error1 = error.response.data.error
        }
      }
    },
    async changeLocMan () {
      this.inputLoc = document.getElementById('locNo').value.trim().toUpperCase()
      console.log(this.inputLoc)
      this.getProdInvByLoc(this.inputLoc)
    },
    async resetLocation () {
      this.inputLoc = 'all'
      this.getProdInvByLoc(this.inputLoc)
    },
    onBarcodeScanned (barcode) {
      barcode = barcode.toUpperCase()
      this.inputLoc = barcode
      console.log(this.inputLoc)
      this.getProdInvByLoc(this.inputLoc)
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
    this.getProdInvByLoc(this.inputLoc)
  },
  destroyed () {
    this.barcodeDestroy()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
