<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-layout justify-center>
      <h1>Move in Products</h1>
    </v-layout>
    <!-- Move In items list -->
    <v-layout justify-center>
      <v-flex ma-5 xs8>
        <v-alert
          v-show = showAlert1
          :type = alertType1
          outline>
            {{message1}}
          </v-alert>
        <v-flex>
          <v-card>
            <v-card-title class="title font-weight-light cyan lighten-1">
            <span style='margin-right:1.25em; display:inline-block;'>Please scan :</span>
            <span style="color:red;font-weight:bold">{{currentScan}}</span>
            </v-card-title>
            <v-card-text>
              <h3 align='left'>Move In location: {{miLoc1}}</h3>
              <br>
              <v-layout>
                  <v-flex>
                  <v-data-table
                  :headers="miItems1Headers"
                  :items="miItems1"
                  :rows-per-page-items="rowsPerPageItems"
                  class="elevation-1">
                    <template v-for = "it in miItems1" slot="items" slot-scope="props">
                      <td
                        :key="it.UPC + '-UPC'"
                        class="text-xs-left">{{ props.item.UPC }}</td>
                      <td
                        :key="it.qty + '-qty'"
                        class="text-xs-left">
                        {{ props.item.qty }}
                      </td>
                      <td :key="it.UPC + '-action'" class="text-xs-left">
                        <!-- Start of Action buttons -->
                        <v-btn icon class="mx-0" @click="editItem(props.item)">
                          <v-icon color="teal">edit</v-icon>
                        </v-btn>
                        <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                          <v-icon color="teal">delete_forever</v-icon>
                        </v-btn>
                        <!-- End of Action buttons -->
                      </td>
                    </template>
                  </v-data-table>
                  </v-flex>
                </v-layout>
                <v-btn dark @click.prevent="submit1">Submit</v-btn>
                <v-btn dark @click.prevent="reset">Reset</v-btn>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-flex>
    </v-layout>
    <!-- End of Move In items list -->
    <!-- Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit Items</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout column>
              <v-flex xs12 sm6 md4>
                <v-text-field
                  v-model="editedItem.UPC"
                  readonly
                  box
                  label="UPC"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editedItem.qty" label="Quantity"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End of Dialog -->
  </div>
</template>

<script>
import Location from '@/services/Location'
import ProductInv from '@/services/productInv'
export default {
  data () {
    return {
      dialog: false,
      editedIndex: -1,
      editedItem: {
        UPC: '',
        qty: 0
      },
      rules: {
        qnRule1: val => val < 1000000 || 'Not a valid number',
        qnRule2: val => val >= 0 || 'Not a valid number'
      },
      currentScan: 'Move in Location',
      // 'Move in Location', 'UPC'
      miLoc1: '',
      UPC1: '',
      alertType1: 'success',
      showAlert1: false,
      message1: '',
      miItems1Headers: [
        {
          text: 'UPC',
          align: 'left',
          value: 'UPC',
          sortable: false
        },
        { text: 'Quantity',
          align: 'left',
          sortable: false,
          value: 'qty'
        },
        { text: 'Actions',
          align: 'left',
          value: 'UPC',
          sortable: false
        }
      ],
      miItems1: [],
      rowsPerPageItems: [30, 60, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 }]
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
    clearMoveItems () {
      this.currentScan = 'Move in Location'
      this.miLoc1 = ''
      this.UPC1 = ''
      this.miItems1 = []
    },
    reset () {
      this.clearAlert()
      this.clearMoveItems()
    },
    editItem (item) {
      this.editedIndex = this.miItems1.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item) {
      const index = this.miItems1.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.miItems1.splice(index, 1)
    },
    close () {
      this.editedItem.UPC = ''
      this.editedItem.qty = 0
      this.dialog = false
    },
    save () {
      this.miItems1[this.editedIndex].qty = parseInt(this.editedItem.qty)
      this.dialog = false
    },
    handleUPCInput (input) {
      if (input === 'WMS-RECEIVING-SUBMIT') {
        this.submit1()
      } else {
        let idx = -1
        for (let i = 0; i < this.miItems1.length; i++) {
          if ((this.miItems1[i].UPC === input)) {
            idx = i
            break
          }
        }
        if (idx !== -1) {
          // qty ++
          this.miItems1[idx].qty++
        } else {
          this.miItems1.push({UPC: input, qty: 1})
        }
      }
    },
    onBarcodeScanned (barcode) {
      this.clearAlert()
      if (this.currentScan === 'Move in Location') {
        this.checkLocationExisted(barcode).then((existed) => {
          if (existed) {
            this.miLoc1 = barcode
            this.currentScan = 'UPC'
          } else {
            this.setAlert('error', 'Location: ' + barcode + ' Not Existed! Create one before using!')
          }
        })
      } else if (this.currentScan === 'UPC') {
        this.handleUPCInput(barcode)
      }
    },
    async checkLocationExisted (locID) {
      try {
        let locIDExisted = await Location.checkLocationExisted(locID)
        if (locIDExisted.data.length === 0) {
          // Location doesn't existed!
          return false
        } else {
          // Location found. Switch to UPC input
          return true
        }
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
    async submit1 () {
      try {
        if (this.miItems1.length === 0) {
          this.setAlert('error', 'UPC is required!')
          return
        }
        await ProductInv.moveInBatch({
          'move': this.miItems1,
          'locFrom': 'WMS',
          'locTo': this.miLoc1,
          'note': ''
        })
        this.setAlert('success', 'Move in successfully!')
        this.clearMoveItems()
      } catch (error) {
        if (!error.response) {
          // network error
          this.setAlert('error', 'Network Error: Fail to connet to server')
        } else if (error.response.data.error.includes('jwt')) {
          console.log('jwt error')
          this.$store.dispatch('resetUserInfo', true)
          this.$router.push('/login')
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.data.error)
          this.setAlert('error', error.response.data.error)
        }
      }
    }
  },
  created () {
    this.$barcodeScanner.init(this.onBarcodeScanned)
  },
  destroyed () {
    this.$barcodeScanner.destroy()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
