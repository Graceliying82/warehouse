<template>
  <div>
    <panel title = 'Receiving Records'>
      <v-card>
        <v-layout>
          <v-flex >
            <span
            class="title font-weight-light"
            v-text="slider"
            ></span>
           <span class="subheading font-weight-light mr-1">Days</span>
            <v-slider
              v-model="slider"
              :min="1"
              :max="30"
              label="Days to show"
              light
              thumb-label
              hint="Show or download maximum 30 days' data"
              persistent-hint=true
            ></v-slider>
          </v-flex>
          <v-flex offset-xs1>
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
                v-model="date"
                label="Choose a start Date"
                prepend-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker
                v-model="date"
                @input="menu = false">
              </v-date-picker>
            </v-menu>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex offset-xs6>
            <download-excel
                class   = "v-btn"
                type    = "csv"
                name    = "inventoryReceive.xls"
                :data   = "items"
                :fields = "json_fields"
                >
                Download
            </download-excel>
          </v-flex>
        </v-layout>
        <v-card-title>
        <v-spacer></v-spacer>
          <v-flex offset-sm6>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
            ></v-text-field>
          </v-flex>
        </v-card-title>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-text>
                  <h1 pt-8>Modify Record</h1>
                <v-container grid-list-md>
                  <v-layout column>
                    <v-flex>
                      <v-text-field label="TrackingNo"
                      readonly
                      hint="Readonly"
                      box
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
                      readonly
                      hint="Readonly"
                      box
                      v-model="editedItem.orgName">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md4>
                      <v-text-field label="Quantity"
                      readonly
                      hint="Readonly"
                      box
                      v-model="editedItem.qn">
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
                    v-model="editedItem.price">
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
                <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
                <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
              </td>
            </template>
            <template slot="no-data">
              <v-btn color="primary" @click="initialize">Reset</v-btn>
            </template>
          </v-data-table>
      </v-card>
    </panel>
  </div>
</template>

<script>
import Inventory from '@/services/inventory'

export default {
  data () {
    return {
      currentDate: new Date().toISOString().substr(0, 10),
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      slider: 1,
      dialog: false,
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
        'Orgization Name': 'orgName',
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
    dialog (val) {
      val || this.close()
    }
  },
  created () {
    this.initialize()
  },
  methods: {
    async initialize () {
      try {
        // result from inventory collection
        const invRes = await Inventory.get()
        this.items = invRes.data
      } catch (error) {
        console.log(error)
      }
    },
    editItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem)
      } else {
        this.items.push(this.editedItem)
      }
      this.close()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
