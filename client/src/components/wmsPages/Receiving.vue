<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-layout row>
      <v-layout column>
        <v-layout>
          <v-flex lg8>
            <v-alert
              v-show = showAlert1
              :type = alertType1
              outline>
              {{message1}}
            </v-alert>
            <v-tabs
              color = "cyan"
              dark
              v-model="currentTab"
              slider-color = "cyan darken-4">
              <v-tab ripple>
                Lazy
              </v-tab>
              <v-tab ripple>
                Number
              </v-tab>
              <v-tab ripple>
                Batch
              </v-tab>
              <!-- tab for Lazy mode -->
              <v-tab-item id='lazyTab'>
                <h3>Please Scan</h3>
                <h2 style="color:red;">{{currentScanLazy}}</h2>
                <h3 align='left'>OrgName: {{orgNameLazy}}</h3>
                <h3 align='left'>Tracking: {{trackingLazy}}</h3>
                <v-layout>
                  <v-data-table
                  :headers="lazyHeaders"
                  :items="receiveItemsLazy"
                  :rows-per-page-items="rowsPerPageItems"
                  class="elevation-1">
                    <template slot="items" slot-scope="props">
                      <td
                        class="text-xs-left">{{ props.item.UPC }}</td>
                      <td
                        class="text-xs-left">
                        <v-btn icon class="mx-0" @click="props.item.qn += 1">
                          <v-icon color="teal">add_circle</v-icon>
                        </v-btn>
                        {{ props.item.qn }}
                        <v-btn icon class="mx-0" @click="props.item.qn > 1 ? props.item.qn -= 1 : ''">
                          <v-icon color="teal">remove_circle</v-icon>
                        </v-btn>
                      </td>
                    </template>
                  </v-data-table>
                </v-layout>
                <v-btn dark @click.prevent="submit()">Submit</v-btn>
                <v-btn dark @click.prevent="clear()">Reset</v-btn>
              </v-tab-item>
              <!-- tab for Number mode -->
              <v-tab-item id='numberTab'>
                <h3>Please Scan</h3>
                <h2 style="color:red;">{{currentScanNumber}}</h2>
                <h3 align='left'>OrgName: {{orgNameNumber}}</h3>
                <h3 align='left'>Tracking: {{trackingNumber}}</h3>
                <h3 align='left'>UPC: {{UPCNumber}}</h3>
                <v-layout>
                  <v-data-table
                  :headers="numberHeaders"
                  :items="receiveItemsNumber"
                  :rows-per-page-items="rowsPerPageItems"
                  class="elevation-1">
                    <template slot="items" slot-scope="props">
                      <td
                        class="text-xs-left">{{ props.item.UPC }}</td>
                      <td
                        class="text-xs-left">
                        <v-btn icon class="mx-0" @click="props.item.qn += 1">
                          <v-icon color="teal">add_circle</v-icon>
                        </v-btn>
                        {{ props.item.qn }}
                        <v-btn icon class="mx-0"
                          @click="props.item.qn > 1 ? props.item.qn -= 1 : ''">
                          <v-icon color="teal">remove_circle</v-icon>
                        </v-btn>
                      </td>
                    </template>
                  </v-data-table>
                </v-layout>
                <v-btn dark @click.prevent="submit()">Submit</v-btn>
                <v-btn dark @click.prevent="clear()">Reset</v-btn>
              </v-tab-item>
               <!-- tab for Batch mode -->
               <v-tab-item id='numberTab'>
                <h3>Please Scan</h3>
                <h2 style="color:red;">{{currentScanBatch}}</h2>
                <h3 align='left'>OrgName: {{orgNameBatch}}</h3>
                <h3 align='left'>UPC: {{UPCBatch}}</h3>
                <h3 align='left'>Quantity: {{qtyBatch}}</h3>
                <h3 align='left'>Tracking: {{trackingBatch}}</h3>
                <v-layout>
                  <v-data-table
                  :headers="batchHeaders"
                  :items="receiveItemsBatch"
                  :rows-per-page-items="rowsPerPageItems"
                  class="elevation-1">
                    <template slot="items" slot-scope="props">
                      <td
                        class="text-xs-left">{{ props.item.trNo }}</td>
                      <td
                      class="text-xs-left">{{ props.item.orgNm }}</td>
                      <td
                        class="text-xs-left">{{ props.item.UPC }}</td>
                      <td
                        class="text-xs-left">
                        {{ props.item.qn }}
                      </td>
                    </template>
                  </v-data-table>
                </v-layout>
                <v-btn dark @click.prevent="clear()">Reset</v-btn>
              </v-tab-item>
            </v-tabs>
            <br>
            <br>
            <v-alert
              v-show = showAlert2
              :type = alertType2
              outline>
              {{message2}}
            </v-alert>
            <v-card >
              <v-card-title primary-title >
                <div>
                  <div class="headline" >Manual Input</div>
                </div>
              </v-card-title>
              <v-layout mx-3>
                <v-text-field
                  label="Organization Name"
                  ref="orgNameMan"
                  id="orgNameMan"
                  clearable
                  ></v-text-field>
                <v-btn @click.prevent=setValueOrgMan>Change</v-btn>
              </v-layout>
              <v-layout mx-3>
                <v-text-field
                  label="Tracking Number"
                  ref='trackingMan'
                  id='trackingMan'
                  clearable
                  ></v-text-field>
                <v-btn @click.prevent=setValueTrMan>Change</v-btn>
              </v-layout>
              <v-layout mx-3>
                <v-text-field
                  label="UPC"
                  ref='UPCMan'
                  id='UPCMan'
                  clearable
                  ></v-text-field>
                <v-btn @click.prevent = 'addUPCMan'>Add</v-btn>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-dialog v-model="trackingExisted" max-width="500px">
            <v-card>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout column>
                  <v-flex xs12 sm6 md6>
                    <h1 style="color:red;">Warning: Tracking Existed! </h1>
                    <h3></h3>
                    <h3>Organization Name: {{existedOrgNm}}</h3>
                    <h3>Cancel: use another tracking number</h3>
                    <h3>Confirm: OrgName will be changed to {{existedOrgNm}}! </h3>
                    <h3>Append to existed record!</h3>
                  </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" autofocus flat @click.native="confirmDialog">Confirm</v-btn>
                <v-btn color="blue darken-1" flat @click.native="cancelDialog">Cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-layout>
      </v-layout>
      <v-layout align-start justify-start justify-space-around ml-5 column>
        <v-layout align-start row>
          <v-flex>
            <div>
              <video ref="video1" id="video" width="100%" height="400"
                :src="source1" autoplay>
                Video stream not available.</video>
              <canvas ref="canvas1" id="canvas" width="100%" height="400"></canvas>
            </div>
          </v-flex>
          <v-flex>
            <v-btn fab small
              v-on:click= "startCamera1"
              :disabled=cam1NotFound
              color="cyan darken-2">
              <v-icon>videocam</v-icon>
            </v-btn>
            <v-btn fab small
              v-on:click= "stopCamera1"
              :disabled=cam1NotFound
              color="cyan darken-2">
              <v-icon>videocam_off</v-icon>
            </v-btn>
            <v-flex ml-2 lg8>
            <v-select
              :items="cameraLabels"
              v-model="selectCamera1"
              label="Select Camera1"
              @change="changeCamera1(selectCamera1)"></v-select>
            </v-flex>
          </v-flex>
        </v-layout>
        <v-layout align-start row>
          <v-flex>
            <div>
              <video ref="video2" id="video" width="100%" height="400"
                  :src="source2" autoplay>
                  Video stream not available.</video>
              <canvas ref="canvas2" id="canvas" width="100%" height="400"></canvas>
            </div>
          </v-flex>
          <v-flex>
            <v-btn fab small
              v-on:click= "startCamera2"
              :disabled=cam2NotFound
              color="cyan darken-2">
              <v-icon>videocam</v-icon>
            </v-btn>
            <v-btn fab small
              v-on:click= "stopCamera2"
              :disabled=cam2NotFound
              color="cyan darken-2">
              <v-icon >videocam_off</v-icon>
            </v-btn>
            <v-flex ml-2 lg8>
            <v-select
              :items="cameraLabels"
              v-model="selectCamera2"
              label="Select Camera2"
              @change="changeCamera2(selectCamera2)"></v-select>
            </v-flex>
          </v-flex>
        </v-layout>
      </v-layout>
    </v-layout>
  </div>
</template>

<script>
import Inventory from '@/services/InventoryService'
export default {
  data () {
    return {
      rules: {
        qnRule1: val => val < 1000000 || 'Not a valid number',
        qnRule2: val => val >= 0 || 'Not a valid number'
      },
      // Data for Lazy mode
      lazyHeaders: [
        {
          text: 'UPC',
          align: 'left',
          value: 'UPC',
          sortable: false
        },
        { text: 'Quantity',
          align: 'left',
          sortable: false,
          value: 'qn' }
      ],
      rowsPerPageItems: [30, 60, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 }],
      currentScanLazy: 'Organization Name',
      // currentScanLazy: 'Organization Name' ; 'Tracking No'; 'UPC'
      orgNameLazy: '',
      trackingLazy: '',
      UPCLazy: '',
      qtyLazy: '',
      receiveItemsLazy: [],
      // Data for number mode
      numberHeaders: [
        {
          text: 'UPC',
          align: 'left',
          value: 'UPC',
          sortable: false
        },
        { text: 'Quantity',
          align: 'left',
          sortable: false,
          value: 'qn' }
      ],
      currentScanNumber: 'Organization Name',
      // currentScanLazy: 'Organization Name' ; 'Tracking No'; 'UPC'; 'Quantity'
      orgNameNumber: '',
      trackingNumber: '',
      UPCNumber: '',
      qtyNumber: '',
      receiveItemsNumber: [],
      // Data for batch mode
      batchHeaders: [
        {
          text: 'Tracking',
          align: 'left',
          value: 'trNo',
          sortable: false
        },
        {
          text: 'OrgName',
          align: 'left',
          value: 'orgNm',
          sortable: false
        },
        {
          text: 'UPC',
          align: 'left',
          value: 'UPC',
          sortable: false
        },
        { text: 'Quantity',
          align: 'left',
          sortable: false,
          value: 'qn' }
      ],
      currentScanBatch: 'Organization Name',
      // currentScanLazy: 'Organization Name' ; 'Tracking No'; 'UPC'; 'Quantity'
      orgNameBatch: '',
      trackingBatch: '',
      UPCBatch: '',
      qtyBatch: '',
      receiveItemsBatch: [],
      existedTracking: [],
      trackingExisted: false,
      existedOrgNm: '',
      currentTab: 0,
      alertType1: 'success',
      showAlert1: false,
      alertType2: 'success',
      showAlert2: false,
      message1: '',
      message2: '',
      // camera related codes
      source1: null,
      source2: null,
      canvas1: null,
      canvas2: null,
      cameras: [],
      cameraLabels: [],
      selectCamera1: null,
      selectCamera2: null,
      // index of camera selected for video1
      camera1Selected: 0,
      // index of camera selected for video1
      camera2Selected: 1,
      camerasListEmitted: false,
      deviceId1: null,
      deviceId2: null,
      cam1NotFound: true,
      cam2NotFound: true,
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
      this.showAlert1 = false
      this.showAlert2 = false
      this.message1 = ''
      this.message2 = ''
    },
    setAlert1 (type, message) {
      this.message1 = message
      this.alertType1 = type
      this.showAlert1 = true
    },
    setAlert2 (type, message) {
      this.message2 = message
      this.alertType2 = type
      this.showAlert2 = true
    },
    clearLazy () {
      this.orgNameLazy = ''
      this.trackingLazy = ''
      this.UPCLazy = ''
      this.currentScanLazy = 'Organization Name'
      this.receiveItemsLazy = []
    },
    clearNumber () {
      this.orgNameNumber = ''
      this.trackingNumber = ''
      this.UPCNumber = ''
      this.currentScanNumber = 'Organization Name'
      this.receiveItemsNumber = []
    },
    clearBatch () {
      this.orgNameBatch = ''
      this.trackingBatch = ''
      this.UPCBatch = ''
      this.qtyBatch = ''
      this.currentScanBatch = 'Organization Name'
      this.receiveItemsBatch = []
    },
    clear () {
      this.clearAlert()
      this.clearLazy()
      this.clearNumber()
      this.clearBatch()
    },
    async checkTrackingExisted (tracking) {
      try {
        this.existedTracking = await Inventory.checkTrackingExisted(tracking)
        if (this.existedTracking.data[0] !== undefined) {
          this.trackingExisted = true
          this.existedOrgNm = this.existedTracking.data[0].orgNm
        } else {
          // Not a existed UPC
          if (this.currentTab === 0) {
            this.currentScanLazy = 'UPC'
          } else if (this.currentTab === 1) {
            this.currentScanNumber = 'UPC'
          } else if (this.currentTab === 2) {
            this.updateReceiveItemsBatch()
            this.submit()
          }
        }
      } catch (error) {
        if (!error.response) {
          // network error
          this.message1 = 'Network Error: Fail to connet to server'
        } else if (error.response.data.error.includes('jwt')) {
          console.log('jwt error')
          this.$store.dispatch('resetUserInfo', true)
          this.$router.push('/login')
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.statusText)
          this.message1 = error.response.data.error
        }
        this.alertType1 = 'error'
        this.showAlert1 = true
      }
    },
    updateReceiveItemsBatch () {
      this.receiveItemsBatch.push({
        trNo: this.trackingBatch,
        orgNm: this.orgNameBatch,
        UPC: this.UPCBatch,
        qn: this.qtyBatch})
    },
    handleUPC (receiveItems, upc, qn) {
      if (upc === 'WMS-RECEIVING-SUBMIT') {
        this.submit()
        return
      }
      let found = false
      for (let i = 0; i < receiveItems.length; i++) {
        if (upc === receiveItems[i].UPC) {
          receiveItems[i].qn = receiveItems[i].qn + qn
          found = true
          break
        }
      }
      if (!found) {
        receiveItems.push({ UPC: upc, qn: qn, prdNm: '', price: 0 })
      }
    },
    async onBarcodeScanned (barcode) {
      // console.log('Here')
      this.clearAlert()
      if ((document.activeElement.id === 'orgNameMan') ||
          (document.activeElement.id === 'trackingMan') ||
          (document.activeElement.id === 'UPCMan')) {
        console.log('Do nothing in Manual mode.')
      } else {
        if (this.currentTab === 0) {
          if (this.currentScanLazy === 'Organization Name') {
            this.orgNameLazy = barcode
            this.currentScanLazy = 'Tracking No'
          } else if (this.currentScanLazy === 'Tracking No') {
            this.trackingLazy = barcode
            await this.checkTrackingExisted(barcode)
          } else if (this.currentScanLazy === 'UPC') {
            this.handleUPC(this.receiveItemsLazy, barcode, 1)
          }
        } else if (this.currentTab === 1) {
          if (this.currentScanNumber === 'Organization Name') {
            this.orgNameNumber = barcode
            this.currentScanNumber = 'Tracking No'
          } else if (this.currentScanNumber === 'Tracking No') {
            this.trackingNumber = barcode
            await this.checkTrackingExisted(barcode)
          } else if (this.currentScanNumber === 'UPC') {
            if (barcode === 'WMS-RECEIVING-SUBMIT') {
              this.submit()
              return
            }
            this.UPCNumber = barcode
            this.currentScanNumber = 'Quantity'
          } else if (this.currentScanNumber === 'Quantity') {
            if (isNaN(parseInt(barcode)) || (parseInt(barcode) > 9999)) {
              this.setAlert1('error', 'Not a valid quantity!')
            } else {
              this.handleUPC(this.receiveItemsNumber, this.UPCNumber, parseInt(barcode))
              this.currentScanNumber = 'UPC'
            }
          }
        } else if (this.currentTab === 2) {
          if (this.currentScanBatch === 'Organization Name') {
            this.orgNameBatch = barcode
            this.currentScanBatch = 'UPC'
          } else if (this.currentScanBatch === 'UPC') {
            this.UPCBatch = barcode
            this.currentScanBatch = 'Quantity'
          } else if (this.currentScanBatch === 'Quantity') {
            if (isNaN(parseInt(barcode)) || (parseInt(barcode) > 9999)) {
              this.setAlert1('error', 'Not a valid quantity!')
            } else {
              this.qtyBatch = barcode
              // Handle input Error
              this.currentScanBatch = 'Tracking No'
            }
          } else if (this.currentScanBatch === 'Tracking No') {
            this.trackingBatch = barcode
            this.checkTrackingExisted(barcode)
          }
        }
      }
    },
    setValueOrgMan () {
      let orgValue = ''
      if (this.currentTab === 0) {
        // Lazy Mode
        orgValue = document.getElementById('orgNameMan').value
        this.orgNameLazy = orgValue.trim()
        this.currentScanLazy = 'Tracking No'
      } else if (this.currentTab === 1) {
        // Number Mode
        orgValue = document.getElementById('orgNameMan').value
        this.orgNameNumber = orgValue.trim()
        this.currentScanNumber = 'Tracking No'
      } else if (this.currentTab === 2) {
        this.message2 = 'Manual Input not supported in Batch Mode'
        this.alertType2 = 'error'
        this.showAlert2 = true
      }
    },
    async setValueTrMan () {
      let trackingValue = ''
      if (this.currentTab === 0) {
        // Lazy Mode
        trackingValue = document.getElementById('trackingMan').value
        await this.checkTrackingExisted(trackingValue.trim())
        this.trackingLazy = trackingValue.trim()
        this.currentScanLazy = 'UPC'
      } else if (this.currentTab === 1) {
        // Number Mode
        trackingValue = document.getElementById('trackingMan').value
        await this.checkTrackingExisted(trackingValue.trim())
        this.trackingNumber = trackingValue.trim()
        this.currentScanNumber = 'UPC'
      } else if (this.currentTab === 2) {
        this.message2 = 'Manual Input not supported in Batch Mode'
        this.alertType2 = 'error'
        this.showAlert2 = true
      }
    },
    addUPCMan () {
      let UPCValue = ''
      if (this.currentTab === 0) {
        // Lazy Mode
        UPCValue = document.getElementById('UPCMan').value
        this.handleUPC(this.receiveItemsLazy, UPCValue.trim(), 1)
      } else if (this.currentTab === 1) {
        // Number Mode
        this.handleUPC(this.receiveItemsNumber, UPCValue.trim(), 1)
      } else if (this.currentTab === 2) {
        this.message2 = 'Manual Input not supported in Batch Mode'
        this.alertType2 = 'error'
        this.showAlert2 = true
      }
    },
    async submit () {
      try {
        let trNo = ''
        let orgNm = ''
        let receiveItems = []
        // find which tab to submit
        if (this.currentTab === 0) {
          trNo = this.trackingLazy
          orgNm = this.orgNameLazy
          receiveItems = this.receiveItemsLazy
        } else if (this.currentTab === 1) {
          trNo = this.trackingNumber
          orgNm = this.orgNameNumber
          receiveItems = this.receiveItemsNumber
        } else if (this.currentTab === 2) {
          trNo = this.trackingBatch
          orgNm = this.orgNameBatch
          receiveItems = [{UPC: this.UPCBatch, qn: parseInt(this.qtyBatch), prdNm: '', price: 0}]
        }
        // UPC is required!
        if (receiveItems.length === 0) {
          this.message1 = 'UPC is needed! Not a valid receive.'
          this.alertType1 = 'error'
          this.showAlert1 = true
          return
        }
        if (trNo === '') {
          this.message1 = 'Tracking No is needed! Not a valid receive.'
          this.alertType1 = 'error'
          this.showAlert1 = true
          return
        }
        if (orgNm === '') {
          orgNm = 'WMS'
        }
        // Send data to server
        await Inventory.post({
          // tracking No
          'trNo': trNo,
          // OrgName
          'orgNm': orgNm,
          'note': '',
          // receiveItems:
          'rcIts': receiveItems,
          'usrID': this.$store.state.email
        })
        this.message1 = 'Successfully Added a new Package'
        this.alertType1 = 'success'
        this.showAlert1 = true
        if (this.currentTab === 0) {
          this.clearLazy()
        } else if (this.currentTab === 1) {
          this.clearNumber()
        } else if (this.currentTab === 2) {
          this.trackingBatch = ''
          this.currentScanBatch = 'Tracking No'
        }
      } catch (error) {
        if (!error.response) {
          // network error
          this.message1 = 'Network Error: Fail to connet to server'
        } else if (error.response.data.error.includes('jwt')) {
          console.log('jwt error')
          this.$store.dispatch('resetUserInfo', true)
          this.$router.push('/login')
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.statusText)
          this.message1 = error.response.data.error
        }
        this.alertType1 = 'error'
        this.showAlert1 = true
      }
    },
    confirmDialog () {
      if (this.currentTab === 0) {
        this.orgNameLazy = this.existedOrgNm
        this.trackingLazy = this.existedTracking.data[0].trNo
        this.currentScanLazy = 'UPC'
      } else if (this.currentTab === 1) {
        this.orgNameNumber = this.existedOrgNm
        this.trackingNumber = this.existedTracking.data[0].trNo
        this.currentScanNumber = 'UPC'
      } else {
        this.orgNameBatch = this.existedOrgNm
        this.trackingBatch = this.existedTracking.data[0].trNo
        this.updateReceiveItemsBatch()
        this.submit()
      }
      this.trackingExisted = false
      this.existedOrgNm = ''
    },
    cancelDialog () {
      if (this.currentTab === 0) {
        this.trackingLazy = ''
        this.currentScanLazy = 'Tracking No'
      } else if (this.currentTab === 1) {
        this.trackingNumber = ''
        this.currentScanNumber = 'Tracking No'
      } else {
        this.trackingBatch = ''
        this.currentScanBatch = 'Tracking No'
      }
      this.trackingExisted = false
    },
    setupMedia () {
      let constraints = { audio: false, video: true }
      if (navigator.mediaDevices === undefined) {
        console.log('navigator.mediaDevices undefined')
        navigator.mediaDevices = {}
      }
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
          let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia
          if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
          }
          return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject)
          })
        }
      }
      this.testMediaAccess(constraints)
    },
    loadCameras () {
      navigator.mediaDevices
        .enumerateDevices()
        .then(
          deviceInfos => {
            for (var i = 0; i !== deviceInfos.length; ++i) {
              var deviceInfo = deviceInfos[i]
              if (deviceInfo.kind === 'videoinput') {
                this.cameras.push(deviceInfo)
                this.cameraLabels.push(deviceInfo.label.slice(0, 10))
              }
            }
          }
        )
        .then(
          () => {
            if (this.cameras.length > 0) {
              if (this.cameras.length === 1) {
                this.cam1NotFound = false
              } else {
                this.cam1NotFound = false
                this.cam2NotFound = false
              }
            }
          }
        )
        .catch(error => this.$emit('notsupported', error))
    },
    // Stop the video
    stop () {
      if (this.$refs.video !== null && this.$refs.video.srcObject) {
        this.stopStreamedVideo(this.$refs.video)
      }
    },
    testMediaAccess (constraints) {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          this.loadCameras()
        })
        .catch(function (err) { console.log(err.name + ': ' + err.message) })
    },
    startCamera1 () {
      this.deviceId1 = this.cameras[this.camera1Selected].deviceId
      navigator.mediaDevices
        .getUserMedia({
          video: { deviceId: { exact: this.deviceId1 } }
        })
        .then(stream => {
          this.$refs.video1.srcObject = stream
          this.$refs.video1.play()
        })
        .catch(error => console.log(error))
    },
    startCamera2 () {
      this.deviceId2 = this.cameras[this.camera2Selected].deviceId
      navigator.mediaDevices
        .getUserMedia({
          video: { deviceId: { exact: this.deviceId2 } }
        })
        .then(stream => {
          this.$refs.video2.srcObject = stream
          this.$refs.video2.play()
        })
        .catch(error => console.log(error))
    },
    stopCamera1 () {
      if (this.$refs.video1 !== null && this.$refs.video1.srcObject) {
        let tracks = this.$refs.video1.srcObject.getVideoTracks()
        tracks.forEach(track => {
          // stops the video track
          track.stop()
          this.$refs.video1.srcObject = null
          this.source1 = null
        })
      }
    },
    stopCamera2 () {
      if (this.$refs.video2 !== null && this.$refs.video2.srcObject) {
        let tracks = this.$refs.video2.srcObject.getVideoTracks()
        tracks.forEach(track => {
          // stops the video track
          track.stop()
          this.$refs.video2.srcObject = null
          this.source2 = null
        })
      }
    },
    changeCamera1 (cameraSelected) {
      if (!this.cam1NotFound) {
        // stop first
        this.stopCamera1()
        // get the index of selected camera
        this.camera1Selected = this.cameraLabels.indexOf(cameraSelected)
        // start it on Camera1
        this.startCamera1()
      }
    },
    changeCamera2 (cameraSelected) {
      if (!this.cam2NotFound) {
        // stop first
        this.stopCamera2()
        // get the index of selected camera
        this.camera2Selected = this.cameraLabels.indexOf(cameraSelected)
        // start it on Camera1
        this.startCamera2()
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
  },
  mounted () {
    this.setupMedia()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #video {
    background-color: #000000;
  }
  #canvas {
    display: none;
  }
</style>
