<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-layout column>
    <v-layout>
        <v-flex>
            <v-alert
              v-show = "showAlert"
              :type = "alertType"
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
      <v-layout>
        <v-select
          :items="actionChoice"
          v-model="action"
          label="Please Choose What to Do"
          @change="changeAction()"
          required></v-select>
      </v-layout>
      <panel title='Upgrade Requests Need Instructions' v-if=showAction0>
        <v-data-table
            :headers="headersNeedInstr"
            :items="needInstrList"
            :rows-per-page-items="rowsPerPageItems"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <tr @click="addInstruction(props.item)">
                <td class="text-xs-left">{{ props.item.fromUPC }}</td>
                <td class="text-xs-left">{{ props.item.toUPC }}</td>
              </tr>
            </template>
          </v-data-table>
      </panel>
      <v-flex v-if=showAction1>
        <panel title='Search Instruction By From To UPCs'>
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
            <v-btn dark @click="findInstructionByFromTo">find</v-btn>
          </v-layout>
        </panel>
      </v-flex>
      <v-flex v-if=showAction2>
        <panel title='Get Instruction Lists'>
          <v-data-table
            :headers="headersInstr"
            :items="instrList"
            :rows-per-page-items="rowsPerPageItems"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <tr @click="getInstruction(props.item)">
                <td class="text-xs-left">{{ props.item._id.fromUPC }}</td>
                <td class="text-xs-left">{{ props.item._id.toUPC }}</td>
              </tr>
            </template>
          </v-data-table>
        </panel>
      </v-flex>
      <v-flex v-if=showInstruction mt-3>
        <v-card>
          <v-card-title class="title font-weight-light blue-grey lighten-5">
            <span style='margin-right:1.25em; display:inline-block;'>Information about Base and Target computer</span>
          </v-card-title>
          <v-layout row>
            <v-flex xs6 ma-2>
              <v-text-field
                  label="Base UPC"
                  v-model='upIns.fromUPC'
                  outline
                  readonly
                ></v-text-field>
            </v-flex>
            <v-flex xs6 ma-2>
              <v-text-field
                  label="Target UPC"
                  v-model='upIns.toUPC'
                  readonly
                  box
                ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs6 mx-2>
              <v-text-field
                  label="Base HD1 Size Info"
                  v-model='fromCompSpec.hd1Size'
                  outline
                  readonly
                ></v-text-field>
            </v-flex>
            <v-flex xs6 mx-2>
              <v-text-field
                  label="Target HD1 Size Info"
                  v-model='toCompSpec.hd1Size'
                  box
                  readonly
                ></v-text-field>
            </v-flex>
            <v-flex xs6 mx-2>
              <v-text-field
                  label="Base HD1 Type Info"
                  v-model='fromCompSpec.hd1Type'
                  outline
                  readonly
                ></v-text-field>
            </v-flex>
            <v-flex xs6 mx-2>
              <v-text-field
                  label="Target HD1 Type Info"
                  v-model='toCompSpec.hd1Type'
                  box
                  readonly
                ></v-text-field>
            </v-flex>
                        <v-flex xs6 mx-2>
              <v-text-field
                  label="Base HD2 Size Info"
                  v-model='fromCompSpec.hd2Size'
                  outline
                  readonly
                ></v-text-field>
              </v-flex>
              <v-flex xs6 mx-2>
                <v-text-field
                    label="Target HD2 Size Info"
                    v-model='toCompSpec.hd2Size'
                    box
                    readonly
                  ></v-text-field>
              </v-flex>
              <v-flex xs6 mx-2>
                <v-text-field
                    label="Base HD2 Type Info"
                    v-model='fromCompSpec.hd2Type'
                    outline
                    readonly
                  ></v-text-field>
              </v-flex>
              <v-flex xs6 mx-2>
                <v-text-field
                    label="Target HD2 Type Info"
                    v-model='toCompSpec.hd2Type'
                    box
                    readonly
                  ></v-text-field>
              </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs6 mx-2>
              <v-text-field
                  label="Base Ram Size Info"
                  v-model='fromCompSpec.ramSz'
                  outline
                  readonly
                ></v-text-field>
            </v-flex>
            <v-flex xs6 mx-2>
              <v-text-field
                  label="Target Ram Size Info"
                  v-model='toCompSpec.ramSz'
                  box
                  readonly
                ></v-text-field>
            </v-flex>
            <v-flex xs6 mx-2>
              <v-text-field
                  label="Base Ram Type Info"
                  v-model='fromCompSpec.ramType'
                  outline
                  readonly
                ></v-text-field>
            </v-flex>
            <v-flex xs6 mx-2>
              <v-text-field
                  label="Target Ram Type Info"
                  v-model='toCompSpec.ramType'
                  box
                  readonly
                ></v-text-field>
            </v-flex>
            <v-flex xs6 mx-2>
              <v-text-field
                  label="Base Caddy Info"
                  v-model='fromCompSpec.caddy'
                  outline
                  readonly
                ></v-text-field>
            </v-flex>
            <v-flex xs6 mx-2>
              <v-text-field
                  label="Target Caddy Info"
                  v-model='toCompSpec.caddy'
                  box
                  readonly
                ></v-text-field>
            </v-flex>
             <v-flex xs6 mx-2>
              <v-text-field
                  label="Base DVD Info"
                  v-model='fromCompSpec.dvd'
                  outline
                  readonly
                ></v-text-field>
            </v-flex>
            <v-flex xs6 mx-2>
              <v-text-field
                  label="Target DVD Info"
                  v-model='toCompSpec.dvd'
                  box
                  readonly
                ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs2 mx-2>
              <v-text-field
                  label="Base OS Info"
                  v-model='fromCompSpec.optSys'
                  outline
                  readonly
                ></v-text-field>
            </v-flex>
            <v-flex xs2 mx-2>
              <v-text-field
                  label="Target OS Info"
                  v-model='toCompSpec.optSys'
                  box
                  readonly
                ></v-text-field>
            </v-flex>
            <v-flex xs4 mx-2>
              <v-textarea
                  label="Base note info"
                  v-model='fromPrd.note'
                  outline
                  readonly
                ></v-textarea>
            </v-flex>
            <v-flex xs4 mx-2>
              <v-textarea
                  label="Target note Info"
                  v-model='toPrd.note'
                  box
                  readonly
                ></v-textarea>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex v-if=showInstruction mt-3>
        <v-card>
          <v-card-title class="title font-weight-light blue-grey lighten-5">
            <span style='margin-right:1.25em; display:inline-block;'>Create Instructions</span>
          </v-card-title>
          <v-layout row mt-5>
            <v-flex mx-2>
              <v-select
                :items="partsSelection"
                v-model="selectPart"
                label="Part"
                outline
                ></v-select>
            </v-flex>
            <v-flex mx-2 xs2>
              <v-layout row>
                <v-btn icon big class="mx-0" @click="selectQty += 1">
                  <v-icon color="teal">add_circle</v-icon>
                </v-btn>
                  <v-flex>
                    <v-text-field
                      label="Qty"
                      v-model.number="selectQty"
                      box></v-text-field>
                  </v-flex>
                <v-btn v-if="$store.state.isSupervisor" icon class="mx-0" @click="selectQty -= 1">
                  <v-icon color="teal">remove_circle</v-icon>
                </v-btn>
                <v-btn dark @click="addParts()">Add</v-btn>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout row mx-2>
            <v-select
              :items="stepsSelection"
              v-model="selectStep"
              outline
              label="Step">
            </v-select>
            <v-btn dark @click="addSteps()">Add</v-btn>
          </v-layout>
          <v-layout row mx-2>
            <v-flex mr-2>
              <v-toolbar flat color="white">
                <v-toolbar-title>Add Parts</v-toolbar-title>
              </v-toolbar>
              <v-data-table
                :items="upIns.reqParts"
                class="elevation-1"
                :headers = "headersPart"
                :rows-per-page-items="rowsPerPageItems"
              >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">{{ props.item.name }}</td>
                  <td class="text-xs-left">{{ props.item.qty }}</td>
                  <td class="text-xs-left">
                    <v-btn icon class="mx-0" @click="deletePart(upIns.reqParts, props.item)">
                      <v-icon color="teal">delete_forever</v-icon>
                    </v-btn>
                  </td>
                </template>
              </v-data-table>
            </v-flex>
            <v-flex ml-2>
              <v-toolbar flat color="white">
                <v-toolbar-title>Remove Parts</v-toolbar-title>
              </v-toolbar>
              <v-data-table
                :items="upIns.offParts"
                class="elevation-1"
                :headers = "headersPart"
                :rows-per-page-items="rowsPerPageItems"
              >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">{{ props.item.name }}</td>
                  <td class="text-xs-left">{{ props.item.qty }}</td>
                  <td class="text-xs-left">
                    <v-btn icon class="mx-0" @click="deletePart(upIns.offParts, props.item)">
                      <v-icon color="teal">delete_forever</v-icon>
                    </v-btn>
                  </td>
                </template>
              </v-data-table>
            </v-flex>
          </v-layout>
          <v-flex mt-2>
            <v-textarea
              label="Steps"
              v-model="upIns.steps"
              outline
              counter =  5000>
            </v-textarea>
          </v-flex>
          <v-flex>
            <v-textarea
              label="Note"
              v-model="upIns.note"
              outline
              counter =  5000>
            </v-textarea>
          </v-flex>
          <v-btn dark @click="submit()">Submit</v-btn>
          <v-btn dark @click='clearInstruction()'>Clear</v-btn>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Upgrade from '@/services/UpgradeService'
import Product from '@/services/ProductService'
import Instruction from '@/services/InstructionService'
import Tempschema from '@/services/TempschemaService'
export default {
  data () {
    return {
      alertType: 'success',
      showAlert: false,
      message: '',
      showAlertDialog: false,
      showAction0: true,
      showAction1: false,
      showAction2: false,
      showInstruction: false,
      fromUPCInput: '',
      toUPCInput: '',
      headersNeedInstr: [
        { text: 'From UPC', align: 'left', value: 'fromUPC' },
        { text: 'To UPC', align: 'left', value: 'toUPC' }
      ],
      headersPart: [
        { text: 'Name', align: 'left', value: 'name' },
        { text: 'Qty', align: 'left', value: 'qty' },
        { text: 'Action', align: 'left', value: 'name' }
      ],
      headersInstr: [
        { text: 'From UPC', align: 'left', value: '_id.fromUPC' },
        { text: 'To UPC', align: 'left', value: '_id.toUPC' }
      ],
      needInstrList: [],
      instrList: [],
      actionChoice: [
        'Show Upgrade Request Need Instrunctions',
        'Search Instruction By From To UPCs',
        'Get Instruction Lists'],
      action: '',
      rowsPerPageItems: [10, 20, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 }],
      upIns: {
        toUPC: '',
        fromUPC: '',
        reqParts: [],
        offParts: [],
        steps: '',
        note: ''
      },
      fromPrd: '',
      toPrd: '',
      fromCompSpec: '',
      toCompSpec: '',
      // items for add instructions
      partsSelection: [],
      selectPart: '',
      selectQty: 0,
      stepsSelection: [],
      selectStep: ''
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
      this.clearAlert()
      this.upIns.reqParts = []
      this.upIns.offParts = []
      this.upIns.steps = ''
      this.upIns.note = ''
    },
    clearSelectUPC () {
      this.upIns.fromUPC = ''
      this.upIns.toUPC = ''
      this.fromPrd = ''
      this.toPrd = ''
      this.fromCompSpec = ''
      this.toCompSpec = ''
    },
    clearShows () {
      this.showAction0 = false
      this.showAction1 = false
      this.showAction2 = false
    },
    deletePart (list, item) {
      const index = list.indexOf(item)
      confirm('Are you sure you want to delete this item?') && list.splice(index, 1)
      console.log(list)
      // this.$forceUpdate()
    },
    async getSchemaData () {
      try {
        this.partsSelection = (await Tempschema.getByID('part')).data.value
        this.stepsSelection = (await Tempschema.getByID('step')).data.value
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
    async getInstructionList () {
      try {
        this.instrList = (await Instruction.get()).data
        // console.log(this.instrList)
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
    changeAction () {
      this.clearShows()
      this.clearInstruction()
      this.clearSelectUPC()
      this.clearAlert()
      if (this.action === this.actionChoice[0]) {
        this.showAction0 = true
        this.showAction1 = false
        this.showAction2 = false
      } else if (this.action === this.actionChoice[1]) {
        this.showAction1 = true
        this.showAction0 = false
        this.showAction2 = false
      } else if (this.action === this.actionChoice[2]) {
        this.showAction2 = true
        this.showAction0 = false
        this.showAction1 = false
        this.getInstructionList()
      }
    },
    addParts () {
      if (this.selectQty > 0) {
        this.upIns.reqParts.push({
          'name': this.selectPart,
          'qty': this.selectQty
        })
      } else if (this.selectQty < 0) {
        this.upIns.offParts.push({
          'name': this.selectPart,
          'qty': this.selectQty
        })
      }
    },
    addSteps () {
      this.upIns.steps += this.selectStep + '\n'
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
        this.getCompSpec()
        this.showInstruction = true
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
    async getCompSpec () {
      try {
        let fromData = (await Product.getProductByUPC(this.upIns.fromUPC)).data
        let toData = (await Product.getProductByUPC(this.upIns.toUPC)).data
        if ((fromData.cat !== 'Computer') || (toData.cat !== 'Computer')) {
          this.setAlertDialog('Input wrong products. Please check!')
        } else {
          this.fromPrd = fromData
          this.toPrd = toData
          this.fromCompSpec = this.fromPrd.compSpec
          this.toCompSpec = this.toPrd.compSpec
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
    async addInstruction (item) {
      this.showInstruction = true
      this.upIns.fromUPC = item.fromUPC
      this.upIns.toUPC = item.toUPC
      this.clearInstruction()
      this.getCompSpec()
    },
    getInstruction (item) {
      this.showInstruction = true
      this.upIns.fromUPC = item._id.fromUPC
      this.upIns.toUPC = item._id.toUPC
      this.upIns.reqParts = item.reqParts
      this.upIns.offParts = item.offParts
      this.upIns.steps = item.steps
      this.upIns.note = item.note
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
    this.getSchemaData()
    this.action = this.actionChoice[0]
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
