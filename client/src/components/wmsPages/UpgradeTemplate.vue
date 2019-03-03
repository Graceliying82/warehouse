<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-layout column mx-2>
      <v-flex xs8>
          <v-alert
            v-show = showAlert1
            :type = alertType1
            outline>
              {{message1}}
            </v-alert>
        </v-flex>
      <!-- Create a New Template -->
      <v-layout>
        <v-flex my-5>
          <panel  title='Create a New Template'>
            <v-flex xs6>
              <v-layout mx-2>
                <v-text-field
                  label="UPC for upgrade template"
                  v-model="UPCInput"
                  id="UPC"
                  clearable
                ></v-text-field>
                <v-btn dark @click="find()">Find</v-btn>
              </v-layout>
            </v-flex>
            <!--Detail Information -->
            <v-layout v-if=showDetail column>
              <v-layout row>
                <v-flex mx-2 xs12 sm4>
                  <v-text-field
                    v-model="newPrdBasic.UPC"
                    label="Original UPC"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex mx-2 xs12 sm4>
                  <v-text-field
                    v-model="newPrdBasic.prdNm"
                    label="Product Name"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex mx-2 xs12 sm8>
                  <v-text-field
                    v-model="newPrdBasic.newUPC"
                    label="Generated UPC"
                    readonly
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <!-- Customizable Part-->
              <v-layout column>
                <!-- First Row-->
                <v-layout row>
                  <v-flex xs12 sm4>
                    <v-text-field
                      v-model="computerSpec.ramType"
                      label="Original Ram Type"
                      readonly
                      box
                    ></v-text-field>
                    <v-select
                      :items ="SchemaDBValues['ramType']"
                      v-model="SchemaValueChoosed['ramType']"
                      label="Choose Upgrade Ram Type"
                      required
                      outline></v-select>
                  </v-flex>
                  <v-flex xs12 sm4 offset-sm1>
                    <v-text-field
                      v-model="computerSpec.ramSz"
                      label="Original Ram size"
                      readonly
                      box
                    ></v-text-field>
                    <v-select
                      :items ="SchemaDBValues['ramSz']"
                      v-model="SchemaValueChoosed['ramSz']"
                      label="Choose Upgrade Ram Size"
                      required
                      outline></v-select>
                  </v-flex>
                  <v-flex xs12 sm4 offset-sm1>
                    <v-text-field
                      v-model="computerSpec.optSys"
                      label="Original operation System"
                      readonly
                      box
                    ></v-text-field>
                    <v-select
                      :items ="SchemaDBValues['optSys']"
                      v-model="SchemaValueChoosed['optSys']"
                      label="Choose Upgrade OS"
                      required
                      outline></v-select>
                  </v-flex>
                </v-layout>
                <!-- Second Row-->
                <v-layout row>
                  <v-flex xs12 sm4>
                    <v-text-field
                      v-model="computerSpec.dvd"
                      label="Original DVD"
                      required
                      readonly
                      box
                    ></v-text-field>
                    <v-select
                      :items ="SchemaDBValues['dvd']"
                      v-model="SchemaValueChoosed['dvd']"
                      label="Yes for install/No for uninstall "
                      required
                      outline></v-select>
                </v-flex>
                  <v-flex xs12 sm4 offset-sm1>
                    <v-text-field
                      v-model="computerSpec.caddy"
                      label="Original Caddy"
                      required
                      readonly
                      box
                    ></v-text-field>
                    <v-select
                      :items ="SchemaDBValues['caddy']"
                      v-model="SchemaValueChoosed['caddy']"
                      label="Yes for install/No for uninstall "
                      required
                      outline></v-select>
                  </v-flex>
                  <v-flex xs12 sm4 offset-sm1>
                    <v-text-field
                      v-model="computerSpec.sdSize"
                      label="Original Sd Card Size"
                      readonly
                      box
                    ></v-text-field>
                    <v-select
                      :items ="SchemaDBValues['sdSize']"
                      v-model="SchemaValueChoosed['sdSize']"
                      label="Choose Upgrade SD size"
                      required
                      outline></v-select>
                  </v-flex>
                </v-layout>
                <!-- Second Row-->
                <v-layout row >
                  <v-flex sm12 md3>
                    <v-text-field
                      v-model="computerSpec.hd1Type"
                      label="Original HD1 Type"
                      required
                      readonly
                      box
                    ></v-text-field>
                    <v-select
                      :items ="SchemaDBValues['hdType']"
                      v-model="SchemaValueChoosed['hd1Type']"
                      label="Upgrade HD1 type"
                      required
                      outline></v-select>
                  </v-flex>
                  <v-flex sm12 md3 mx-2>
                    <v-text-field
                      v-model="computerSpec.hd1Size"
                      label="Original HD1 Size"
                      required
                      readonly
                      box
                    ></v-text-field>
                    <v-select
                      :items ="SchemaDBValues['hdSize']"
                      v-model="SchemaValueChoosed['hd1Size']"
                      label="Upgrade HD1 Size"
                      required
                      outline></v-select>
                  </v-flex>
                  <v-flex sm12 md3 mx-2>
                    <v-text-field
                      v-model="computerSpec.hd2Type"
                      label="Original HD2 Type"
                      required
                      readonly
                      box
                    ></v-text-field>
                    <v-select
                      :items ="SchemaDBValues['hdType']"
                      v-model="SchemaValueChoosed['hd2Type']"
                      label="Upgrade HD2 type"
                      required
                      outline></v-select>
                  </v-flex>
                  <v-flex sm12 md3>
                    <v-text-field
                      v-model="computerSpec.hd2Size"
                      label="Original HD2 Size"
                      required
                      readonly
                      box
                    ></v-text-field>
                    <v-select
                      :items ="SchemaDBValues['hdSize']"
                      v-model="SchemaValueChoosed['hd2Size']"
                      label="Upgrade HD2 Size"
                      required
                      outline></v-select>
                  </v-flex>
                </v-layout>
                <!-- Required Parts -->
                <v-flex>
                  <v-textarea
                    label="Required Parts"
                    v-model="SchemaValueChoosed['reqParts']"
                    outline
                    counter =  5000>
                  </v-textarea>
                </v-flex>
                <!-- Disassembled Parts -->
                <v-flex>
                  <v-textarea
                    label="Disassembled Parts"
                    v-model="SchemaValueChoosed['disbParts']"
                    outline
                    counter =  5000>
                  </v-textarea>
                </v-flex>
                <!-- Instructions and Steps-->
                <v-flex>
                  <v-textarea
                    label="Instructions and Steps"
                    v-model="SchemaValueChoosed['instuct']"
                    outline
                    counter =  5000>
                  </v-textarea>
                </v-flex>
                <v-flex>
                  <v-btn dark @click.prevent="generate()">Generate</v-btn>
                  <v-btn dark>Reset</v-btn>
                </v-flex>
              </v-layout>
            </v-layout>
          </panel>
        </v-flex>
      </v-layout>
      <!-- Modify Template Parameter -->
      <v-layout>
        <v-flex>
          <panel  title='Modify Template Schema'>
            <v-layout row>
              <v-flex mx-2 sm4>
                <v-select
                :items ="SchemaHeader"
                v-model="schemaSelect"
                label="Select a schema parameter to work with"
                v-on:change="chooseCategory()"
                required></v-select>
              </v-flex>
              <v-flex>
                <v-text-field
                    label="Add a choice"
                    v-model="paraChoice"
                    clearable
                  ></v-text-field>
              </v-flex>
              <v-btn dark @click.prevent="addChoice">Add</v-btn>
            </v-layout>
            <v-layout column  align-start mx-2>
              <v-flex class="font-italic font-weight-bold subheading">
                Values:
              </v-flex>
              <v-flex xs1
                v-for="aSchema in schemaValues"
                class="font-italic font-weight-regular subheading"
                :key="aSchema">
                {{aSchema}}
                <v-btn icon>
                  <v-icon color="teal" @click.prevent="deleteSchema(aSchema)">highlight_off</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </panel>
        </v-flex>
      </v-layout>
    </v-layout>
  </div>
</template>

<script>
import Product from '@/services/Product'
import Tempschema from '@/services/Tempschema'
export default {
  data () {
    return {
      alertType1: 'success',
      showAlert1: false,
      message1: '',
      UPCInput: '',
      showDetail: false,
      newPrdBasic: {
        UPC: '',
        prdNm: '',
        newUPC: ''
      },
      prdBasic: {},
      computerSpec: '',
      templateSchema: {},
      schemaSelect: '',
      paraChoice: '',
      schemaValues: [],
      SchemaHeader: ['Ram Type', 'Ram Size', 'OS', 'SD Card Size', 'HD Type', 'HD Size', 'Category', 'Color'],
      SchemaDBName: ['ramType', 'ramSz', 'optSys', 'sdSize', 'hdType', 'hdSize', 'cat', 'color'],
      SchemaDBValues: {
        'ramType': [],
        'ramSz': [],
        'optSys': [],
        'dvd': ['Yes', 'No'],
        'caddy': ['Yes', 'No'],
        'sdSize': [],
        'hdType': [],
        'hdSize': [],
        'cat': [],
        'color': []
      },
      SchemaValueChoosed: {
        'ramType': '',
        'ramSz': '',
        'optSys': '',
        'dvd': '',
        'caddy': '',
        'sdSize': '',
        'hd1Type': '',
        'hd1Size': '',
        'hd2Type': '',
        'hd2Size': '',
        'cat': '',
        'reqParts': '', // required parts
        'disbParts': '', // Disassembled parts
        'instuct': '' // instructions and steps
      }
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
    async find () {
      this.clearAlert()
      if (this.UPCInput === '') {
        this.setAlert('error', 'UPC is required.')
      } else {
        try {
          let result = (await Product.getProductByUPC(this.UPCInput)).data
          this.UPCInput = ''
          if ((result === '') || (result === null) || (result === undefined)) {
            this.setAlert('error', 'UPC not found.')
          } else {
            this.showDetail = true
            this.newPrdBasic.UPC = result._id
            this.newPrdBasic.prdNm = result.prdNm
            this.prdBasic = result
            if ((result.cstmiz === true) && (result.cat === 'Computer')) {
              this.computerSpec = result.compSpec
            } else {
              this.setAlert('error', 'Not a customizable product! Please check')
            }
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
    async chooseCategory () {
      try {
        if (this.schemaSelect !== '') {
          let idx = this.SchemaHeader.indexOf(this.schemaSelect)
          let result = (await Tempschema.getByID(this.SchemaDBName[idx])).data
          if (result) {
            this.schemaValues = result.value
          } else {
            this.schemaValues = []
          }
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
    async addChoice () {
      try {
        if (this.schemaSelect === '') {
          this.setAlert('error', 'Please select a schema parameter first!')
        } else {
          let idx = this.SchemaHeader.indexOf(this.schemaSelect)
          let id = this.SchemaDBName[idx]
          let value = this.paraChoice.trim()
          await Tempschema.post({
            'schema': [{
              '_id': id,
              'value': [value]
            }]
          })
          this.paraChoice = ''
          this.setAlert('success', 'Successfully added a new Choice')
          this.chooseCategory()
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
    async deleteSchema (aSchema) {
      try {
        if (this.schemaSelect === '') {
          this.setAlert('error', 'Please select a schema parameter first.')
        } else {
          let idx = this.SchemaHeader.indexOf(this.schemaSelect)
          let id = this.SchemaDBName[idx]
          await Tempschema.deleteSchemaValue({
            '_id': id,
            'value': aSchema
          })
          await this.chooseCategory()
          this.setAlert('success', 'Schema Parameter deleted.')
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
    async getSchemaDBValues () {
      try {
        for (let aSchNm of this.SchemaDBName) {
          let result = (await Tempschema.getByID(aSchNm)).data
          this.SchemaDBValues[aSchNm] = result.value
          // console.log(aSchNm)
          // console.log(this.SchemaDBValues[aSchNm])
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
    prepareNewPrd () {
      if (this.newPrdBasic.UPC === '') {
        this.setAlert('error', 'Original UPC is required')
      } else {
        let aUPC = this.newPrdBasic.UPC
        if ((this.SchemaValueChoosed['ramType'] !== '') && (this.SchemaValueChoosed['ramSz'] !== '')) {
          aUPC = aUPC + '-' + this.SchemaValueChoosed['ramType'] + this.SchemaValueChoosed['ramSz']
          this.prdBasic.compSpec.ramType = this.SchemaValueChoosed['ramType']
          this.prdBasic.compSpec.ramSz = this.SchemaValueChoosed['ramSz']
        }
        if ((this.SchemaValueChoosed['hd1Type'] !== '') && (this.SchemaValueChoosed['hd1Size'] !== '')) {
          aUPC = aUPC + '-hd1' + this.SchemaValueChoosed['hd1Type'] + this.SchemaValueChoosed['hd1Size']
          this.prdBasic.compSpec.hd1Type = this.SchemaValueChoosed['hd1Type']
          this.prdBasic.compSpec.hd1Size = this.SchemaValueChoosed['hd1Size']
        }
        if ((this.SchemaValueChoosed['hd2Type'] !== '') && (this.SchemaValueChoosed['hd2Size'] !== '')) {
          aUPC = aUPC + '-hd2' + this.SchemaValueChoosed['hd2Type'] + this.SchemaValueChoosed['hd2Size']
          this.prdBasic.compSpec.hd2Type = this.SchemaValueChoosed['hd2Type']
          this.prdBasic.compSpec.hd2Size = this.SchemaValueChoosed['hd2Size']
        }
        if (this.SchemaValueChoosed['sdSize'] !== '') {
          aUPC = aUPC + '-sd' + this.SchemaValueChoosed['sdSize']
          this.prdBasic.compSpec.sdSize = this.SchemaValueChoosed['sdSize']
        }
        if (this.SchemaValueChoosed['optSys'] !== '') {
          aUPC = aUPC + '-' + this.SchemaValueChoosed['optSys']
          this.prdBasic.compSpec.optSys = this.SchemaValueChoosed['optSys']
        }
        if (this.SchemaValueChoosed['dvd'] !== '') {
          if (this.SchemaValueChoosed['dvd'] === 'Yes') {
            aUPC = aUPC + '-d1'
            this.prdBasic.compSpec.dvd = 'Yes'
          }
          if (this.SchemaValueChoosed['dvd'] === 'No') {
            aUPC = aUPC + '-d0'
            this.prdBasic.compSpec.dvd = 'No'
          }
        }
        if (this.SchemaValueChoosed['caddy'] !== '') {
          if (this.SchemaValueChoosed['caddy'] === 'Yes') {
            aUPC = aUPC + '-c1'
            this.prdBasic.compSpec.caddy = 'Yes'
          }
          if (this.SchemaValueChoosed['caddy'] === 'No') {
            aUPC = aUPC + '-c0'
            this.prdBasic.compSpec.caddy = 'No'
          }
        }
        this.newPrdBasic.newUPC = aUPC
        this.prdBasic.origUPC = this.prdBasic._id
        this.prdBasic._id = aUPC
        delete this.prdBasic.crtStmp
        delete this.prdBasic.crtTm
        delete this.prdBasic.mdfStmp
        delete this.prdBasic.mdfTm
      }
    },
    async generate () {
      this.prepareNewPrd()
      try {
        // await Product.post(this.prdBasic)
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
      this.getSchemaDBValues()
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
