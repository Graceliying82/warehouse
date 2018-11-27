<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-layout row>
      <panel title = "Scan Package">
        <v-tabs
          color = "cyan"
          dark
          slider-color = "cyan darken-4">
          <v-tab ripple>
            Lazy Mode
          </v-tab>
          <v-tab ripple>
            Number Mode
          </v-tab>
          <v-tab-item>
            <v-alert
            v-show = showAlert1
            :type = alertType1>
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
              v-on:keydown.enter="changeFocusToUPC1(0)"></v-text-field>
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
          :type = alertType2>
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
            v-on:keydown.enter="changeFocusToUPC2(0)"></v-text-field>
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
        </v-tabs>
      </panel>
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
            <v-btn fab dark small 
              v-on:click= "startCamera1"
              :disabled=cam1NotFound
              color="cyan darken-2">
              <v-icon dark>videocam</v-icon>
            </v-btn>
            <v-btn fab dark small 
              v-on:click= "stopCamera1"
              :disabled=cam1NotFound
              color="cyan darken-2">
              <v-icon dark>videocam_off</v-icon>
            </v-btn>
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
          </v-flex>
        </v-layout>
      </v-layout>
    </v-layout>
  </div>
</template>

<script>
import Inventory from '@/services/inventory'
export default {
  data () {
    return {
      currentDate: new Date().toISOString().substr(0, 10),
      rules: {
        qnRule1: val => val < 1000000 || 'Not a valid number',
        qnRule2: val => val >= 0 || 'Not a valid number'
      },
      trackingNumber1: '', // tracking Number
      trackingNumber2: '', // tracking Number
      orgName1: '', // orgName
      orgName2: '', // orgName
      receiveItems1: [// receiveItems
        { UPC: '', qn: 0, prodNm: '', price: 0, note: '' }
      ],
      receiveItems2: [// receiveItems
        { UPC: '', qn: 0, prodNm: '', price: 0, note: '' }
      ],
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
    changeFocusToTracking1 () {
      this.showAlert1 = false
      this.$refs.tracking1.focus()
    },
    changeFocusToTracking2 () {
      this.showAlert2 = false
      this.$refs.tracking2.focus()
    },
    changeFocusToUPC1 (i) {
      this.$refs.UPC1[i].focus()
    },
    changeFocusToUPC2 (i) {
      this.$refs.UPC2[i].focus()
    },
    changeFocusToQuantity (i) {
      this.$refs.Quantity1[i].focus()
    },
    changeFocusToQuantity2 (i) {
      this.$refs.Quantity2[i].focus()
    },
    addNewReceiveItem1 (i) {
      if (i === (this.receiveItems1.length - 1)) {
        // Add a line only if reach to the buttom of the lines
        this.receiveItems1.push({ UPC: '', qn: 0, prodNm: '', price: 0, note: '' })
      }
      this.$nextTick(() => {
        this.$refs.UPC1[i + 1].focus()
      })
    },
    addNewReceiveItem2 (i) {
      if (i === (this.receiveItems2.length - 1)) {
        // Add a line only if reach to the buttom of the lines
        this.receiveItems2.push({ UPC: '', qn: 0, prodNm: '', price: 0, note: '' })
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
          this.receiveItems1 = [{ UPC: '', qn: 0, prodNm: '', price: 0, note: '' }]
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
          'ogNm': this.orgName1,
          // receiveItems:
          'rcIts': this.receiveItems1,
          'usEm': this.$store.email
        })
        this.message1 = 'Successfully Added a new Package'
        this.alertType1 = 'success'
        this.showAlert1 = true
        // clean up data
        this.trackingNumber1 = ''
        this.orgName1 = ''
        this.receiveItems1 = [{ UPC: '', qn: 0, prodNm: '', price: 0, note: '' }]
        this.changeFocusToOrgName1()
      } catch (error) {
        this.message1 = error
        console.log(error)
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
          this.receiveItems2 = [{ UPC: '', qn: 0, prodNm: '', price: 0, note: '' }]
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
          'ogNm': this.orgName2,
          // receiveItems:
          'rcIts': this.receiveItems2,
          'usEm': this.$store.email
        })
        this.message2 = 'Successfully Added a new Package'
        this.alertType2 = 'success'
        this.showAlert2 = true
        // clean up data
        this.trackingNumber2 = ''
        this.orgName2 = ''
        this.receiveItems2 = [{ UPC: '', qn: 0, prodNm: '', price: 0, note: '' }]
        this.changeFocusToOrgName2()
      } catch (error) {
        this.message2 = error
        console.log(error)
        this.alertType2 = 'error'
        this.showAlert2 = true
      }
    },
    handleUPCInput1 (i) {
      if (this.receiveItems1[i].UPC === 'WMS-RECEIVING-SUBMIT') {
        // submit current input
        console.log('Calling to wrote pass data to server')
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
            this.receiveItems1.push({ UPC: '', qn: 0, prodNm: '', price: 0, note: '' })
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
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.testMediaAccess()
      }
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
              }
            }
          }
        )
        .then(
          () => {
            console.log(this.cameras.length)
            if (this.cameras.length === 1) {
              this.cam1NotFound = false
            }
            if (this.cameras.length === 2) {
              this.cam1NotFound = false
              this.cam2NotFound = false
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
    testMediaAccess () {
      navigator.mediaDevices
        .getUserMedia({video: true})
        .then(stream => this.loadCameras())
        .catch(error => console.log(error))
    },
    startCamera1 () {
      console.log('initCamera1')
      if (this.cameras === null) {
        console.log('No camera found!')
      } else {
        if (this.cameras[0].deviceId) {
          console.log('Camera 1 deviceId：  ' + this.cameras[0].deviceId)
          this.deviceId1 = this.cameras[0].deviceId
        }
      }
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
      console.log('initCamera2')
      if (this.cameras === null) {
        console.log('No camera found!')
      } else {
        if (this.cameras[1].deviceId) {
          console.log('Camera 2 deviceId：  ' + this.cameras[1].deviceId)
          this.deviceId2 = this.cameras[1].deviceId
        }
      }
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
