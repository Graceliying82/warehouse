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
            <v-layout xs-4>
              <v-flex>
              <v-text-field
              v-model="UPC1"
              label="UPC"
              ref="UPC1"
              required
              v-on:keydown.enter="changeFocusToQty1()"
              ></v-text-field>
              </v-flex>
              <v-flex offset-xs2>
              <v-text-field
              v-model.number="qty1"
              label="Quantity"
              ref="qty1"
              type="number"
              v-on:keydown.enter="submit()"
              ></v-text-field>
              </v-flex>
            </v-layout>
            <v-btn dark class="cyan darken-2" @click.prevent="clear()">Clear</v-btn>
          </panel>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout justify-center>
      <v-flex ma-5 xs8>
        <panel title = "Moved in items ">
            <v-data-table
              :items="miItems"
              class="elevation-1"
              :headers = "headers"
              :rows-per-page-items="rowsPerPageItems"
            >
              <template slot="items" slot-scope="props">
                <td>{{ props.item.UPC }}</td>
                <td >{{ props.item.qn }}</td>
                <td >{{ props.item.miLoc }}</td>
              </template>
            </v-data-table>
        </panel>
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
      miLoc1: '',
      UPC1: '',
      qty1: null,
      alertType1: '',
      showAlert1: false,
      message1: '',
      miItems: [],
      rowsPerPageItems: [30, 60, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 }]
    }
  },
  methods: {
    changeFocusToUPC1 () {
      this.alertType1 = ''
      this.message1 = ''
      this.showAlert1 = false
      this.checkLocationExisted(this.miLoc1)
      this.$refs.UPC1.focus()
    },
    changeFocusToQty1 () {
      this.$refs.qty1.focus()
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
    async submit () {
      try {
        if ((this.UPC1 === '') || (this.miLoc1 === '')) {
          // Location doesn't existed!
          this.alertType1 = 'error'
          this.message1 = 'Move in Location and UPC required! '
          this.showAlert1 = true
        } else {
          await ProductInv.moveInBatch({
            'move': [
              { 
                'UPC' : this.UPC1,
                'qty' : this.qty1
              }
            ],
            'locFrom': "WMS",
            'locTo': this.miLoc1,
            'note': ''
          })
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
