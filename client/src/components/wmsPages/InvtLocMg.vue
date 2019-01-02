<template>
  <div  v-if="$store.state.isUserLoggedIn">
    <v-layout justify-center>
      <h1>Location Inventory</h1>
        <v-alert type="error"
          outline
          :value="error"
          >
          {{ error }}
        </v-alert>
    </v-layout>
    <v-layout justify-center v-for = "(location, i) in locInv" :key = i>
      <panel :title = location.loc>
        <v-layout>
        <v-subheader>{{location.locName}}</v-subheader>
        <v-spacer></v-spacer>
        <v-btn>More</v-btn>
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
    </v-layout>
  </div>
</template>

<script>
import Location from '@/services/Location'
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
      rowsPerPageItems: [30, 60, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 }]
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
        let locInvRes = await Location.getProdInvByLoc(loc)
        this.locInv = locInvRes.data
      } catch (error) {
        if (!error.response) {
          // network error
          this.error = 'Network Error: Fail to connet to server'
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.data.message)
          this.error = error.response.data.error
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
