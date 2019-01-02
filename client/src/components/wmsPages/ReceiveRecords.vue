<template>
  <div>
    <panel title = 'Receiving Records'>
      <v-card>
        <v-layout>
          <v-flex>
            <v-menu
              :close-on-content-click="false"
              v-model="menu"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px">
              <v-text-field
                slot="activator"
                v-model="startDate"
                label="Choose a start Date"
                prepend-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker
                v-model="startDate"
                @change = "changeFilter()"
                @input="menu = false">
              </v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex ml-5>
            <span
              class="title font-weight-light"
              v-text="slider"
              ></span>
            <span class="subheading font-weight-light mr-3">Days</span>
            <span class="body-1 font-weight-light">End Date: </span>
            <span class="subheading font-weight-light"
              v-text="endDate"></span>
            <v-slider
              v-model="slider"
              :min="1"
              :max="30"
              label="Days to show"
              light
              @change = "changeFilter()"
            ></v-slider>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex>
            <v-text-field
                slot="activator"
                v-model="downloadName"
                label="Download File Name"
              ></v-text-field>
            <download-excel
                class   = "v-btn"
                type    = "csv"
                :name    = "downloadName"
                :data   = "items"
                :fields = "json_fields"
                >
                Download
            </download-excel>
          </v-flex>
        </v-layout>
        <v-layout>
        <v-flex>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
          ></v-text-field>
        </v-flex>
        <v-spacer></v-spacer>
          <v-flex lg5 xs12 offset-lg2>
            <v-text-field
              name="orgName"
              label="Show OrgName"
              id="orgName"
              v-model="orgName"
              @change = "changeFilter()"
              ></v-text-field>
          </v-flex>
        </v-layout>
          <v-dialog v-model="dialog1" max-width="500px">
            <v-card>
              <v-card-text>
                  <h1 pt-8>Modify Record</h1>
                <v-container grid-list-md>
                  <v-layout column>
                    <v-flex>
                      <v-text-field label="TrackingNo"
                        v-model="editedItem.trackingNo">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md8>
                      <v-text-field label="UPC"
                        readonly
                        hint="Readonly"
                        box
                        v-model="editedItem.UPC">
                      </v-text-field>
                    </v-flex>
                    <v-flex>
                      <v-text-field label="CreatedTime"
                        readonly
                        hint="Readonly"
                        box
                        v-model="editedItem.createTime">
                      </v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs12 sm12 md4>
                      <v-text-field label="OrgName"
                      v-model="editedItem.orgName">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md4>
                      <v-text-field label="Quantity"
                      type="number"
                      v-model.number="editedItem.qn">
                    </v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout column>
                  <v-flex>
                    <v-text-field label="ProductName"
                    v-model="editedItem.productName">
                  </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field label="Price"
                    v-model="editedItem.price"
                    type="number">
                  </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-textarea
                      label="Note"
                      v-model="editedItem.note"
                      counter =  50>
                    </v-textarea>
                  </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click.native="closeDialog1">Cancel</v-btn>
                <v-btn color="blue darken-1" flat @click.native="saveDialog1">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialog2" max-width="500px">
            <v-card>
              <v-card-text>
                  <h1 pt-8>Delete Confirmation</h1>
                  <h3>You will delete UPC</h3>
                  <h3 style="color:red;">{{deleteUPC}} </h3>
                  <h3>In Tracking No :{{deleteTracking}}</h3>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click.native="closeDialog2">Cancel</v-btn>
                <v-btn color="blue darken-1" flat @click.native="deleteDialog2">Confirm</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-flex>
          <v-alert type="error"
            outline
            :value="error">
            {{ error }}
          </v-alert>
          </v-flex>
          <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
            :rows-per-page-items="rowsPerPageItems"
            class="elevation-1"
          >
            <template v-for = "it in items" slot="items" slot-scope="props">
              <td :key="it.id + '-createTime'">{{ props.item.createTime }}</td>
              <td
                :key="it.id + '-trackingNo'"
                class="text-xs-left">
                {{ props.item.trackingNo }}
              </td>
              <td
                :key="it.id + '-productName'"
                class="text-xs-left">
                {{ props.item.productName }}
              </td>
              <td
                :key="it.id + '-UPC'"
                class="text-xs-left">
                {{ props.item.UPC }}
              </td>
              <td
                :key="it.id + '-orgName'"
                class="text-xs-left">
                {{ props.item.orgName }}
              </td>
              <td
                :key="it.id + '-price'"
                class="text-xs-left">
                {{ props.item.price }}
              </td>
              <td
                :key="it.id + '-qn'"
                class="text-xs-left">
                {{ props.item.qn }}
              </td>
              <td
                :key="it.id + '-action'"
                class="justify-center layout px-0">
                <v-btn icon class="mx-0" @click="editItem(props.item)">
                  <v-icon color="teal">edit</v-icon>
                </v-btn>
                <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                  <v-icon color="teal">delete_forever</v-icon>
                </v-btn>
              </td>
            </template>
          </v-data-table>
      </v-card>
    </panel>
  </div>
</template>

<script>
import Inventory from '@/services/Inventory'
import Product from '@/services/Product'
export default {
  data () {
    return {
      error: null,
      orgName: 'All',
      deleteTracking: '',
      deleteUPC: '',
      downloadName: 'InventoryReceive.xls',
      currentDate: new Date(new Date().toLocaleString() + ' UTC').toISOString().split('T')[0],
      startDate: new Date(new Date().toLocaleString() + ' UTC').toISOString().split('T')[0],
      endDate: new Date(new Date().toLocaleString() + ' UTC').toISOString().split('T')[0],
      menu: false,
      slider: 1,
      dialog1: false,
      dialog2: false,
      search: '',
      rowsPerPageItems: [30, 60, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 }],
      headers: [
        {
          text: 'CreateTime',
          align: 'left',
          value: 'createTime'
        },
        { text: 'TrackingNo', value: 'trackingNo' },
        { text: 'ProductName', value: 'productName' },
        { text: 'UPC', value: 'UPC' },
        { text: 'OrgName', value: 'orgName' },
        { text: 'Price', value: 'price' },
        { text: 'Quantity', value: 'qn', sortable: false },
        { text: 'Actions', value: 'id', sortable: false }
      ],
      items: [],
      json_fields: {
        'Create Time': 'createTime',
        'Tracking No': 'trackingNo',
        'Organization Name': 'orgName',
        'Product Name': 'productName',
        'UPC': 'UPC',
        'Price': 'price',
        'Quantity': 'qn',
        'Note': 'note'
      },
      editedIndex: -1,
      editedItem: {
        createTime: '',
        trackingNo: '',
        orgName: '',
        productName: '',
        UPC: '',
        price: 0,
        qn: 0,
        note: ''
      },
      defaultItem: {
        createTime: '',
        trackingNo: '',
        orgName: '',
        productName: '',
        UPC: '',
        price: 0,
        qn: 0,
        note: ''
      }
    }
  },
  watch: {
    dialog1 (val) {
      val || this.closeDialog1()
    }
  },
  created () {
    this.initialize()
  },
  methods: {
    async initialize () {
      this.changeFilter()
    },
    editItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog1 = true
      this.error = ''
    },
    async closeDialog1 () {
      this.dialog1 = false
      try {
        this.editedItem = await Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      } catch (error) {
        console.log('error  : ' + error)
        this.error = error
      }
    },
    closeDialog2 () {
      this.dialog2 = false
      try {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      } catch (error) {
        console.log('error  : ' + error)
        this.error = error
      }
    },
    deleteItem (item) {
      this.editedIndex = this.items.indexOf(item)
      // Object.assign(this.items[this.editedIndex], this.editedItem)
      this.deleteTracking = this.items[this.editedIndex].trackingNo
      this.deleteUPC = this.items[this.editedIndex].UPC
      this.dialog2 = true
      this.error = ''
    },
    async deleteDialog2 () {
      this.dialog2 = false
      try {
        await Product.deleteProduct({
          '_id': this.items[this.editedIndex]._id,
          UPC: this.items[this.editedIndex].UPC
        })
        this.changeFilter()
      } catch (error) {
        if (!error.response) {
          // network error
          this.error = 'Network Error: Fail to connet to server'
        } else if (error.response.data.error.includes('jwt')) {
          console.log('jwt error')
          this.$store.dispatch('resetUserInfo', true)
          this.$router.push('/login')
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.statusText)
          this.error = error.response.data.error
        }
      }
    },
    async saveDialog1 () {
      try {
        // Object.assign(this.items[this.editedIndex], this.editedItem)
        // await Product.updateProduct({
        //   '_id': this.items[this.editedIndex]._id,
        //   'UPC': this.items[this.editedIndex].UPC,
        //   'trNo': this.items[this.editedIndex].trackingNo,
        //   'orgNm': this.items[this.editedIndex].orgName,
        //   'qn': this.items[this.editedIndex].qn,
        //   'note': this.items[this.editedIndex].note,
        //   'prdNm': this.items[this.editedIndex].productName,
        //   'price': this.items[this.editedIndex].price * 100
        // })
        await Product.updateProduct({
          '_id': this.editedItem._id,
          'UPC': this.editedItem.UPC,
          'trNo': this.editedItem.trackingNo,
          'orgNm': this.editedItem.orgName,
          'qn': this.editedItem.qn,
          'note': this.editedItem.note,
          'prdNm': this.editedItem.productName,
          'price': this.editedItem.price * 100
        })
        this.changeFilter()
      } catch (error) {
        if (!error.response) {
          // network error
          this.error = 'Network Error: Fail to connet to server'
        } else if (error.response.data.error.includes('jwt')) {
          console.log('jwt error')
          this.$store.dispatch('resetUserInfo', true)
          this.$router.push('/login')
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.statusText)
          this.error = error.response.data.error
        }
      }
      this.closeDialog1()
    },
    async changeFilter () {
      this.error = null
      let result = new Date(this.startDate)
      result.setDate(result.getDate() + this.slider - 1)
      this.endDate = result.toISOString().split('T')[0]
      try {
        // result from inventory collection
        let invResDate = await Inventory.getByDates(this.startDate, this.endDate, this.orgName)
        this.items = invResDate.data
      } catch (error) {
        if (!error.response) {
          // network error
          this.error = 'Network Error: Fail to connet to server'
        } else if (error.response.data.error.includes('jwt')) {
          console.log('jwt error')
          this.$store.dispatch('resetUserInfo', true)
          this.$router.push('/login')
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.data.message)
          this.error = error.response.data.error
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
