<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-container>
      <v-layout align-start justify-center>
        <v-flex lg6 xs12 ma-4>
          <panel title = "Scan Package">
            <v-alert
            v-show = showAlert
            :type = alertType>
              {{message}}
            </v-alert>
            <v-text-field
              label="Tracking Number"
              v-model="trackingNumber"
              ref='tracking'
              v-bind:autofocus= "true"
              v-on:keydown.enter="changeFocusToOrgName()"></v-text-field>
            <v-text-field
              label="Organization Name"
              ref="orgName"
              v-model="orgName"
              v-on:keydown.enter="changeFocusToUPC(0)"></v-text-field>
            <v-layout v-for = "(receiveItem, i) in receiveItems" :key = "i">
              <v-flex >
                <v-text-field
                  label="UPC"
                  ref="UPC"
                  v-model="receiveItem.UPC"
                  v-on:keydown.enter="handleUPCInput(i)"
                  required
                  ></v-text-field>
              </v-flex>
              <v-flex offset-lg2>
                <v-text-field
                  label = "Quantity"
                  ref="Quantity"
                  :rules="[rules.qnRule1, rules.qnRule2]"
                  v-model.number="receiveItem.qn"
                  v-on:keydown.enter="addNewReceiveItem(i)"
                  type="number"
                  ></v-text-field>
              </v-flex>
            </v-layout >
            <v-btn dark class="cyan darken-2" @click.prevent="submit()">Submit</v-btn>
          </panel>
        </v-flex>
        <v-layout align-center justify-center column>
        <v-flex >
          <h2>Camera 1</h2>
          <div>
            <video ref="video1" id="video" width="100%" height="300" 
              :src="source1" autoplay>
              Video stream not available.</video>
            <canvas ref="canvas1" id="canvas" width="480" height="320"></canvas>
          </div>
          <v-layout>
          <v-btn v-on:click= "startCamera1"
            :disabled=cam1NotFound>Turn on</v-btn>
          <v-btn v-on:click= "stopCamera1"
            :disabled=cam1NotFound>Turn off</v-btn>
          </v-layout>
        </v-flex>
        <v-flex ma-4>
          <h2>Camera 2</h2>
          <div>
          <video ref="video2" id="video" width="100%" height="300" 
              :src="source2" autoplay>
              Video stream not available.</video>
          <canvas ref="canvas2" id="canvas" width="480" height="320"></canvas>
          </div>
          <v-layout>
          <v-btn v-on:click= "startCamera2"
            :disabled=cam2NotFound>Turn on</v-btn>
          <v-btn v-on:click= "stopCamera2"
            :disabled=cam2NotFound>Turn off</v-btn>
          </v-layout>
       </v-flex>
        </v-layout>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Inventory from '@/services/inventory'
export default {
  data () {
    return {
      qnvalid: false,
      rules: {
        qnRule1: val => val < 1000000 || 'Not a valid number',
        qnRule2: val => val >= 0 || 'Not a valid number'
      },
      trackingNumber: '', // tracking Number
      orgName: '', // orgName
      receiveItems: [// receiveItems
        { UPC: '', qn: 0, prodNm: '', price: 0 }
      ],
      result: '',
      alertType: 'success',
      showAlert: false,
      message: '',
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
    changeFocusToTracking () {
      this.$refs.tracking.focus()
    },
    changeFocusToOrgName () {
      this.showAlert = false
      this.$refs.orgName.focus()
    },
    changeFocusToUPC (i) {
      console.log('This function called')
      this.$refs.UPC[i].focus()
    },
    changeFocusToQuantity (i) {
      this.$refs.Quantity[i].focus()
    },
    addNewReceiveItem (i) {
      if (i === (this.receiveItems.length - 1)) {
        // Add a line only if reach to the buttom of the lines
        this.receiveItems.push({ UPC: '', qn: 0, prodNm: '', price: 0 })
      }
      this.$nextTick(() => {
        this.$refs.UPC[i + 1].focus()
      })
    },
    async submit () {
      try {
        // need to delete empty lines in receiveItems
        for (var i = this.receiveItems.length - 1; i >= 0; i--) {
          if ((this.receiveItems[i].UPC === '') || (this.receiveItems[i].UPC === 'WMS-RECEIVING-SUBMIT')) {
            this.receiveItems.splice(i, 1)
          }
        }
        // Send data to server
        const response = await Inventory.post({
          // tracking No
          'trNo': this.trackingNumber,
          // OrgName
          'ogNm': this.orgName,
          // receiveItems:
          'rcIts': this.receiveItems,
          'usEm': this.$store.email
        })
        console.log(response.data.ok)
        this.message = 'Successfully Added a new Package'
        this.result = response.data.ok
        this.alertType = 'success'
        this.showAlert = true
        // clean up data
        this.trackingNumber = ''
        this.orgName = ''
        this.receiveItems = [{ UPC: '', qn: 0, prodNm: '', price: 0 }]
        this.changeFocusToTracking()
      } catch (error) {
        this.message = error
        console.log(error)
        this.result = 0
        this.alertType = 'error'
        this.showAlert = true
      }
    },
    handleUPCInput (i) {
      if (this.receiveItems[i].UPC === 'WMS-RECEIVING-SUBMIT') {
        // submit current input
        console.log('Calling to wrote pass data to server')
        // some code to pass data to server
        this.submit()
      } else {
        let idx = -1
        for (let j = 0; j <= this.receiveItems.length - 1; j++) {
          if ((this.receiveItems[j].UPC === this.receiveItems[i].UPC) && (i !== j)) {
            idx = j
          }
        }
        if (idx === -1) {
          this.changeFocusToQuantity(i)
        } else {
          this.receiveItems[idx].qn++
          this.receiveItems[i].UPC = ''
        }
      }
    },
    //Cameras related code
    legacyGetUserMediaSupport() {
      return constraints => {
        // First get ahold of the legacy getUserMedia, if present
        let getUserMedia =
          navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia ||
          navigator.msGetUserMedia ||
          navigator.oGetUserMedia;
        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!getUserMedia) {
          return Promise.reject(
            new Error('getUserMedia is not implemented in this browser')
          );
        }
        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function(resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    },
    setupMedia() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.testMediaAccess();
      }
    },
    loadCameras() {
      navigator.mediaDevices
      .enumerateDevices()
      .then(
        deviceInfos => {
          for (var i = 0; i !== deviceInfos.length; ++i) {
            var deviceInfo = deviceInfos[i];
            if (deviceInfo.kind === 'videoinput') {
              this.cameras.push(deviceInfo);
            }
          }
        },
      )
      .then(
        () => {
          console.log(this.cameras.length)
          if (this.cameras.length == 1) {
            this.cam1NotFound = false
          }
          if (this.cameras.length == 2) {
            this.cam1NotFound = false
            this.cam2NotFound = false
          }
        }
      )
      .catch(error => this.$emit('notsupported', error));
    },
    /**
     * load the stream to the
     */
    // Stop the video
    stop() {
      if(this.$refs.video !== null && this.$refs.video.srcObject) {
        this.stopStreamedVideo(this.$refs.video);
      }
    },
    /**
     * test access
     */
    testMediaAccess() {
      navigator.mediaDevices
        .getUserMedia({video: true})
        .then(stream => this.loadCameras())
        .catch(error => this.$emit('error', error));
    },
    startCamera1 () {
      console.log("initCamera1")
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
        .catch(error => this.$emit('error', error));
    },
    startCamera2 () {
      console.log("initCamera2")
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
        .catch(error => this.$emit('error', error));
    },
    stopCamera1 () {
      if(this.$refs.video1 !== null && this.$refs.video1.srcObject) {
        let tracks = this.$refs.video1.srcObject.getVideoTracks()
        tracks.forEach(track => {
        // stops the video track
        track.stop();
        this.$refs.video1.srcObject = null;
        this.source1 = null;
      });
      }
    },
    stopCamera2 () {
      if(this.$refs.video2 !== null && this.$refs.video2.srcObject) {
        let tracks = this.$refs.video2.srcObject.getVideoTracks()
        tracks.forEach(track => {
        // stops the video track
        track.stop();
        this.$refs.video2.srcObject = null;
        this.source2 = null;
      });
      }
    }
  },
  mounted() {
    this.setupMedia()
  },
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
