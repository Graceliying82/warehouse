<template>
  <div>
    <panel title = 'Receiving Records'>
      <v-card>
        <v-card-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
        ></v-text-field>
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
export default {
  data () {
    return {
      dialog: false,
      search: '',
      headers: [
        {
          text: 'CreateTime',
          align: 'left',
          value: 'createTime'
        },
        { text: 'TrackingNo', value: 'trackingNo', sortable: false },
        { text: 'ProductName', value: 'productName' },
        { text: 'UPC', value: 'UPC', sortable: false },
        { text: 'OrgName', value: 'orgName' },
        { text: 'Price', value: 'price' },
        { text: 'Quantity', value: 'qn', sortable: false },
        { text: 'Actions', value: 'id', sortable: false }
      ],
      items: [],
      editedIndex: -1,
      editedItem: {
        createTime: '',
        trackingNo: '',
        orgName: '',
        productName: '',
        UPC: '',
        price: 0,
        qn: 0,
        id: '',
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
        id: '',
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
    initialize () {
      this.items = [
        {
          createTime: 'Thu Nov 15 2018 11:26:55',
          trackingNo: '9102805213683062123455',
          orgName: 'D',
          productName: 'ABCD',
          UPC: '744120875512',
          price: 0,
          qn: 5,
          id: '5bed9e4f664330297cfd2131',
          note: ''
        },
        {
          createTime: 'Thu Nov 16 2018 11:26:55',
          trackingNo: '9102805213683062123455',
          orgName: 'A',
          productName: 'EFGH',
          UPC: '744120875512',
          price: 0,
          qn: 4,
          id: '5bed9e4f664330297cfd2132',
          note: ''
        },
        {
          createTime: 'Thu Nov 17 2018 11:26:55',
          trackingNo: '9102805213683062123455',
          orgName: 'B',
          productName: 'XYZ',
          UPC: '744120875512',
          price: 0,
          qn: 3,
          id: '5bed9e4f664330297cfd2133',
          note: ''
        },
        {
          createTime: 'Thu Nov 15 2018 11:26:55',
          trackingNo: '9102805213683062123454',
          orgName: 'C',
          productName: 'asdfsd',
          UPC: '744120875512',
          price: 240,
          qn: 6,
          id: '5bed9e4f664330297cfd2134',
          note: ''
        },
        {
          createTime: 'Thu Nov 18 2018 11:26:55',
          trackingNo: '9102805213683062123455',
          orgName: 'D',
          productName: 'ewrwe',
          UPC: '744120875512',
          price: 0,
          qn: 7,
          id: '5bed9e4f664330297cfd2135',
          note: ''
        },
        {
          createTime: 'Thu Nov 19 2018 11:26:55',
          trackingNo: '9102805213683062123455',
          orgName: 'D',
          productName: '',
          UPC: '744120875512',
          price: 120,
          qn: 8,
          id: '5bed9e4f664330297cfd2136',
          note: ''
        }
      ]
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
