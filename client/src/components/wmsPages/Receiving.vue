<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-layout row>
      <panel title = "Scan Package">
        <v-tabs
          color = "cyan"
          dark
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
          <v-tab-item>
            <v-alert
            v-show = showAlert1
            :type = alertType1
            outline>
              {{message1}}
            </v-alert>
            <v-text-field
              label="Organization Name"
              ref="orgName1"
              v-model="orgName1"
              v-bind:autofocus= "true"
              v-on:keydown.enter="changeFocusToTracking1()"></v-text-field>
            <v-text-field
              label="Tracking Number"
              v-model="trackingNumber1"
              ref='tracking1'
              v-on:keydown.enter="checkTracking1()"></v-text-field>
            <v-layout v-for = "(receiveItem1, i) in receiveItems1" :key = "i">
              <v-flex >
                <v-text-field
                  label="UPC"
                  ref="UPC1"
                  v-model="receiveItem1.UPC"
                  v-on:keydown.enter="handleUPCInput1(i)"
                  required
                  ></v-text-field>
              </v-flex>
              <v-flex offset-lg2>
                <v-text-field
                  label = "Quantity"
                  ref="Quantity1"
                  :rules="[rules.qnRule1, rules.qnRule2]"
                  v-model.number="receiveItem1.qn"
                  v-on:keydown.enter="addNewReceiveItem1(i)"
                  type="number"
                  ></v-text-field>
              </v-flex>
            </v-layout >
          <v-btn dark class="cyan darken-2" @click.prevent="submit1()">Submit</v-btn>
          </v-tab-item>
          <v-tab-item>
          <v-alert
          v-show = showAlert2
          :type = alertType2
          outline>
            {{message2}}
          </v-alert>
          <v-text-field
            label="Organization Name"
            ref="orgName2"
            v-model="orgName2"
            v-bind:autofocus= "true"
            v-on:keydown.enter="changeFocusToTracking2()"></v-text-field>
          <v-text-field
            label="Tracking Number"
            v-model="trackingNumber2"
            ref='tracking2'
            v-on:keydown.enter="checkTracking2()"></v-text-field>
          <v-layout v-for = "(receiveItem2, i) in receiveItems2" :key = "i">
            <v-flex >
              <v-text-field
                label="UPC"
                ref="UPC2"
                v-model="receiveItem2.UPC"
                v-on:keydown.enter="handleUPCInput2(i)"
                required
                ></v-text-field>
            </v-flex>
            <v-flex offset-lg2>
              <v-text-field
                label = "Quantity"
                ref="Quantity2"
                :rules="[rules.qnRule1, rules.qnRule2]"
                v-model.number="receiveItem2.qn"
                v-on:keydown.enter="addNewReceiveItem2(i)"
                type="number"
                ></v-text-field>
            </v-flex>
          </v-layout >
          <v-btn dark class="cyan darken-2" @click.prevent="submit2()">Submit</v-btn>
          </v-tab-item>
          <v-tab-item>
          <v-alert
          v-show = showAlert3
          :type = alertType3
          outline>
            {{message3}}
          </v-alert>
          <v-layout>
            <v-flex >
              <v-text-field
                label="UPC"
                v-model="UPC3"
                ref="UPC3"
                v-bind:autofocus= "true"
                v-on:keydown.enter="changeFocusToQuantity3()"
                required
                ></v-text-field>
            </v-flex>
            <v-flex offset-lg2>
              <v-text-field
                label = "Quantity"
                ref="Quantity3"
                v-model.number="qn3"
                :rules="[rules.qnRule1, rules.qnRule2]"
                v-on:keydown.enter="changeFocusToOrgName3()"
                type="number"
                ></v-text-field>
            </v-flex>
          </v-layout>
          <v-text-field
            label="Org Name"
            ref="orgName3"
            v-model="orgName3"
            v-on:keydown.enter="changeFocusToTracking3()"
          ></v-text-field>
          <v-text-field
            label="Tracking Number"
            ref='tracking3'
            v-model="trackingNumber3"
            v-on:keydown.enter="checkTracking3()"
          ></v-text-field>
          <h3>Batch model will automatically submit after tracking input.</h3>
          <v-btn dark class="cyan darken-2" @click.prevent="clear()">Clear</v-btn>
          </v-tab-item>
        </v-tabs>
      </panel>
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
                <v-btn color="blue darken-1" autofocus flat @click.native="closeDialog">Confirm</v-btn>
                <v-btn color="blue darken-1" flat @click.native="cancelDialog">Cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
      trackingNumber1: '', // tracking Number
      trackingNumber2: '', // tracking Number
      trackingNumber3: '',
      orgName1: '', // orgName
      orgName2: '', // orgName
      orgName3: '',
      UPC3: '',
      qn3: 0,
      receiveItems1: [// receiveItems
        { UPC: '', qn: 0, prdNm: '', price: 0 }
      ],
      receiveItems2: [// receiveItems
        { UPC: '', qn: 0, prdNm: '', price: 0 }
      ],
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
    changeFocusToOrgName1 () {
      this.$refs.orgName1.focus()
    },
    changeFocusToOrgName2 () {
      this.$refs.orgName2.focus()
    },
    changeFocusToOrgName3 () {
      this.$refs.orgName3.focus()
    },
    changeFocusToTracking1 () {
      this.showAlert1 = false
      this.$refs.tracking1.focus()
    },
    changeFocusToTracking2 () {
      this.showAlert2 = false
      this.$refs.tracking2.focus()
    },
    changeFocusToTracking3 () {
      this.$refs.tracking3.focus()
    },
    changeFocusToUPC1 (i) {
      this.$refs.UPC1[i].focus()
    },
    checkTracking1 () {
      this.currentTab = 1
      this.checkTrackingExisted(this.trackingNumber1)
      this.changeFocusToUPC1(0)
    },
    changeFocusToUPC2 (i) {
      this.$refs.UPC2[i].focus()
    },
    checkTracking2 () {
      this.currentTab = 2
      this.checkTrackingExisted(this.trackingNumber2)
      this.changeFocusToUPC2(0)
    },
    changeFocusToUPC3 () {
      this.showAlert3 = false
      this.$refs.UPC3.focus()
    },
    async checkTracking3 () {
      this.currentTab = 3
      await this.checkTrackingExisted(this.trackingNumber3)
      if (!this.trackingExisted) {
        this.submit3()
      }
    },
    changeFocusToQuantity (i) {
      this.$refs.Quantity1[i].focus()
    },
    changeFocusToQuantity2 (i) {
      this.$refs.Quantity2[i].focus()
    },
    changeFocusToQuantity3 () {
      this.showAlert3 = false
      this.$refs.Quantity3.focus()
    },
    addNewReceiveItem1 (i) {
      if (i === (this.receiveItems1.length - 1)) {
        // Add a line only if reach to the buttom of the lines
        this.receiveItems1.push({ UPC: '', qn: 0, prdNm: '', price: 0 })
      }
      this.$nextTick(() => {
        this.$refs.UPC1[i + 1].focus()
      })
    },
    addNewReceiveItem2 (i) {
      if (i === (this.receiveItems2.length - 1)) {
        // Add a line only if reach to the buttom of the lines
        this.receiveItems2.push({ UPC: '', qn: 0, prdNm: '', price: 0 })
      }
      this.$nextTick(() => {
        this.$refs.UPC2[i + 1].focus()
      })
    },
    async submit1 () {
      try {
        // need to delete empty lines in receiveItems
        for (var i = this.receiveItems1.length - 1; i >= 0; i--) {
          if ((this.receiveItems1[i].UPC === '') || (this.receiveItems1[i].UPC === 'WMS-RECEIVING-SUBMIT')) {
            this.receiveItems1.splice(i, 1)
          }
        }
        if (this.receiveItems1.length === 0) {
          this.receiveItems1 = [{ UPC: '', qn: 0, prdNm: '', price: 0 }]
          this.message1 = 'UPC is needed! Not a valid receive.'
          this.alertType1 = 'error'
          this.showAlert1 = true
          return
        }
        // Send data to server
        await Inventory.post({
          // tracking No
          'trNo': this.trackingNumber1,
          // OrgName
          'orgNm': this.orgName1,
          'note': '',
          // receiveItems:
          'rcIts': this.receiveItems1,
          'usrID': this.$store.state.email
        })
        this.message1 = 'Successfully Added a new Package'
        this.alertType1 = 'success'
        this.showAlert1 = true
        // clean up data
        this.trackingNumber1 = ''
        this.orgName1 = ''
        this.receiveItems1 = [{ UPC: '', qn: 0, prdNm: '', price: 0 }]
        this.changeFocusToOrgName1()
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
    async submit2 () {
      try {
        // need to delete empty lines in receiveItems
        for (var i = this.receiveItems2.length - 1; i >= 0; i--) {
          if ((this.receiveItems2[i].UPC === '') || (this.receiveItems2[i].UPC === 'WMS-RECEIVING-SUBMIT')) {
            this.receiveItems2.splice(i, 1)
          }
        }
        if (this.receiveItems2.length === 0) {
          this.receiveItems2 = [{ UPC: '', qn: 0, prdNm: '', price: 0 }]
          this.message2 = 'UPC is needed! Not a valid receive.'
          this.alertType2 = 'error'
          this.showAlert2 = true
          return
        }
        // Send data to server
        await Inventory.post({

          // tracking No
          'trNo': this.trackingNumber2,
          // OrgName
          'orgNm': this.orgName2,
          'note': '',
          // receiveItems:
          'rcIts': this.receiveItems2,
          'usrID': this.$store.state.email
        })
        this.message2 = 'Successfully Added a new Package'
        this.alertType2 = 'success'
        this.showAlert2 = true
        // clean up data
        this.trackingNumber2 = ''
        this.orgName2 = ''
        this.receiveItems2 = [{ UPC: '', qn: 0, prdNm: '', price: 0 }]
        this.changeFocusToOrgName2()
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
    async submit3 () {
      try {
        if (this.UPC3 === '') {
          this.message3 = 'UPC is needed! Not a valid receive.'
          this.alertType3 = 'error'
          this.showAlert3 = true
          return
        }
        // Send data to server
        await Inventory.post({
          // tracking No
          'trNo': this.trackingNumber3,
          // OrgName
          'orgNm': this.orgName3,
          'note': '',
          // receiveItems:
          'rcIts': [{ UPC: this.UPC3, qn: this.qn3, prdNm: '', price: 0 }],
          'usrID': this.$store.state.email
        })
        this.message3 = 'Successfully Added a new Package: ' + this.trackingNumber3
        this.alertType3 = 'success'
        this.showAlert3 = true
        // clean up data
        this.trackingNumber3 = ''
        this.changeFocusToTracking3()
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
        this.alertType3 = 'error'
        this.showAlert3 = true
      }
    },
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
    clear () {
      this.showAlert3 = false
      this.UPC3 = ''
      this.qn3 = 0
      this.orgName3 = ''
      this.trackingNumber3 = ''
    },
    handleUPCInput1 (i) {
      if (this.receiveItems1[i].UPC === 'WMS-RECEIVING-SUBMIT') {
        // some code to pass data to server
        this.submit1()
      } else {
        let idx = -1
        for (let j = 0; j <= this.receiveItems1.length - 1; j++) {
          if ((this.receiveItems1[j].UPC === this.receiveItems1[i].UPC) && (i !== j)) {
            idx = j
          }
        }
        if (idx === -1) {
          this.receiveItems1[i].qn = 1
          if (i === (this.receiveItems1.length - 1)) {
            // Add a line only if reach to the buttom of the lines
            this.receiveItems1.push({ UPC: '', qn: 0, prdNm: '', price: 0 })
          }
          this.$nextTick(() => {
            this.$refs.UPC1[i + 1].focus()
          })
        } else {
          this.receiveItems1[idx].qn++
          this.receiveItems1[i].UPC = ''
        }
      }
    },
    handleUPCInput2 (i) {
      if (this.receiveItems2[i].UPC === 'WMS-RECEIVING-SUBMIT') {
        // some code to pass data to server
        this.submit2()
      } else {
        let idx = -1
        // If this UPC has already been scanned. Just add up the quantity. Otherwise Change focus to qn and make
        // user input
        for (let j = 0; j <= this.receiveItems2.length - 1; j++) {
          if ((this.receiveItems2[j].UPC === this.receiveItems2[i].UPC) && (i !== j)) {
            idx = j
          }
        }
        if (idx === -1) {
          this.changeFocusToQuantity2(i)
        } else {
          this.receiveItems2[idx].qn++
          this.receiveItems2[i].UPC = ''
        }
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
    closeDialog () {
      if (this.currentTab === 1) {
        this.orgName1 = this.existedOrgNm
        this.trackingExisted = false
        this.changeFocusToUPC1(0)
      } else if (this.currentTab === 2) {
        this.orgName2 = this.existedOrgNm
        this.trackingExisted = false
        this.changeFocusToUPC2(0)
      } else {
        this.orgName3 = this.existedOrgNm
        this.submit3()
        this.trackingExisted = false
      }
      this.existedOrgNm = ''
    },
    cancelDialog () {
      if (this.currentTab === 1) {
        this.trackingNumber1 = ''
      } else if (this.currentTab === 2) {
        this.trackingNumber2 = ''
      } else {
        this.trackingNumber3 = ''
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
      // stop first
      this.stopCamera1()
      // get the index of selected camera
      this.camera1Selected = this.cameraLabels.indexOf(cameraSelected)
      // start it on Camera1
      this.startCamera1()
    },
    changeCamera2 (cameraSelected) {
      // stop first
      this.stopCamera2()
      // get the index of selected camera
      this.camera2Selected = this.cameraLabels.indexOf(cameraSelected)
      // start it on Camera1
      this.startCamera2()
    }
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
