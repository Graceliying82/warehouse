<template>
  <div v-if="$store.state.isUserLoggedIn">
    <!-- Dialog -->
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Notice
        </v-card-title>

        <v-card-text>
          This action may take a while to finish. Please wait
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="dialog = false"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End Dialog -->
    <v-layout row>
      <v-flex>
        <panel title = "Products and Inventory" ma-5>
          <v-layout justify-start>
          <v-btn dark @click.prevent="checkBalanceMan()">
            Check Balance
          </v-btn>
          </v-layout>
            <v-data-table
              :headers="headers"
              :items="products"
              :rows-per-page-items="rowsPerPageItems"
            >
            <template slot="items" slot-scope="props">
              <tr  @click="showDetail(props.item)"
                v-bind:class = props.item.style>
                <td class="text-xs-left">{{ props.item.UPC }}</td>
                <td class="text-xs-left">
                  {{ props.item.prdNm }}
                </td>
                <td class="text-xs-left">{{ props.item.qty }}</td>
                <td class="text-xs-left">{{ props.item.balance }}</td>
              </tr>
            </template>
          </v-data-table>
        </panel>
      </v-flex>
      <v-flex ml-5>
        <v-layout justify-center column>
          <!-- Show Detail -->
          <v-flex>
            <v-flex xs8>
              <v-alert
                v-show = showAlert1
                :type = alertType1
                outline>
                  {{message1}}
                </v-alert>
            </v-flex>
              <v-flex >
                <v-text-field
                  autofocus
                  label="UPC"
                  ref="UPC1"
                  v-model="UPC1"
                  v-on:keydown.enter="handleUPCInput()"
                  required
                  ></v-text-field>
              </v-flex>
             <v-flex v-if= showDetailPanel mt-2>
                <div class="font-weight-bold text-xs-left">UPC: {{UPCInvList.UPC}} </div>
                <div class="font-weight-light text-xs-left">Name: {{UPCInvList.prdNm}}</div>
                <v-layout>
                <div class="font-weight-bold text-center">Total : </div>
                <v-btn icon big class="mx-0" @click.prevent= addInvQty()>
                  <v-icon color="teal">add_circle</v-icon>
                </v-btn>
                <v-btn>
                  {{UPCInvList.qty}}
                </v-btn>
                <v-btn icon class="mx-0" @click.prevent= subInvQty()>
                  <v-icon color="teal">remove_circle</v-icon>
                </v-btn>
                </v-layout>
                <v-layout>
                <div class="font-weight-light text-xs-left">Balance: {{UPCInvList.balance}} </div>
                <v-spacer></v-spacer>
                <div class="font-weight-light text-xs-left">Delta: {{UPCInvList.qtyDelta}} </div>
                </v-layout>
                  <br>
                  <v-data-table
                    :headers="locInvHead"
                    :items="locInv"
                    class="elevation-1"
                  >
                    <template slot="items" slot-scope="props">
                      <td class="text-xs-left">{{ props.item.loc }}</td>
                      <td class="text-xs-left">
                      <v-btn icon class="mx-0" @click.prevent= add(props.item)>
                        <v-icon color="teal">add_circle</v-icon>
                      </v-btn>
                        {{ props.item.qty }}
                      <v-btn icon class="mx-0" @click.prevent= sub(props.item)>
                        <v-icon color="teal">remove_circle</v-icon>
                      </v-btn>
                      </td>
                      <td class="text-xs-left">{{ props.item.qtyDelta }}</td>
                    </template>
                  </v-data-table>
                  <br>
                  <v-data-table
                    :headers="sellerInvHead"
                    :items="sellerInv"
                    class="elevation-1"
                  >
                    <template slot="items" slot-scope="props">
                      <td class="text-xs-left">{{ props.item.org }}</td>
                      <td class="text-xs-left">
                        <v-btn icon class="mx-0" @click.prevent= add(props.item)>
                          <v-icon color="teal">add_circle</v-icon>
                        </v-btn>
                        {{ props.item.qty }}
                        <v-btn icon class="mx-0" @click.prevent= sub(props.item)>
                          <v-icon color="teal">remove_circle</v-icon>
                        </v-btn>
                      </td>
                      <td class="text-xs-left">{{ props.item.qtyDelta }}</td>
                    </template>
                  </v-data-table>
              </v-flex>
          </v-flex>
          <!-- End Show Detail -->
          <v-flex v-if='changed'>
            <v-btn dark @click.prevent="submit()">Submit</v-btn>
            <v-btn dark @click.prevent="reset()">Reset</v-btn>
            <v-btn dark @click.prevent="clear()">Clear</v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import ProductInv from '@/services/productInv'
export default {
  data () {
    return {
      dialog: false,
      rowsPerPageItems: [30, 60, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 }],
      headers: [
        {
          text: 'UPC',
          align: 'left',
          value: 'UPC'
        },
        { text: 'Product Name', value: 'prdNm' },
        { text: 'Quantity', value: 'qty' },
        { text: 'Balance', value: 'balance' }
      ],
      products: [],
      showDetailPanel: false,
      alertType1: 'success',
      showAlert1: false,
      message1: '',
      UPC1: '',
      savedUPC: '',
      UPCInvList: [],
      locInvHead: [
        {
          text: 'LocationID',
          align: 'left',
          value: 'loc'
        },
        { text: 'Quantity', value: 'qty' },
        { text: 'Delta', value: 'qtyDelta' }
      ],
      locInv: [],
      sellerInvHead: [
        {
          text: 'Organization Name',
          align: 'left',
          value: 'org'
        },
        { text: 'Quantity', value: 'qty' },
        { text: 'Delta', value: 'qtyDelta' }
      ],
      sellerInv: [],
      styles: [
        '',
        'deep-orange lighten-1'
      ],
      changed: false
    }
  },
  methods: {
    clearAlert () {
      this.showAlert1 = false
      this.message1 = ''
    },
    setAlert (type, message) {
      this.message1 = message
      this.alertType1 = type
      this.showAlert1 = true
    },
    clearData () {
      this.dialog = false
      this.showDetailPanel = false
      this.UPC1 = ''
      this.savedUPC = ''
      this.UPCInvList = []
      this.locInv = []
      this.sellerInv = []
      this.changed = false
    },
    clear () {
      this.clearAlert()
      this.clearData()
    },
    async getAllProductInventory () {
      try {
        this.products = (await ProductInv.getAllProductInventory()).data
        // console.log(this.products)
        for (let aPrd of this.products) {
          if (aPrd.balance === 'unbalanced') {
            aPrd.style = this.styles[1]
          } else {
            aPrd.style = this.styles[0]
          }
        }
        // this.$forceUpdate()
        // console.log(this.products)
      } catch (error) {
        if (!error.response) {
          // network error
          this.setAlert('error', 'Network Error: Fail to connet to server')
        } else if (error.response.data.error.includes('jwt')) {
          console.log('jwt error')
          this.$store.dispatch('resetUserInfo', true)
          this.$router.push('/login')
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.statusText)
          this.setAlert('error', error.response.data.error)
        }
      }
    },
    showDetail (item) {
      this.clearAlert()
      this.showDetailPanel = true
      this.getDetailByUPC(item.UPC)
      this.savedUPC = item.UPC
    },
    setDelta (list) {
      for (let item of list) {
        item.qtyDelta = 0
      }
    },
    async getDetailByUPC (UPC) {
      try {
        this.UPCInvList = (await ProductInv.getByUPC(UPC)).data[0]
        this.locInv = this.UPCInvList.locationInventory
        this.sellerInv = this.UPCInvList.sellerInventory
        this.setDelta(this.locInv)
        this.setDelta(this.sellerInv)
        this.UPCInvList.qtyDelta = 0
        this.UPC1 = ''
        this.showDetailPanel = true
      } catch (error) {
        if (!error.response) {
          // network error
          this.setAlert('error', 'Network Error: Fail to connet to server')
        } else if (error.response.data.error.includes('jwt')) {
          console.log('jwt error')
          this.$store.dispatch('resetUserInfo', true)
          this.$router.push('/login')
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.statusText)
          this.setAlert('error', error.response.data.error)
        }
      }
    },
    handleUPCInput () {
      this.clearAlert()
      this.UPC1 = this.UPC1.trim()
      this.getDetailByUPC(this.UPC1)
    },
    checkBalance () {
      try {
        ProductInv.checkBalance().then(() => {
          this.getAllProductInventory()
        })
      } catch (error) {
        if (!error.response) {
          // network error
          this.setAlert('error', 'Network Error: Fail to connet to server')
        } else if (error.response.data.error.includes('jwt')) {
          console.log('jwt error')
          this.$store.dispatch('resetUserInfo', true)
          this.$router.push('/login')
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.statusText)
          this.setAlert('error', error.response.data.error)
        }
      }
    },
    checkBalanceMan () {
      this.dialog = true
      this.checkBalance()
    },
    add (item) {
      this.clearAlert()
      this.changed = true
      item.qty += 1
      item.qtyDelta += 1
    },
    sub (item) {
      this.clearAlert()
      if (item.qty > 0) {
        this.changed = true
        item.qty -= 1
        item.qtyDelta -= 1
      }
    },
    addInvQty () {
      this.clearAlert()
      this.changed = true
      this.UPCInvList.qty += 1
      this.UPCInvList.qtyDelta += 1
    },
    subInvQty () {
      this.clearAlert()
      if (this.UPCInvList.qty > 0) {
        this.changed = true
        this.UPCInvList.qty -= 1
        this.UPCInvList.qtyDelta -= 1
      }
    },
    async reset () {
      try {
        this.clearAlert()
        this.changed = false
        await this.getDetailByUPC(this.savedUPC)
      } catch (error) {
        if (!error.response) {
          // network error
          this.setAlert('error', 'Network Error: Fail to connet to server')
        } else if (error.response.data.error.includes('jwt')) {
          console.log('jwt error')
          this.$store.dispatch('resetUserInfo', true)
          this.$router.push('/login')
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.statusText)
          this.setAlert('error', error.response.data.error)
        }
      }
    },
    async submit () {
      try {
        this.clearAlert()
        await ProductInv.prodInvAdjustBatch({'adjust': [this.UPCInvList]})
        this.setAlert('success', 'Update Successfully')
        this.clearData()
        await this.checkBalance()
      } catch (error) {
        if (!error.response) {
          // network error
          this.setAlert('error', 'Network Error: Fail to connet to server')
        } else if (error.response.data.error.includes('jwt')) {
          console.log('jwt error')
          this.$store.dispatch('resetUserInfo', true)
          this.$router.push('/login')
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.statusText)
          this.setAlert('error', error.response.data.error)
        }
      }
    }
  },
  async created () {
    try {
      await this.getAllProductInventory()
    } catch (error) {
      if (!error.response) {
        // network error
        this.setAlert('error', 'Network Error: Fail to connet to server')
      } else if (error.response.data.error.includes('jwt')) {
        console.log('jwt error')
        this.$store.dispatch('resetUserInfo', true)
        this.$router.push('/login')
      } else {
        console.log('error ' + error.response.status + ' : ' + error.response.statusText)
        this.setAlert('error', error.response.data.error)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
