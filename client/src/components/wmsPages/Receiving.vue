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
          <v-tab-item>
            <v-alert
            v-show = showAlert1
            :type = alertType1
            outline>
              {{message1}}
            </v-alert>
            <v-text-field
              label="Organization Name"
              ref="orgNameLazy"
              v-model="orgNameLazy"
              v-bind:autofocus= "true"
              v-on:keydown.enter="changeFocusToTrackingLazy()"></v-text-field>
            <v-text-field
              label="Tracking Number"
              v-model="trackingLazy"
              ref='trackingLazy'
              v-on:keydown.enter="checkTrackingLazy()"></v-text-field>
            <v-text-field
              label="UPC"
              ref='UPCLazyRef'
              v-bind:value="UPCLazy"
              v-on:keydown.enter="handleUPCLazy">
            </v-text-field>
            <v-layout v-for = "(item, i) in receiveItems"
              v-bind:item="item"
              :key = i>
                <li>{{item.UPC}}</li>
                <li>{{item.qn}}</li>
            </v-layout>
          <v-btn dark class="cyan darken-2" @click.prevent="submitLazy()">Submit</v-btn>
          <v-btn dark class="cyan darken-2" @click.prevent="clearLazy()">clear</v-btn>
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
      orgNameLazy: '',
      trackingLazy: '',
      UPCLazy: '',
      qtyLazy: '',
      receiveItems: [],
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
    changeFocusToTrackingLazy () {
      this.clearAlert()
      this.$refs.trackingLazy.focus()
    },
    changeFocusToUPCLazy () {
      this.$refs.UPCLazyRef.focus()
    },
    async checkTrackingLazy () {
      this.currentTab = 1
      await this.checkTrackingExisted(this.trackingLazy)
      this.changeFocusToUPCLazy()
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
    handleUPCLazy (event) {
      let found = false
      this.UPCLazy = event.target.value
      for (let i = 0; i < this.receiveItems.length; i++) {
        if (this.UPCLazy === this.receiveItems[i].UPC) {
          // this.$set( receiveItems, i, {'qn' : (receiveItems[i].qn + 1)} )
          this.receiveItems[i].qn++
          found = true
          break
        }
      }
      if (!found) {
        this.receiveItems.push({ UPC: this.UPCLazy, qn: 1, prdNm: '', price: 0 })
      }
      this.UPCLazy = ''
      this.forceUpdate()
    },
    submitLazy () {
      console.log('Org Name:' + this.orgNameLazy)
      console.log('tracking :' + this.trackingLazy)
      console.log('Received Items: ' + this.receiveItems[0].UPC + this.receiveItems[0].qn)
      // to do... call the database
    },
    clearLazy () {
      this.orgNameLazy = ''
      this.trackingLazy = ''
      this.UPCLazy = ''
      this.qtyLazy = ''
      this.receiveItems = []
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
        this.orgNameLazy = this.existedOrgNm
        this.trackingExisted = false
        this.changeFocusToUPCLazy()
      } else if (this.currentTab === 2) {
        // to do ...
      } else {
        // to do ...
      }
      this.existedOrgNm = ''
    },
    cancelDialog () {
      if (this.currentTab === 1) {
        this.trackingLazy = ''
      } else if (this.currentTab === 2) {
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
