<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-layout column>
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
      <panel title='Upgrade Requests Need Instructions'>
        <v-data-table
            :headers="headersNeedInstr"
            :items="needInstrList"
            :rows-per-page-items="rowsPerPageItems"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <tr @click.prevent="addInstruction(props.item)">
                <td class="text-xs-left">{{ props.item.fromUPC }}</td>
                <td class="text-xs-left">{{ props.item.toUPC }}</td>
              </tr>
            </template>
          </v-data-table>
      </panel>
      <v-flex>
        <v-card>
          <v-card-title class="title font-weight-light blue-grey lighten-5">
            <span style='margin-right:1.25em; display:inline-block;'>Search Instruction By From To UPCs</span>
          </v-card-title>
          <v-layout row>
            <v-flex xs6 ma-2>
              <v-text-field
                  label="From UPC"
                  v-model='fromUPCInput'
                ></v-text-field>
            </v-flex>
            <v-flex xs6 ma-2>
              <v-text-field
                  label="To UPC"
                  v-model='toUPCInput'
                ></v-text-field>
            </v-flex>
            <v-btn dark @click.prevent="findInstructionByFromTo">find</v-btn>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex v-if=showInstructions mt-3>
        <v-card>
          <v-card-title class="title font-weight-light blue-grey lighten-5">
            <span style='margin-right:1.25em; display:inline-block;'>Add Instructions</span>
          </v-card-title>
          <v-layout row>
            <v-flex xs6 ma-2>
              <v-text-field
                  label="From UPC"
                  v-model='upIns.fromUPC'
                  outline
                  readonly
                ></v-text-field>
            </v-flex>
            <v-flex xs6 ma-2>
              <v-text-field
                  label="To UPC"
                  v-model='upIns.toUPC'
                  outline
                  readonly
                ></v-text-field>
            </v-flex>
          </v-layout>
          <v-flex mx-2>
            <v-textarea
              label="Required Parts"
              v-model='upIns.reqParts'
              outline
              counter =  500
            ></v-textarea>
          </v-flex>
          <v-flex mx-2>
            <v-textarea
              label="Took off Parts"
              v-model='upIns.offParts'
              outline
              counter =  500
            ></v-textarea>
          </v-flex>
          <v-flex mx-2>
            <v-textarea
              label="Steps"
              v-model='upIns.steps'
              outline
              counter =  1000
            ></v-textarea>
          </v-flex>
          <v-flex mx-2>
            <v-textarea
              label="Note"
              v-model='upIns.note'
              outline
              counter =  1000
            ></v-textarea>
          </v-flex>
          <v-btn dark @click.prevent="submit()">Submit</v-btn>
          <v-btn dark @click.prevent='clearInstruction()'>Clear</v-btn>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Upgrade from '@/services/UpgradeService'
import Product from '@/services/ProductService'
import Instruction from '@/services/InstructionService'
export default {
  data () {
    return {
      alertType: 'success',
      showAlert: false,
      message: '',
      showAlertDialog: false,
      showInstructions: false,
      fromUPCInput: '',
      toUPCInput: '',
      headersNeedInstr: [
        { text: 'From UPC', align: 'left', value: 'fromUPC' },
        { text: 'To UPC', align: 'left', value: 'toUPC' }
      ],
      needInstrList: [],
      rowsPerPageItems: [10, 20, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 }],
      upIns: {
        toUPC: '',
        fromUPC: '',
        reqParts: '',
        offParts: '',
        steps: '',
        note: ''
      }
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
    clearInstruction () {
      this.upIns.reqParts = ''
      this.upIns.offParts = ''
      this.upIns.steps = ''
      this.upIns.note = ''
    },
    async getUpdPrdNeedInstr () {
      // call the server to get products which needs update instructions
      try {
        this.setAlertDialog('This request may take a while')
        this.needInstrList = (await Upgrade.getUpdPrdNeedInstr()).data
        this.showAlertDialog = false
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
    async findInstructionByFromTo () {
      try {
        if ((this.toUPCInput === '') || (this.fromUPCInput === '')) {
          this.setAlertDialog('Invalide input')
          return
        }
        this.upIns.toUPC = this.toUPCInput.trim()
        this.upIns.fromUPC = this.fromUPCInput.trim()
        this.toUPCInput = ''
        this.fromUPCInput = ''
        let result = (await Instruction.getByID({
          'toUPC': this.upIns.toUPC,
          'fromUPC': this.upIns.fromUPC
        })).data
        if (result) {
          this.upIns.reqParts = result.reqParts
          this.upIns.offParts = result.offParts
          this.upIns.steps = result.steps
          this.upIns.note = result.note
        } else {
          this.setAlertDialog('Instruction Not Existed.')
        }
        this.showInstructions = true
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
    addInstruction (item) {
      this.showInstructions = true
      this.upIns.fromUPC = item.fromUPC
      this.upIns.toUPC = item.toUPC
      this.clearInstruction()
    },
    async submit () {
      try {
        this.showAlert = false
        let toPrd = (await Product.getProductByUPC(this.upIns.toUPC)).data
        let fromPrd = (await Product.getProductByUPC(this.upIns.fromUPC)).data
        if (!toPrd) {
          this.setAlertDialog('UPC ' + this.upIns.toUPC + ' Not found!')
        } else if (!fromPrd) {
          this.setAlertDialog('UPC ' + this.upIns.fromUPC + ' Not found!')
        } else {
          await Instruction.post(this.upIns)
          await this.getUpdPrdNeedInstr()
          this.setAlertDialog('Done')
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
    }
  },
  async mounted () {
    this.getUpdPrdNeedInstr()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
