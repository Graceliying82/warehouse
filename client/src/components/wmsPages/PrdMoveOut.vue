<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-layout>
      <v-flex>
          <v-alert
            v-show = showAlert
            :type = alertType
            outline>
              {{message}}
            </v-alert>
        </v-flex>
    </v-layout>
    <v-dialog v-model="showAlertDialog" max-width="1000px">
      <v-card>
        <v-card-text>
            <h2 pt-8>{{message}}</h2>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-layout justify-center>
      <h1>Move out Products</h1>
    </v-layout>
    <!-- Move Out items list -->
    <v-layout justify-center>
      <v-flex ma-5 xs8>
        <v-flex>
          <v-card>
            <v-card-title class="title font-weight-light cyan lighten-1">
            <span style='margin-right:1.25em; display:inline-block;'>Please scan :</span>
            <span style="color:red;font-weight:bold">{{currentScan}}</span>
            </v-card-title>
            <v-card-text>
              <h3 align='left'>Move from location: {{moLoc1}}</h3>
              <br>
              <v-layout>
                <v-flex>
                  <v-data-table
                    :headers="moItems1Headers"
                    :items="moItems1"
                    :rows-per-page-items="rowsPerPageItems"
                    class="elevation-1">
                      <template slot="items" slot-scope="props">
                        <td
                          class="text-xs-left">{{ props.item.UPC }}</td>
                        <td
                          class="text-xs-left">
                          <v-edit-dialog
                            @open="props.item._qty = props.item.qty"
                            @cancel="props.item.qty = props.item._qty || props.item.qty"
                          >
                          {{ props.item.qty }}
                          <v-text-field
                              slot="input"
                              v-model.number= "props.item.qty"
                              label="Quantity"
                              single-line
                              >
                            </v-text-field>
                          </v-edit-dialog>
                        </td>
                        <td class="text-xs-left">
                          <!-- Start of Action buttons -->
                          <v-btn icon class="mx-0" @click.prevent="deleteItem(props.item)">
                            <v-icon color="teal">delete_forever</v-icon>
                          </v-btn>
                          <v-btn icon class="mx-0" @click="props.item.qty += 1">
                            <v-icon color="teal">add_circle</v-icon>
                          </v-btn>
                          <v-btn icon class="mx-0"
                            @click="props.item.qty > 1 ? props.item.qty -= 1 : ''">
                            <v-icon color="teal">remove_circle</v-icon>
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
            <!-- Manual input area-->
            <v-layout my-2 mx-5>
              <v-text-field
                label="Move from Location"
                id="moLocMan"
                clearable
              ></v-text-field>
              <v-btn @click = "changeMoLocMan">Change</v-btn>
            </v-layout>
            <v-layout my-2 mx-5>
              <v-text-field
                label="UPC"
                id="moUPCMan"
                clearable
              ></v-text-field>
              <v-btn @click = "changeMoUPCMan">Change</v-btn>
            </v-layout>
            <v-layout my-2 mx-5>
              <v-text-field
                label="Note"
                v-model="note"
                counter =  500
              ></v-text-field>
            </v-layout>
            <!-- End Manual input area-->
          </v-card>
        </v-flex>
      </v-flex>
    </v-layout>
    <!-- End of Move out items list -->
  </div>
</template>

<script>
import Location from '@/services/LocationService'
import ProductInv from '@/services/ProductInvService'
export default {
  data () {
    return {
      dialog: false,
      rules: {
        qnRule1: val => val < 1000000 || 'Not a valid number',
        qnRule2: val => val >= 0 || 'Not a valid number'
      },
      currentScan: 'Move from Location',
      // 'Move out Location', 'UPC'
      moLoc1: '',
      UPC1: '',
      alertType: 'success',
      showAlert: false,
      message: '',
      showAlertDialog: false,
      moItems1Headers: [
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
      moItems1: [],
      rowsPerPageItems: [30, 60, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 }],
      note: '',
      // handle barcode scanning
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
      this.showAlert = false
      this.message = ''
    },
    setAlert (type, message) {
      this.message = message
      this.alertType = type
      this.showAlert = true
    },
    setAlertDialog (message) {
      this.message = message
      this.showAlertDialog = true
    },
    clearMoveItems () {
      this.currentScan = 'Move from Location'
      this.moLoc1 = ''
      this.UPC1 = ''
      this.moItems1 = []
    },
    reset () {
      this.clearAlert()
      this.clearMoveItems()
    },
    deleteItem (item) {
      const index = this.moItems1.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.moItems1.splice(index, 1)
    },
    handleUPCInput (input) {
      if (input === 'WMS-RECEIVING-SUBMIT') {
        this.submit1()
      } else {
        let idx = -1
        for (let i = 0; i < this.moItems1.length; i++) {
          if ((this.moItems1[i].UPC === input)) {
            idx = i
            break
          }
        }
        if (idx !== -1) {
          // qty ++
          this.moItems1[idx].qty++
        } else {
          this.moItems1.push({UPC: input, qty: 1})
        }
      }
    },
    onBarcodeScanned (barcode) {
      this.clearAlert()
      if (this.currentScan === 'Move from Location') {
        barcode = barcode.toUpperCase()
        this.checkLocationExisted(barcode).then((existed) => {
          if (existed) {
            this.moLoc1 = barcode
            this.currentScan = 'UPC'
          } else {
            this.setAlertDialog('Location: ' + barcode + ' Not Existed! Create one before using!')
          }
        })
      } else if (this.currentScan === 'UPC') {
        this.handleUPCInput(barcode)
      }
    },
    changeMoLocMan () {
      this.clearAlert()
      let aLoc = document.getElementById('moLocMan').value.trim().toUpperCase()
      this.checkLocationExisted(aLoc).then((existed) => {
        if (existed) {
          this.moLoc1 = aLoc
          this.currentScan = 'UPC'
        } else {
          this.setAlertDialog('Location: ' + aLoc + ' Not Existed! Create one before using!')
        }
      })
    },
    changeMoUPCMan () {
      this.clearAlert()
      let aLoc = document.getElementById('moUPCMan').value.trim()
      if (this.moLoc1 === '') {
        this.setAlertDialog('Set Location for move out first')
      } else {
        this.handleUPCInput(aLoc)
      }
    },
    async checkLocationExisted (locID) {
      try {
        let locIDExisted = await Location.checkLocationExisted(locID)
        if (locIDExisted.data.length === 0) {
          return false
        } else {
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
        if (this.moItems1.length === 0) {
          this.setAlert('error', 'UPC is required!')
        } else {
          await ProductInv.moveInBatch({
            'move': this.moItems1,
            'locFrom': this.moLoc1,
            'locTo': 'WMS',
            'note': ''
          })
          this.setAlertDialog('Move out successfully!')
          this.clearMoveItems()
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
          console.log('error ' + error.response.status + ' : ' + error.response.data.error)
          this.setAlertDialog(error.response.data.error)
        }
      }
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
  },
  destroyed () {
    this.barcodeDestroy()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
