<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-layout justify-center>
      <h1>Move in Products</h1>
    </v-layout>
    <v-layout justify-center>
      <v-flex ma-5 xs8>
        <v-alert
          v-show = showAlert1
          :type = alertType1
          outline>
            {{message1}}
          </v-alert>
        <v-card>
          <panel title="Scan Items by UPC ">
            <v-text-field
            v-model="miLoc1"
            v-bind:autofocus= "true"
            label="Move in Location"
            v-on:keydown.enter="changeFocusToUPC1()"
            ></v-text-field>
            <v-layout v-for = "(miItem, i) in miItems1" :key = "i">
              <v-flex >
                <v-text-field
                  label="UPC"
                  ref="UPC1"
                  v-model="miItem.UPC"
                  v-on:keydown.enter="handleUPCInput1(i)"
                  required
                  ></v-text-field>
              </v-flex>
              <v-flex offset-lg2>
                <v-text-field
                  label = "Quantity"
                  ref="qty1"
                  :rules="[rules.qnRule1, rules.qnRule2]"
                  v-model.number="miItem.qty"
                  v-on:keydown.enter="addNewMoveItem1(i)"
                  type="number"
                  ></v-text-field>
              </v-flex>
            </v-layout >
            <v-btn dark class="cyan darken-2" @click.prevent="submit1()">Submit</v-btn>
          </panel>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Location from '@/services/Location'
import ProductInv from '@/services/productInv'
export default {
  data () {
    return {
      rules: {
        qnRule1: val => val < 1000000 || 'Not a valid number',
        qnRule2: val => val >= 0 || 'Not a valid number'
      },
      miLoc1: '',
      UPC1: '',
      qty1: null,
      alertType1: 'success',
      showAlert1: false,
      message1: '',
      miItems1: [
        { UPC: '', qty: 0 }
      ],
      rowsPerPageItems: [30, 60, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 }]
    }
  },
  methods: {
    changeFocusToUPC1 () {
      this.message1 = ''
      this.showAlert1 = false
      this.checkLocationExisted(this.miLoc1)
      this.$refs.UPC1[0].focus()
    },
    changeFocusToQty1 () {
      this.$refs.qty1.focus()
    },
    handleUPCInput1 (i) {
      console.log('Here')
      if (this.miItems1[i].UPC === 'WMS-RECEIVING-SUBMIT') {
        // some code to pass data to server
        // this.submit()
        console.log('call to submit')
      } else {
        let idx = -1
        for (let j = 0; j < this.miItems1.length; j++) {
          if ((this.miItems1[j].UPC === this.miItems1[i].UPC) && (i !== j)) {
            idx = j
          }
        }
        if (idx === -1) {
          this.miItems1[i].qty = 1
          if (i === (this.miItems1.length - 1)) {
            // Add a line only if reach to the buttom of the lines
            this.miItems1.push({ UPC: '', qty: 0 })
          }
          this.$nextTick(() => {
            this.$refs.UPC1[i + 1].focus()
          })
        } else {
          this.miItems1[idx].qty++
          this.miItems1[i].UPC = ''
        }
      }
    },
    addNewMoveItem1 (i) {
      if (i === (this.miItems1.length - 1)) {
        // Add a line only if reach to the buttom of the lines
        this.miItems1.push({ UPC: '', qty: 0 })
      }
      this.$nextTick(() => {
        this.$refs.UPC1[i + 1].focus()
      })
    },
    async checkLocationExisted (locID) {
      try {
        let locIDExisted = await Location.checkLocationExisted(locID)
        if (locIDExisted.data.length === 0) {
          // Location doesn't existed!
          this.alertType1 = 'error'
          this.message1 = 'Location Not Existed! Create one before using!'
          this.showAlert1 = true
        }
      } catch (error) {
        if (!error.response) {
          // network error
          this.message1 = 'Network Error: Fail to connet to server'
          this.alertType1 = 'error'
          this.showAlert1 = true
        } else if (error.response.data.error.includes('jwt')) {
          console.log('jwt error')
          this.$store.dispatch('resetUserInfo', true)
          this.$router.push('/login')
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.statusText)
          this.message1 = error.response.data.error
          this.alertType1 = 'error'
          this.showAlert1 = true
        }
      }
    },
    async submit1 () {
      try {
        // reduce empty data
        for (let i = 0; i < this.miItems1.length; i++) {
          if ((this.miItems1[i].UPC === '') || (this.miItems1[i].UPC === 'WMS-RECEIVING-SUBMIT')) {
            this.miItems1.splice(i, 1)
          }
        }
        if ((this.miItems1.length === 0) || (this.miLoc1 === '')) {
          this.miItems1 = [{ UPC: '', qty: 0 }]
          this.message1 = 'Move in Location and UPC required.'
          this.alertType1 = 'error'
          this.showAlert1 = true
          return
        }
        console.log(this.miItems1)
        await ProductInv.moveInBatch({
          'move': this.miItems1,
          'locFrom': 'WMS',
          'locTo': this.miLoc1,
          'note': ''
        })
        this.alertType1 = 'success'
        this.message1 = 'Move in successfully!'
        this.showAlert1 = true
        this.miLoc1 = ''
        this.miItems1 = [{ UPC: '', qty: 0 }]
      } catch (error) {
        if (!error.response) {
          // network error
          this.message1 = 'Network Error: Fail to connet to server'
          this.alertType1 = 'error'
          this.showAlert1 = true
        } else if (error.response.data.error.includes('jwt')) {
          console.log('jwt error')
          this.$store.dispatch('resetUserInfo', true)
          this.$router.push('/login')
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.data.error)
          this.message1 = error.response.data.error
          this.alertType1 = 'error'
          this.showAlert1 = true
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
