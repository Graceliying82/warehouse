<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-dialog v-model="showAlertDialog" max-width="1000px">
      <v-card>
        <v-card-text>
            <h2 pt-8>{{message}}</h2>
        </v-card-text>
      </v-card>
    </v-dialog>
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
        <v-layout column>
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
                  <td class="text-xs-left">{{ props.item.prdNm }}</td>
                  <td class="text-xs-left">{{ props.item.pid }}</td>
                  <td class="text-xs-left">{{ props.item.qty }}</td>
                  <td class="text-xs-left">{{ props.item.balance }}</td>
                </tr>
              </template>
            </v-data-table>
          </panel>
          <v-card ma-2>
            <v-card-title class="title font-weight-light blue-grey lighten-5">
              <span style='margin-right:1.25em; display:inline-block;'>Products with No Inventory</span>
            </v-card-title>
            <v-card-text>
              <v-data-table
                :headers="noInvHeaders"
                :items="noInvPrd"
                :rows-per-page-items="rowsPerPageItems"
              >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">{{ props.item.UPC }}</td>
                  <td class="text-xs-left">{{ props.item.prdNm }}</td>
                  <td class="text-xs-left">{{ props.item.pid }}</td>
                  <td class="text-xs-left">{{ props.item.qty }}</td>
                  <td class="text-xs-left">
                    <v-btn
                      v-if="$store.state.isSupervisor"
                      icon
                      class="mx-0"
                      @click.prevent="deleteItem(props.item)">
                      <v-icon color="teal">delete_forever</v-icon>
                    </v-btn>
                  </td>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
          <!-- Dialog to show Alert-->
          <v-dialog v-model="showAlertDialog" max-width="1000px">
            <v-card>
              <v-card-text>
                  <h2 pt-8>{{message}}</h2>
              </v-card-text>
            </v-card>
          </v-dialog>
          <!--Dialog to confirm Delete-->
          <v-dialog v-model="dialogDelete" max-width="800px">
            <v-card>
              <v-card-text>
                  <h1 pt-8>Delete Confirmation</h1>
                  <p>You will delete Product </p>
                  <p style="color:red;">{{deletePrdNm}} </p>
                  <p style="color:red;">{{deleteUPC}}</p>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click.native="closeDialog">Cancel</v-btn>
                <v-btn color="blue darken-1" flat @click.native="deleteDialog">Confirm</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-layout>
      </v-flex>
      <v-flex ml-5>
        <v-layout justify-center column>
          <!-- Show Detail -->
          <v-flex>
            <v-flex xs8>
              <v-alert
                v-show = showAlert
                :type = alertType
                outline>
                  {{message}}
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
                <v-flex mx-2 my-5>
                  <v-flex mb-3>
                    <h2 v-if="$store.state.isSupervisor">Mannual Inventory Count</h2>
                  </v-flex>
                  <div class="font-weight-bold text-xs-left">UPC: {{UPCInvList.UPC}} </div>
                  <div class="font-weight-light text-xs-left">Name: {{UPCInvList.prdNm}}</div>
                  <v-layout>
                  <div class="font-weight-bold text-center">Total : {{UPCInvList.qty}}</div>
                  <v-btn v-if="$store.state.isSupervisor" icon big class="mx-0" @click.prevent= add(UPCInvList)>
                    <v-icon color="teal">add_circle</v-icon>
                  </v-btn>
                  <v-flex md1 sm3 xs3>
                    <v-text-field
                      label="Delta"
                      v-model.number="UPCInvList.qtyDelta"
                      v-on:click = "error = null"
                      box></v-text-field>
                    </v-flex>
                  <v-btn v-if="$store.state.isSupervisor" icon class="mx-0" @click.prevent= sub(UPCInvList)>
                    <v-icon color="teal">remove_circle</v-icon>
                  </v-btn>
                  </v-layout>
                  <v-layout>
                  <div class="font-weight-light text-xs-left">Balance: {{UPCInvList.balance}} </div>
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
                          {{ props.item.qty }}
                        </td>
                        <td class="text-xs-left">
                          <v-edit-dialog
                            @open="props.item._qtyDelta = props.item.qtyDelta"
                            @cancel="props.item.qtyDelta = props.item._qtyDelta || props.item.qtyDelta"
                          >
                            {{ props.item.qtyDelta }}
                            <v-text-field
                              slot="input"
                              v-model.number= "props.item.qtyDelta"
                              @change="addDelta(props.item)"
                              label="Quantity"
                              single-line
                              >
                            </v-text-field>
                          </v-edit-dialog>
                        </td>
                        <td class="text-xs-left">
                          <v-btn v-if="$store.state.isSupervisor" icon class="mx-0" @click.prevent= "add(props.item)">
                            <v-icon color="teal">add_circle</v-icon>
                          </v-btn>
                          <v-btn v-if="$store.state.isSupervisor" icon class="mx-0" @click.prevent= "sub(props.item)">
                            <v-icon color="teal">remove_circle</v-icon>
                          </v-btn>
                        </td>
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
                          {{ props.item.qty }}
                        </td>
                        <td class="text-xs-left">
                          <v-edit-dialog
                            @open="props.item._qtyDelta = props.item.qtyDelta"
                            @cancel="props.item.qtyDelta = props.item._qtyDelta || props.item.qtyDelta"
                          >
                            {{ props.item.qtyDelta }}
                            <v-text-field
                              slot="input"
                              v-model.number= "props.item.qtyDelta"
                              label="Quantity"
                              single-line
                              v-on:keydown.enter="addDelta(props.item)"
                              >
                            </v-text-field>
                          </v-edit-dialog>
                        </td>
                        <td class="text-xs-left">
                          <v-btn v-if="$store.state.isSupervisor" icon class="mx-0" @click.prevent= "add(props.item)">
                            <v-icon color="teal">add_circle</v-icon>
                          </v-btn>
                          <v-btn v-if="$store.state.isSupervisor" icon class="mx-0" @click.prevent= "sub(props.item)">
                            <v-icon color="teal">remove_circle</v-icon>
                          </v-btn>
                        </td>
                      </template>
                    </v-data-table>
                    <v-flex v-if='changed' mt-2>
                      <v-btn dark @click.prevent="submitMIC()">Submit</v-btn>
                      <v-btn dark @click.prevent="reset()">Reset</v-btn>
                      <v-btn dark @click.prevent="clear()">Clear</v-btn>
                    </v-flex>
                  </v-flex>
                  <v-divider></v-divider>
                  <v-flex v-if="$store.state.isSupervisor" my-5>
                    <v-flex mb-3>
                      <h2>Inventory change between Organizations</h2>
                    </v-flex>
                    <v-layout row>
                      <v-flex mr-1 mt-1>
                        <h3>From Organization</h3>
                          <v-data-table
                            :headers="sellerInvHead"
                            :items="fromInv"
                            class="elevation-1"
                          >
                            <template slot="items" slot-scope="props">
                              <td class="text-xs-left">{{ props.item.org }}</td>
                              <td class="text-xs-left">
                                {{ props.item.qty }}
                              </td>
                              <td class="text-xs-left">
                                <v-edit-dialog
                                  @open="props.item._qtyDelta = props.item.qtyDelta"
                                  @cancel="props.item.qtyDelta = props.item._qtyDelta || props.item.qtyDelta"
                                >
                                  {{ props.item.qtyDelta }}
                                  <v-text-field
                                    slot="input"
                                    v-model.number= "props.item.qtyDelta"
                                    label="Quantity"
                                    single-line
                                    v-on:keydown.enter="addDelta(props.item)"
                                    >
                                  </v-text-field>
                                </v-edit-dialog>
                              </td>
                              <td class="text-xs-left">
                                <v-btn v-if="$store.state.isSupervisor" icon class="mx-0" @click.prevent= "add(props.item)">
                                  <v-icon color="teal">add_circle</v-icon>
                                </v-btn>
                                <v-btn v-if="$store.state.isSupervisor" icon class="mx-0" @click.prevent= "sub(props.item)">
                                  <v-icon color="teal">remove_circle</v-icon>
                                </v-btn>
                              </td>
                            </template>
                          </v-data-table>
                      </v-flex>
                      <v-flex ml-1 mt-1>
                        <h3>To Organization</h3>
                        <v-data-table
                            :headers="sellerInvHead"
                            :items="toInv"
                            class="elevation-1"
                          >
                            <template slot="items" slot-scope="props">
                              <td class="text-xs-left">{{ props.item.org }}</td>
                              <td class="text-xs-left">
                                {{ props.item.qty }}
                              </td>
                              <td class="text-xs-left">
                                <v-edit-dialog
                                  @open="props.item._qtyDelta = props.item.qtyDelta"
                                  @cancel="props.item.qtyDelta = props.item._qtyDelta || props.item.qtyDelta"
                                >
                                  {{ props.item.qtyDelta }}
                                  <v-text-field
                                    slot="input"
                                    v-model.number= "props.item.qtyDelta"
                                    label="Quantity"
                                    single-line
                                    v-on:keydown.enter="addDelta(props.item)"
                                    >
                                  </v-text-field>
                                </v-edit-dialog>
                              </td>
                              <td class="text-xs-left">
                                <v-btn v-if="$store.state.isSupervisor" icon class="mx-0" @click.prevent= "add(props.item)">
                                  <v-icon color="teal">add_circle</v-icon>
                                </v-btn>
                                <v-btn v-if="$store.state.isSupervisor" icon class="mx-0" @click.prevent= "sub(props.item)">
                                  <v-icon color="teal">remove_circle</v-icon>
                                </v-btn>
                              </td>
                            </template>
                          </v-data-table>
                          <p>Only show Organizations created in Manage Organization</p>
                      </v-flex>
                    </v-layout>
                    <v-flex v-if='changed' mt-2>
                        <v-btn dark @click.prevent="submitICBO()">Submit</v-btn>
                        <v-btn dark @click.prevent="reset()">Reset</v-btn>
                        <v-btn dark @click.prevent="clear()">Clear</v-btn>
                      </v-flex>
                  </v-flex>
              </v-flex>
          </v-flex>
          <!-- End Show Detail -->
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import ProductInv from '@/services/ProductInvService'
import Product from '@/services/ProductService'
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
        { text: 'PID', align: 'left', value: 'pid' },
        { text: 'Quantity', value: 'qty' },
        { text: 'Balance', value: 'balance' }
      ],
      products: [],
      noInvHeaders: [
        { text: 'UPC', align: 'left', value: 'UPC' },
        { text: 'Product Name', align: 'left', value: 'prdNm' },
        { text: 'PID', align: 'left', value: 'pid' },
        { text: 'Quantity', align: 'left', value: 'qty' },
        { text: 'Action', align: 'left', value: 'UPC' }
      ],
      noInvPrd: [],
      showDetailPanel: false,
      alertType: 'success',
      showAlert: false,
      showAlertDialog: false,
      dialogDelete: false,
      deletePrdNm: '',
      deleteUPC: '',
      message: '',
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
        { text: 'Delta', value: 'qtyDelta' },
        { text: 'Actions', value: 'qtyDelta' }
      ],
      locInv: [],
      sellerInvHead: [
        {
          text: 'Organization',
          align: 'left',
          value: 'org'
        },
        { text: 'Quantity', value: 'qty' },
        { text: 'Delta', value: 'qtyDelta' },
        { text: 'Actions', value: 'qtyDelta' }
      ],
      sellerInv: [],
      fromInv: [],
      toInv: [],
      styles: [
        '',
        'deep-orange lighten-1'
      ],
      changed: false,
      totalDelta: 0
    }
  },
  methods: {
    clearAlert () {
      this.showAlert = false
      this.message = ''
    },
    setAlert (type, message) {
      this.message = message
      this.alertType = type
      this.showAlert = true
    },
    setAlertDialog (message) {
      this.message = message
      this.showAlertDialog = true
    },
    clearData () {
      this.dialog = false
      this.showDetailPanel = false
      this.UPC1 = ''
      this.savedUPC = ''
      this.UPCInvList = []
      this.locInv = []
      this.sellerInv = []
      this.fromInv = []
      this.toInv = []
      this.changed = false
      this.totalDelta = 0
    },
    clear () {
      this.clearAlert()
      this.clearData()
    },
    deleteItem (item) {
      this.deletePrdNm = item.prdNm
      this.deleteUPC = item.UPC
      this.dialogDelete = true
    },
    closeDialog () {
      this.dialogDelete = false
    },
    async deleteDialog () {
      // console.log(this.deletePrdNm + ' ' + this.deleteUPC)
      try {
        await Product.deleteProduct({'UPC': this.deleteUPC})
        await this.getAllProductInventory()
        this.dialogDelete = false
        this.setAlertDialog('Product deleted')
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
    async getAllProductInventory () {
      try {
        let result = (await ProductInv.getAllProductInventory()).data
        this.dialog = false
        this.products = result.prdWithInv
        this.noInvPrd = result.prdWOInv
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
    addDelta (item) {
      this.$forceUpdate()
      this.changed = true
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
        let result = (await ProductInv.getSellerInvAndOrgList(UPC)).data
        this.fromInv = result.sellerInv
        for (let aFrom of this.fromInv) {
          aFrom.qtyDelta = 0
        }
        this.toInv = result.orgList
        for (let aTo of this.toInv) {
          aTo.qtyDelta = 0
        }
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
      item.qtyDelta += 1
      this.$forceUpdate()
    },
    sub (item) {
      this.clearAlert()
      item.qtyDelta -= 1
      this.$forceUpdate()
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
    async submitMIC () {
      try {
        this.clearAlert()
        let adjustData = {
          'UPC': this.UPCInvList.UPC,
          'qtyDelta': this.UPCInvList.qtyDelta,
          'locationInventory': [],
          'sellerInventory': []
        }
        for (let aloc of this.locInv) {
          adjustData.locationInventory.push({
            'loc': aloc.loc,
            'qtyDelta': aloc.qtyDelta
          })
        }
        for (let aSeller of this.sellerInv) {
          adjustData.sellerInventory.push({
            'org': aSeller.org,
            'qtyDelta': aSeller.qtyDelta
          })
        }
        await ProductInv.prodInvAdjustBatch({'adjust': [adjustData]})
        this.setAlertDialog('Update Successfully')
        this.getDetailByUPC(this.UPCInvList.UPC)
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
    },
    async submitICBO () {
      try {
        this.clearAlert()
        let adjustData = {
          'UPC': this.UPCInvList.UPC,
          'sellerInventory': []
        }
        for (let aFrom of this.fromInv) {
          adjustData.sellerInventory.push({
            'org': aFrom.org,
            'qtyDelta': aFrom.qtyDelta
          })
        }
        for (let aTo of this.toInv) {
          adjustData.sellerInventory.push({
            'org': aTo.org,
            'qtyDelta': aTo.qtyDelta
          })
        }
        console.log(adjustData)
        await ProductInv.prodInvAdjustBatch({'adjust': [adjustData]})
        this.setAlertDialog('Update Successfully')
        this.getDetailByUPC(this.UPCInvList.UPC)
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
