<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-layout row>
      <v-flex>
        <panel title = "Products and Inventory" ma-5>
            <v-data-table
              :headers="headers"
              :items="products"
              :rows-per-page-items="rowsPerPageItems"
            >
            <template slot="items" slot-scope="props">
              <tr  @click="showDetail(props.item)">
                <td class="text-xs-left">{{ props.item.UPC }}</td>
                <td class="text-xs-left">
                  {{ props.item.prdNm }}
                </td>
                <td class="text-xs-left">{{ props.item.qty }}</td>
              </tr>
            </template>
          </v-data-table>
        </panel>
      </v-flex>
      <v-flex ml-5>
        <v-layout justify-center column>
          <v-flex>
            <v-alert type="error"
              outline
              :value="error1"
              >
              {{ error1 }}
            </v-alert>
          </v-flex>
          <v-flex>
              <v-flex >
                <v-text-field
                  autofocus
                  label="UPC"
                  ref="UPC1"
                  v-model="UPC1"
                  v-on:keydown.enter="handleUPCInput1()"
                  required
                  ></v-text-field>
              </v-flex>
             <v-flex v-if= showDetailPanel mt-2>
                <div class="font-weight-bold text-xs-left">UPC: {{UPCInvList.UPC}} </div>
                <v-layout wrap>
                <div class="font-weight-light text-xs-left">Name: {{UPCInvList.prdNm}}</div>
                <v-spacer></v-spacer>
                <div class="font-weight-light text-xs-left">Total : {{UPCInvList.qty}}</div>
                </v-layout>
                  <br>
                  <v-data-table
                    :headers="locInvHead"
                    :items="locInv"
                    class="elevation-1"
                  >
                    <template slot="items" slot-scope="props">
                      <td class="text-xs-left">{{ props.item.loc }}</td>
                      <td class="text-xs-left">{{ props.item.qty }}</td>
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
                      <td class="text-xs-left">{{ props.item.qty }}</td>
                    </template>
                  </v-data-table>
              </v-flex>
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
      rowsPerPageItems: [30, 60, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 }],
      headers: [
        {
          text: 'UPC',
          align: 'left',
          value: 'UPC'
        },
        { text: 'Product Name', value: 'prdNm' },
        { text: 'Quantity', value: 'qty' }
      ],
      products: [],
      showDetailPanel: false,
      error1: '',
      UPC1: '',
      UPCInvList: [],
      locInvHead: [
        {
          text: 'LocationID',
          align: 'left',
          value: 'loc'
        },
        { text: 'Quantity', value: 'qty' }
      ],
      locInv: [],
      sellerInvHead: [
        {
          text: 'Organization Name',
          align: 'left',
          value: 'org'
        },
        { text: 'Quantity', value: 'qty' }
      ],
      sellerInv: []
    }
  },
  methods: {
    async getAllProductInventory () {
      try {
        this.error1 = ''
        this.products = (await ProductInv.getAllProductInventory()).data
        // console.log(this.products)
      } catch (error) {
        if (!error.response) {
          // network error
          this.error1 = 'Network Error: Fail to connet to server'
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.data.message)
          this.error1 = error.response.data.error
        }
      }
    },
    showDetail (item) {
      this.showDetailPanel = true
      this.UPC1 = item.UPC
      this.handleUPCInput1()
      this.UPC1 = ''
    },
    async handleUPCInput1 () {
      try {
        this.error1 = ''
        this.UPC1 = this.UPC1.trim()
        this.UPCInvList = (await ProductInv.getByUPC(this.UPC1)).data[0]
        this.locInv = this.UPCInvList.locationInventory
        this.sellerInv = this.UPCInvList.sellerInventory
        this.UPC1 = ''
        this.showDetailPanel = true
      } catch (error) {
        if (!error.response) {
          // network error
          this.error1 = 'Network Error: Fail to connet to server'
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.data.message)
          this.error1 = error.response.data.error
        }
      }
    }
  },
  created () {
    this.getAllProductInventory()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
