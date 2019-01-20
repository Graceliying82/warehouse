<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-layout row>
      <v-layout column lg6>
        <v-layout>
          <v-flex lg6>
            <v-tabs
              color = "cyan"
              dark
              slider-color = "cyan darken-4">
              <v-tab ripple>
                Lazy
              </v-tab>
              <v-tab-item>
                <v-alert
                v-show = showAlert1
                :type = alertType1
                outline>
                  {{message1}}
                </v-alert>
                <h3>Please Scan</h3>
                <h2 style="color:red;">{{currentScanLazy}}</h2>
                <br>
                <h3 align='left'>OrgName: {{orgNameLazy}}</h3>
                <h3 align='left'>Tracking: {{trackingLazy}}</h3>
                <v-layout>
                  <v-data-table
                  :headers="lazyHeaders"
                  :items="receiveItemsLazy"
                  :rows-per-page-items="rowsPerPageItems"
                  class="elevation-1">
                    <template v-for = "it in receiveItemsLazy" slot="items" slot-scope="props">
                      <td
                        :key="it.UPC + '-UPC'"
                        class="text-xs-left">{{ props.item.UPC }}</td>
                      <td
                        :key="it.qn + '-qn'"
                        class="text-xs-left">
                        {{ props.item.qn }}
                      </td>
                    </template>
                  </v-data-table>
                </v-layout>
                <br>
                <br>
              <v-btn dark @click.prevent="submitLazy()">Submit</v-btn>
              <v-btn dark @click.prevent="clearLazy()">Reset</v-btn>
              </v-tab-item>
            </v-tabs>
            <v-card >
              <v-card-title primary-title >
                <div>
                  <div class="headline" >Manual Input</div>
                </div>
              </v-card-title>
              <v-layout>
                <v-text-field
                  label="Organization Name"
                  ref="orgNameMan"
                  id="orgNameMan"
                  clearable
                  ></v-text-field>
                <v-btn @click.prevent=setValueOrgMan>Change</v-btn>
              </v-layout>
              <v-layout row>
                <v-text-field
                  label="Tracking Number"
                  ref='trackingMan'
                  id='trackingMan'
                  clearable
                  ></v-text-field>
                <v-btn @click.prevent=setValueTrMan>Change</v-btn>
              </v-layout>
              <v-layout row>
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
                  <v-flex xs12 sm6 md4>
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
import Inventory from '@/services/Inventory'
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
      // Data for batch mode
      existedTracking: [],
      trackingExisted: false,
      existedOrgNm: '',
      currentTab: 0,
      alertType1: 'success',
      showAlert1: false,
      alertType2: 'success',
      showAlert2: false,
      alertType3: 'success',
      showAlert3: false,
      message1: '',
      message2: '',
      message3: '',
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
      cam2NotFound: true
    }
  },
  methods: {
    clearAlert () {
      this.showAlert1 = false
      this.showAlert2 = false
      this.showAlert3 = false
      this.message1 = ''
      this.message2 = ''
      this.message3 = ''
    },
    clearLazy () {
      this.orgNameLazy = ''
      this.trackingLazy = ''
      this.UPCLazy = ''
      this.currentScanLazy = 'Organization Name'
      this.receiveItemsLazy = []
    },
    cleanup () {
      this.clearAlert()
      this.clearLazy()
    },
    // async checkTrackingLazy () {
    //   this.currentTab = 0
    //   await this.checkTrackingExisted(this.trackingLazy)
    //   this.changeFocusToUPCLazy()
    // },
    async checkTrackingExisted (tracking) {
      try {
        this.existedTracking = await Inventory.checkTrackingExisted(tracking)
        if (this.existedTracking.data[0] !== undefined) {
          this.trackingExisted = true
          this.existedOrgNm = this.existedTracking.data[0].orgNm
        }
      } catch (error) {
        if (!error.response) {
          // network error
          this.message3 = 'Network Error: Fail to connet to server'
        } else if (error.response.data.error.includes('jwt')) {
          console.log('jwt error')
          this.$store.dispatch('resetUserInfo', true)
          this.$router.push('/login')
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.statusText)
          this.message3 = error.response.data.error
        }
      }
    },
    handleUPC (receiveItems, upc, qn) {
      console.log('call handleUPCLazy')
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
      console.log('in onBarcodeScanned')
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
            await this.checkTrackingExisted(barcode)
            this.trackingLazy = barcode
            this.currentScanLazy = 'UPC'
          } else if (this.currentScanLazy === 'UPC') {
            this.handleUPC(this.receiveItemsLazy, barcode, 1)
          }
        } else if (this.currentTab === 1) {
        // to do ...
        } else if (this.currentTab === 2) {
        // to do ...
        }
      }
    },
    setValueOrgMan () {
      if (this.currentTab === 0) {
        // Lazy Mode
        this.orgNameLazy = document.getElementById('orgNameMan').value
        this.currentScanLazy = 'Tracking No'
      } else if (this.currentTab === 1) {
      // to do ...
      } else if (this.currentTab === 2) {
      // to do ...
      }
    },
    async setValueTrMan () {
      if (this.currentTab === 0) {
        // Lazy Mode
        await this.checkTrackingExisted(document.getElementById('trackingMan').value)
        this.trackingLazy = document.getElementById('trackingMan').value
        this.currentScanLazy = 'UPC'
      } else if (this.currentTab === 1) {
      // to do ...
      } else if (this.currentTab === 2) {
      // to do ...
      }
    },
    addUPCMan () {
      if (this.currentTab === 0) {
        // Lazy Mode
        this.handleUPC(this.receiveItemsLazy, document.getElementById('UPCMan').value, 1)
      } else if (this.currentTab === 1) {
      // to do ...
      } else if (this.currentTab === 2) {
      // to do ...
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
        // to do ...
        } else if (this.currentTab === 2) {
        // to do ...
        }
        // UPC is required!
        if (receiveItems.length === 0) {
          this.message1 = 'UPC is needed! Not a valid receive.'
          this.alertType1 = 'error'
          this.showAlert1 = true
          return
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
        this.clearLazy()
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
    confirmDialog () {
      if (this.currentTab === 0) {
        this.orgNameLazy = this.existedOrgNm
        this.trackingExisted = false
      } else if (this.currentTab === 1) {
        // to do ...
      } else {
        // to do ...
      }
      this.existedOrgNm = ''
    },
    cancelDialog () {
      if (this.currentTab === 0) {
        this.trackingLazy = ''
        this.currentScanLazy = 'Tracking No'
      } else if (this.currentTab === 1) {
        // to do ...
      } else {
        // to do ...
      }
      this.trackingExisted = false
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
    }
  },
  mounted () {
    this.setupMedia()
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
  #video {
    background-color: #000000;
  }
  #canvas {
    display: none;
  }
</style>
