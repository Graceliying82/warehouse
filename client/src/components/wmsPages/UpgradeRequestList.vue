<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-layout>
      <v-flex>
          <v-alert
            v-show = showAlert
            :type = alertType
            outline>
              {{message}}
            </v-alert>
        </v-flex>
    </v-layout>
    <v-dialog v-model="showAlertDialog" max-width="1000px">
      <v-card>
        <v-card-text>
            <h2 pt-8>{{message}}</h2>
        </v-card-text>
      </v-card>
    </v-dialog>
    <panel title="Upgrade Request List">
      <v-layout>
        <v-flex mx-5 sm2>
          <v-select
            :items ="ReqStatusChoice"
            v-model="statusFilter"
            label="Select Status Of Request"
            v-on:change="chooseCategory()"
            required></v-select>
        </v-flex>
      </v-layout>
      <v-layout column>
        <v-flex>
          <v-data-table
            :headers="headersUpgrade"
            :items="upgReqList"
            :rows-per-page-items="rowsPerPageItems"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <tr :style="props.item.urgent? 'color:red;': ''" @click.prevent="show(props.item)">
                <td class="text-xs-left">{{ props.item.taskID }}</td>
                <td class="text-xs-left">{{ props.item.urgent }}</td>
                <td class="text-xs-left">{{ props.item.orgNm }}</td>
                <td class="text-xs-left">{{ props.item.prdNm }}</td>
                <td class="text-xs-left">{{ props.item.pid }}</td>
                <td class="text-xs-left">{{ props.item.status }}</td>
                <td class="text-xs-left">{{ props.item.qty }}</td>
                <td class="text-xs-left">{{ props.item.targetUPC }}</td>
                <td class="text-xs-left">
                  <v-btn small color="teal" dark @click.prevent="cancel(props.item)">Cancel</v-btn>
                </td>
                <td class="text-xs-left">
                  <v-btn small color="teal" dark @click.prevent="batchPick(props.item)">Batch</v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
        <v-flex v-if=showChoseUPC>
          <v-card>
            <v-card-title class="title font-weight-light blue-grey lighten-5">
              <span style='margin-right:1.25em; display:inline-block;'>Task Detail:</span>
            </v-card-title>
            <v-layout>
              <p style='margin-left:2em;margin-top:2em;'><b>Task ID:&nbsp;</b>&nbsp;{{chosedItem.taskID}}&nbsp;&nbsp;&nbsp;&nbsp;</p>
              <p style='margin-left:2em;margin-top:2em;'><b>Target UPC:&nbsp;</b>&nbsp;{{chosedItem.targetUPC}}&nbsp;&nbsp;&nbsp;&nbsp;</p>
              <p style='margin-left:2em;margin-top:2em;'><b>Target pid:&nbsp;</b>&nbsp;{{chosedItem.pid}}&nbsp;&nbsp;&nbsp;&nbsp;</p>
              <p style='margin-left:2em;margin-top:2em;'><b>Product Name:&nbsp;</b>&nbsp;{{chosedItem.prdNm}}&nbsp;&nbsp;&nbsp;&nbsp;</p>
              <p style='margin-left:2em;margin-top:2em;'><b>Status:&nbsp;</b>&nbsp;{{chosedItem.status}}&nbsp;&nbsp;&nbsp;&nbsp;</p>
            </v-layout>
            <v-layout>
              <p style='margin-left:2em;'><b>Total Qty:&nbsp;</b>&nbsp;{{chosedItem.qty}}&nbsp;&nbsp;&nbsp;&nbsp;</p>
              <p style='margin-left:2em;'><b>Urgent:&nbsp;</b>&nbsp;{{chosedItem.urgent}}&nbsp;&nbsp;&nbsp;&nbsp;</p>
              <p style='margin-left:2em;'><b>Org Name:&nbsp;</b>&nbsp;{{chosedItem.orgNm}}&nbsp;&nbsp;&nbsp;&nbsp;</p>
              <p style='margin-left:2em;'><b>Tracking No:&nbsp;</b>&nbsp;{{chosedItem.trNo}}&nbsp;&nbsp;&nbsp;&nbsp;</p>
            </v-layout>
            <v-data-table
            :headers="headersBaseUPC"
            :items="chosedItem.baseUPCList"
            :rows-per-page-items="rowsPerPageItems"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <tr @click.prevent="showReqDetail(props.item)">
                <td class="text-xs-left">{{ props.item.pid }}</td>
                <td class="text-xs-left">{{ props.item.qty }}</td>
                <td class="text-xs-left">{{ props.item.UPC }}</td>
              </tr>
            </template>
          </v-data-table>
          <v-btn dark @click="finishUpgrade">Finish Task</v-btn>
          </v-card>
        </v-flex>
        <v-flex v-if=showBatchPick>
          <v-card>
            <v-card-title class="title font-weight-light blue-grey lighten-5">
              <span style='margin-right:1.25em; display:inline-block;'>Choose Tasks (less than 10) to plan a batch pick</span>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
    </panel>
  </div>
</template>

<script>
import Upgrade from '@/services/UpgradeService'
export default {
  data () {
    return {
      alertType: 'success',
      showAlert: false,
      message: '',
      showAlertDialog: false,
      showChoseUPC: false,
      showBatchPick: false,
      upgReqList: [],
      chosedItem: [],
      ReqStatusChoice: ['active', 'finish', 'cancel', 'all'],
      statusFilter: 'active',
      headersUpgrade: [
        { text: 'Task ID', align: 'left', value: 'taskID' },
        { text: 'Urgent', align: 'left', value: 'urgent' },
        { text: 'orgNm', align: 'left', value: 'orgNm' },
        { text: 'Product Name', align: 'left', value: 'prdNm' },
        { text: 'PID', align: 'left', value: 'pid' },
        { text: 'Status', align: 'left', value: 'status' },
        { text: 'Total Items', align: 'left', value: 'qty' },
        { text: 'Target UPC', align: 'left', value: 'targetUPC' },
        { text: 'Cancel Task', align: 'left', value: '_id' },
        { text: 'Batch Pick', align: 'left', value: '_id' }
      ],
      headersBaseUPC: [
        { text: 'PID', align: 'left', value: 'pid' },
        { text: 'Quantity', align: 'left', value: 'qty' },
        { text: 'Base UPC', align: 'left', value: 'UPC' }
      ],
      rowsPerPageItems: [15, 30, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 }]
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
    show (item) {
      this.showChoseUPC = true
      this.chosedItem = item
      // console.log(item)
    },
    async cancel (item) {
      if (item.status !== 'cancel') {
        try {
          await Upgrade.cancelUpgrade({'_id': item._id})
          await this.getUpgReqList()
          this.chosedItem = []
          this.showChoseUPC = false
          this.setAlertDialog('Done')
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
      } else {
        this.setAlertDialog('Can not cancel a canceled task.')
      }
    },
    async getUpgReqList () {
      try {
        if (this.statusFilter === 'all') {
          this.upgReqList = (await Upgrade.get()).data
        } else {
          this.upgReqList = (await Upgrade.getUpgByStatus(this.statusFilter)).data
        }
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
    chooseCategory () {
      this.clearAlert()
      this.getUpgReqList()
      this.chosedItem = []
      this.showChoseUPC = false
    },
    async finishUpgrade () {
      try {
        await Upgrade.finishUpgrade(this.chosedItem)
        await this.getUpgReqList()
        this.chosedItem = []
        this.showChoseUPC = false
        this.setAlertDialog('Done!')
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
    batchPick (item) {
      this.showChoseUPC = false
      this.showBatchPick = true
      if (!item.picked) {
        // Add item to batch list.
      }
      item.picked = true
    }
  },
  async mounted () {
    this.getUpgReqList()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
