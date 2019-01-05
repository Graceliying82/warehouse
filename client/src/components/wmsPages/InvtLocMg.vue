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
      <v-flex ma-5>
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
import Location from '@/services/Location'
import ProductInv from '@/services/productInv'
export default {
  data () {
    return {
      // The original json for locations
      locations: [],
      // The loc ID and description for locations
      locs: [],
      // location and inventory information
      locInv: [],
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
      UPCInvList: []

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
    }
  },
  created () {
    this.getProdInvByLoc('all')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
