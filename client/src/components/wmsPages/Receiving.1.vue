<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-content>
      <v-container grid-list-xl>
         <h1>Please scan barcodes:</h1>
        <v-layout justify-center align-start row>
            <v-flex lg6 xs12>
              <v-text-field
                label="Tracking Number" ></v-text-field>
            </v-flex>
        </v-layout>
        <v-layout justify-center align-start row>
            <v-flex lg4 xs12>
              <v-text-field
                label="UPC"></v-text-field>
            </v-flex>
            <v-flex lg2 xs5>
              <v-text-field
                type=number
                label="Quantity"></v-text-field>
            </v-flex>
        </v-layout>
        <v-layout justify-center align-start row>
            <v-flex lg4 xs12>
              <v-text-field
                label="User/Org name"
                hint="Optional"
                persistent-hint
                v-bind:value= ReceivingInfo[0].trackingNumber
                v-model="ReceivingInfo[0].trackingNumber">
              </v-text-field>
            </v-flex>
            <v-flex lg2 xs5>
              <v-text-field
                label="WmsPID"></v-text-field>
            </v-flex>
        </v-layout>
        <v-btn>Submit</v-btn>
        <v-layout align-end justify-start row>
          <v-flex lg6 xs12>
            <v-text-field
              label="Barcode Scanner" v-model="barcodes"
              ></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>

<script>
export default {
  data () {
    return {
      barcodes: '',
      ReceivingInfo: [
        { trackingNumber: 'abcde', orgName: 'WSM' },
        { upc: '', quantity: '0', wmsPID: '' }
      ]
    }
  },
  methods: {
    getBarcode: function () {
      console.log('Scanned')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
