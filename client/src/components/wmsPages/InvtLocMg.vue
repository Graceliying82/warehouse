<template>
  <div  v-if="$store.state.isUserLoggedIn">
    <v-layout justify-center>
      <h1>Location Map</h1>
    </v-layout>
    <v-layout v-for = "(location, i) in locIDs" :key = i>
      <panel :title = location>
        <v-data-table
              :items="items"
              class="elevation-1"
              hide-headers
              :rows-per-page-items="rowsPerPageItems"
            >
          <template slot="items" slot-scope="props">
            <td >{{ props.item.UPC }}</td>
            <td >{{ props.item.qty}}</td>
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
      locations: [],
      locIDs: [],
      items: [{ UPC: "123", qty:3 },
        { UPC: "123", qty:3 },
        { UPC: "123", qty:3 },
        { UPC: "123", qty:3 },
        { UPC: "123", qty:3 },
        { UPC: "123", qty:3 },
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
          this.locIDs.push(this.locations[i].locID)
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
    }
  },
  created () {
    this.getLocInfo()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
