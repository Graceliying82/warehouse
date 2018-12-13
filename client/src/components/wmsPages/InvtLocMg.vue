<template>
  <div  v-if="$store.state.isUserLoggedIn">
    <v-layout justify-center>
      <h1>Inventory Location Management</h1>
    </v-layout>
    <v-layout justify-center>
      <v-flex ma-5 xs4>
        <v-alert
          v-show = showAlert1
          :type = alertType1
          outline>
            {{message1}}
          </v-alert>
        <v-card>
          <panel title="Add A New Location">
            <v-text-field
            v-model="locationID"
            label="Location ID"
            required
            ></v-text-field>
            <v-text-field
            v-model="locationDescription"
            label="Location Description"
            ></v-text-field>
            <v-btn
            dark
            class="cyan darken-2"
            @click.prevent="submit()">Submit</v-btn>
          </panel>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout justify-center>
      <v-flex ma-5 xs8>
        <panel title = "Current Locations">
            <v-data-table
              :items="locations"
              class="elevation-1"
              hide-headers
              :rows-per-page-items="rowsPerPageItems"
            >
              <template slot="items" slot-scope="props">
                <td>{{ props.item.name }}</td>
                <td >{{ props.item.locID }}</td>
                <td >{{ props.item.dspt }}</td>
                <td class="layout px-0">
                  <v-icon
                    small
                    class="mr-2"
                  >edit
                  </v-icon>
                  <v-icon
                    small
                  >delete
                  </v-icon>
                </td>
              </template>
            </v-data-table>
        </panel>
      </v-flex>
    </v-layout>LocationNickName
  </div>
</template>

<script>
import Location from '@/services/Location'
export default {
  data () {
    return {
      locationID: '',
      locationDescription: '',
      alertType1: 'success',
      showAlert1: false,
      message1: '',
      locations: [],
      rowsPerPageItems: [30, 60, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 }]
    }
  },
  methods: {
    async submit () {
      console.log('Call submit!')
      try {
        // Send data to server
        await Location.post({
          'locID': this.locationID,
          'dspt': this.locationDescription
        })
        this.message1 = 'Successfully Added a new location ID: '
        this.alertType1 = 'success'
        this.showAlert1 = true
        this.locationID = ''
        this.locationDescription = ''
        this.getLocInfo()
      } catch (error) {
        if (!error.response) {
          // network error
          this.message1 = 'Network Error: Fail to connet to server'
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.statusText)
          this.message1 = error.response.data.error
        }
        this.alertType1 = 'error'
        this.showAlert1 = true
      }
    },
    async getLocInfo () {
      try {
        // result from Location collection
        let locResult = await Location.get()
        this.locations = locResult.data
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
