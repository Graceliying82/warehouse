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
                  v-model="receiveItem.qn"
                  v-on:keydown.enter="addNewReceiveItem(i)"
                  type="number"
                  ></v-text-field>
              </v-flex>
            </v-layout >
            <v-btn dark class="cyan darken-2">Submit</v-btn>
          </panel>
        </v-flex>
        <v-layout align-center justify-center column>
        <v-flex >
          <h2>Camera 1</h2>
          <div>
            <video video ref="video" id="video" width="480" height="300" autoplay>
              Video stream not available.</video>
            <canvas ref="canvas" id="canvas" width="480" height="320"></canvas>
          </div>
          <v-btn v-on:click= "initCamera">Turn on Camera</v-btn>
        </v-flex>
        <v-flex ma-4>
          <h2>Camera 2</h2>
          <div>
          <video video ref="video" id="video" width="480" height="300" autoplay>
              Video stream not available.</video>
          <canvas ref="canvas" id="canvas" width="480" height="320"></canvas>
          </div>
          <v-btn v-on:click= "initCamera">Turn on Camera</v-btn>
       </v-flex>
        </v-layout>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Receive from '@/services/Receive'
export default {
  data () {
    return {
      trackingNumber: '', // tracking Number
      orgName: '', // orgName
      receiveItems: [// receiveItems
        { UPC: '', qn: undefined }
      ],
      result: '',
      alertType: 'success',
      showAlert: false,
      message: '',
      // camera related codes
      video: {},
      canvas: {}
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
        this.receiveItems.push({ UPC: '', qn: undefined })
      }
      this.$nextTick(() => {
        this.$refs.UPC[i + 1].focus()
      })
    },
    async receive () {
      try {
        // need to delete empty lines in receiveItems
        for (var i = this.receiveItems.length - 1; i >= 0; i--) {
          if ((this.receiveItems[i].UPC === '') || (this.receiveItems[i].UPC === 'WMS-RECEIVING-SUBMIT')) {
            this.receiveItems.splice(i, 1)
          }
        }
        // Send data to server
        const response = await Receive.receive({
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
      } catch (error) {
        this.message = error.response.data.error
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
        this.receive()
        // clean up data
        this.trackingNumber = ''
        this.orgName = ''
        this.receiveItems = [{ UPC: '', qn: undefined }]
        this.changeFocusToTracking()
      } else {
        this.changeFocusToQuantity(i)
      }
    },
    initCamera () {
      console.log('initCamera called')
      console.log('navigator.mediaDevices : ' + navigator.mediaDevices)
      console.log('navigator.mediaDevices.getUserMedia : ' + navigator.mediaDevices.getUserMedia)
      this.video = this.$refs.video
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
          console.log('in then')
          this.video.src = window.URL.createObjectURL(stream)
          this.video.play()
        })
      }
    }
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
