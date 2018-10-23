<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-content>
      <v-container grid-list-xl>
        <h1>Please scan barcodes:</h1>
        <v-layout justify-center align-start row>
            <v-flex lg6 xs12>
              <v-text-field
                label="Tracking Number"
                v-model="trackingNumber"
                ref='tracking' 
                autofocus= true
                v-on:keydown="ChangeFocus()"></v-text-field>
            </v-flex>
        </v-layout>
        <v-layout justify-center align-start row>
            <v-flex lg4 xs12>
              <v-text-field
                label="UPC"
                required
                v-model="UPC"></v-text-field>
            </v-flex>
            <v-flex lg2 xs5>
              <v-text-field
                type=number
                label="Quantity"
                v-bind:value=qn
                v-model="qn"></v-text-field>
            </v-flex>
        </v-layout>
        <v-layout justify-center align-start row>
            <v-flex lg4 xs12>
              <v-text-field
                label="User/Org name"
                hint="Default wms"
                value="WMS"
                persistent-hint
                v-model="userName">
              </v-text-field>
            </v-flex>
            <v-flex lg2 xs5>
              <v-text-field
                label="WmsPID"
                v-model="pid"></v-text-field>
            </v-flex>
        </v-layout>
        <v-flex justify-center align-start row>
        <v-btn class="info" type="submit" v-on:click="addOneRecord()">Next</v-btn>
        <v-btn class="info">Submit</v-btn>
        </v-flex>
        <v-flex justify-center>
          <v-alert v-bind:value="showAlert" type="error" outline>"UPC can't be empty"</v-alert>
        </v-flex>
        <v-flex mt-5>
          <v-data-table
            :headers="headers"
            :items="ReceivingInfo"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.name }}</td>
              <td class="text-xs-right">{{ props.item.trackingNumber }}</td>
              <td class="text-xs-right">{{ props.item.UPC }}</td>
              <td class="text-xs-right">{{ props.item.qn }}</td>
              <td class="text-xs-right">{{ props.item.pid }}</td>
              <td class="text-xs-right">{{ props.item.userName }}</td>
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
      barcodes: '',
      trackingNumber: '',
      UPC: '',
      qn: 0,
      pid: '',
      userName: '',
      showAlert: false,
      ReceivingInfo: [
      ],
      headers: [
        { text: 'Tracking Number)',
          align: 'left',
          sortable: false,
          value: 'trackingNumber'},
        { text: 'UPC', value: 'UPC' },
        { text: 'Quantities', value: 'qn' },
        { text: 'WmsPID', value: 'pid' },
        { text: 'User/Org Name', value: 'userName' }
      ]
    }
  },
  methods: {
    addOneRecord: function () {
      if (this.UPC === '') {
        this.showAlert = true
        console.log('Trying to input a record with empty UPC')
      } else {
        this.ReceivingInfo.push({
          trackingNumber: this.trackingNumber,
          UPC: this.UPC,
          qn: this.qn,
          pid: this.pid,
          userName: this.pid
        })
        console.log(this.ReceivingInfo)
        this.showAlert = false
      }
    },
    getBarcode: function () {
      if (this.barcodes.length === 12) {
        // This is a UPC number
        if (this.UPC === '') {
          this.UPC = this.barcodes
          this.qn = 1 + this.qn
          this.barcodes = ''
        } else if (this.UPC === this.barcodes) {
          this.qn = 1 + this.qn
          this.barcodes = ''
        } else {
          // call next
          console.log('You should call next here')
        }
      } else if (this.barcodes === 'WMS-RECEIVING-NEXT') {
        // This is add info to table
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
