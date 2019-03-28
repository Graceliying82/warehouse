<template>
  <div  v-if="$store.state.isUserLoggedIn">
    <v-layout justify-center>
      <h1>Edit Locations</h1>
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
    <v-layout>
      <v-alert
        v-show = showAlert2
        :type = alertType2
        outline>
          {{message2}}
      </v-alert>
    </v-layout>
    <v-layout justify-center>
      <v-dialog v-model="dialog1" max-width="500px">
        <v-card>
          <v-card-text>
              <h1 pt-8>Edit Location</h1>
              <v-text-field
              v-model= editedItem.locID
              label="Location ID"
              readonly
              box
              ></v-text-field>
              <v-text-field
              v-model="editedItem.dspt"
              label="Location Description"
              ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="cancelDialog1">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click="confirmDialog1">Confirm</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog2" max-width="500px">
        <v-card>
          <v-card-text>
              <h1 pt-8>Delete Confirmation</h1>
              <h3>{{editedItem.locID}} will be deleted</h3>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="cancelDialog2">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click="confirmDialog2">Confirm</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-flex ma-5 xs8>
        <panel title = "Current Locations">
            <v-data-table
              :items="locations"
              class="elevation-1"
              :headers = "headers"
              :rows-per-page-items="rowsPerPageItems"
            >
              <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{ props.item.locID }}</td>
                <td class="text-xs-left">{{ props.item.dspt }}</td>
                <td class="text-xs-left layout px-0">
                  <v-btn icon class="mx-0" @click="editItem(props.item)">
                    <v-icon color="teal">edit</v-icon>
                  </v-btn>
                  <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                    <v-icon color="teal">delete_forever</v-icon>
                  </v-btn>
                </td>
              </template>
            </v-data-table>
        </panel>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Location from '@/services/LocationService'
export default {
  data () {
    return {
      locationID: '',
      locationDescription: '',
      // Alert 1
      alertType1: 'success',
      showAlert1: false,
      message1: '',
      dialog1: false,
      // Alert 2
      alertType2: 'success',
      showAlert2: false,
      message2: '',
      dialog2: false,
      locations: [],
      // Used for dialog1
      editedIndex: -1,
      editedItem: {
        LocID: '',
        dspt: ''
      },
      headers: [
        {
          text: 'LocationID',
          align: 'left',
          value: 'locID'
        },
        { text: 'Description',
          align: 'left',
          value: 'dspt' },
        { text: 'Actions',
          align: 'left',
          value: '_id',
          sortable: false }
      ],
      rowsPerPageItems: [30, 60, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 }]
    }
  },
  methods: {
    async submit () {
      this.message1 = ''
      this.showAlert1 = false
      this.message2 = ''
      this.showAlert2 = false
      if (this.locationID === '') {
        this.message1 = 'Location ID is required!'
        this.alertType1 = 'error'
        this.showAlert1 = true
        return
      }
      try {
        // Send data to server
        await Location.post({
          'locID': this.locationID.trim(),
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
          this.message1 = 'Network Error: Fail to connet to server'
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.data.message)
          this.message1 = error.response.data.error
        }
        this.alertType1 = 'error'
        this.showAlert1 = true
      }
    },
    editItem (item) {
      this.editedIndex = this.locations.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog1 = true
      this.message1 = ''
      this.showAlert1 = false
      this.message2 = ''
      this.showAlert2 = false
    },
    deleteItem (item) {
      this.editedIndex = this.locations.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog2 = true
      this.message1 = ''
      this.showAlert1 = false
      this.message2 = ''
      this.showAlert2 = false
    },
    cancelDialog1 () {
      this.dialog1 = false
      try {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      } catch (error) {
        console.log('error  : ' + error)
        this.message2 = error
        this.alertType2 = 'error'
        this.showAlert2 = true
      }
    },
    async confirmDialog1 () {
      try {
        this.dialog1 = false
        await Location.changeLocationDescription({
          'locID': this.editedItem.locID,
          'dspt': this.editedItem.dspt
        })
        this.getLocInfo()
        this.message2 = 'Location description updated!'
        this.alertType2 = 'success'
        this.showAlert2 = true
      } catch (error) {
        if (!error.response) {
          // network error
          this.message2 = 'Network Error: Fail to connet to server'
        } else if (error.response.data.error.includes('jwt')) {
          console.log('jwt error')
          this.$store.dispatch('resetUserInfo', true)
          this.$router.push('/login')
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.statusText)
          this.message2 = error.response.data.error
        }
        this.alertType2 = 'error'
        this.showAlert2 = true
      }
    },
    cancelDialog2 () {
      this.dialog2 = false
    },
    async confirmDialog2 () {
      try {
        this.dialog2 = false
        await Location.deleteLocation(this.editedItem.locID)
        this.getLocInfo()
        this.message2 = 'Location ' + this.editedItem.locID + ' deleted!'
        this.alertType2 = 'success'
        this.showAlert2 = true
      } catch (error) {
        if (!error.response) {
          // network error
          this.message2 = 'Network Error: Fail to connet to server'
        } else if (error.response.data.error.includes('jwt')) {
          console.log('jwt error')
          this.$store.dispatch('resetUserInfo', true)
          this.$router.push('/login')
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.statusText)
          this.message2 = error.response.data.error
        }
        this.alertType2 = 'error'
        this.showAlert2 = true
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
