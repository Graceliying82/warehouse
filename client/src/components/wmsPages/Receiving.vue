<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-content>
      <v-container grid-list-xl>
        <h1>Please scan barcodes:</h1>
        <v-layout justify-center align-start row>
            <v-flex lg4 xs12>
              <v-text-field
                label="Tracking Number"
                v-model="trackingNumber"
                ref='tracking'
                v-bind:autofocus= "true"
                v-on:keydown.enter="changeFocusToUserID()"></v-text-field>
            </v-flex>
            <v-flex lg2 xs5>
              <v-text-field
                label="User ID"
                ref="userID"
                v-model="userID"
                v-on:keydown.enter="changeFocusToUPC()">
              </v-text-field>
            </v-flex>
        </v-layout>
        <v-layout justify-center align-start row>
            <v-flex lg4 xs12>
              <v-text-field
                label="UPC"
                ref='upc'
                required
                v-model="UPC"
                v-on:keydown.enter="handleUPCInput()"></v-text-field>
            </v-flex>
            <v-flex lg2 xs5>
              <v-text-field
                label="Quantity"
                ref="quantity"
                v-model.number="qn"
                type="number"
                v-on:keydown.enter="nextUPC()"></v-text-field>
            </v-flex>
        </v-layout>
        <v-flex justify-center align-start row>
        <v-btn class="info">Submit</v-btn>
        </v-flex>
        <v-flex mt-5>
          <v-data-table
            :headers="headers"
            :items="ReceivingInfo"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.name }}</td>
              <td class="text-xs-left">{{ props.item.trackingNumber }}</td>
              <td class="text-xs-left">{{ props.item.userID}}</td>
              <td class="text-xs-left">{{ props.item.UPC }}</td>
              <td class="text-xs-left">{{ props.item.qn }}</td>
            </template>
          </v-data-table>
        </v-flex>
      </v-container>
    </v-content>
  </div>
</template>

<script>
export default {
  data () {
    return {
      trackingNumber: '',
      UPC: '',
      qn: undefined,
      userID: '',
      showAlert: false,
      ReceivingInfo: [
      ],
      headers: [
        { text: 'No',
          align: 'left',
          sortable: false,
          value: 'pid' },
        { text: 'Tracking Number', value: 'trackingNumber' },
        { text: 'UserID', value: 'userID' },
        { text: 'UPC', value: 'UPC' },
        { text: 'Quantities', value: 'qn' }
      ]
    }
  },
  methods: {
    submitToTable: function () {
      console.log('Print from submitToTable')
      console.log(this.trackingNumber)
      console.log(this.userID)
      console.log(this.UPC)
      console.log(this.qn)
      this.ReceivingInfo.push({
        value: false,
        name: this.ReceivingInfo.length,
        trackingNumber: this.trackingNumber,
        userID: this.userID,
        UPC: this.UPC,
        qn: this.qn
      })
      console.log(this.ReceivingInfo)
    },
    changeFocusToTracking: function () {
      this.$refs.tracking.focus()
    },
    changeFocusToUPC: function () {
      this.$refs.upc.focus()
    },
    changeFocusToQuantity: function () {
      this.$refs.quantity.focus()
    },
    changeFocusToUserID: function () {
      this.$refs.userID.focus()
    },
    resetQn: function () {
      const input = this.$refs.quantity
      input.lazyValue = undefined
//      input.value = undefined
      input.$emit('input')
    },
    nextUPC: function () {
      this.submitToTable()
      this.UPC = ''
      console.log('this.qn before reset')
      console.log(this.qn)
      this.resetQn()
      console.log('this.qn')
      console.log(this.qn)
      this.changeFocusToUPC()
    },
    handleUPCInput: function () {
      if (this.UPC === 'WMS-RECEIVING-NEXT') {
        // submit current input
        this.trackingNumber = ''
        this.userID = ''
        this.UPC = ''
        this.changeFocusToTracking()
      } else {
        // add another UPC
        this.changeFocusToQuantity()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
