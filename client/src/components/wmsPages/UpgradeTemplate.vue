<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-layout column ma-5>
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
            <v-flex>
              <v-layout mx-5 >
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
                <v-flex mx-5>
                  <v-text-field
                    v-model="prdBasic.UPC"
                    label="Original UPC"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex mx-5>
                  <v-text-field
                    v-model="prdBasic.prdNm"
                    label="Product Name"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <!-- Customizable Part-->
              <v-layout column>
                <v-layout row>
                  <v-flex mx-2>
                    <v-text-field
                      v-model="computerSpec.ramSz"
                      label="Original Ram size"
                      readonly
                      box
                    ></v-text-field>
                  </v-flex>
                  <v-flex mx-2>
                    <v-text-field
                      v-model="computerSpec.ramType"
                      label="Original Ram Type"
                      readonly
                      box
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex mx-2>
                    <v-text-field
                      v-model="computerSpec.optSys"
                      label="Original operation System"
                      readonly
                      box
                    ></v-text-field>
                  </v-flex>
                  <v-flex mx-2>
                    <v-text-field
                      v-model="computerSpec.dvd"
                      label="Original DVD"
                      required
                      readonly
                      box
                    ></v-text-field>
                  </v-flex>
                  <v-flex mx-2>
                    <v-text-field
                      v-model="computerSpec.sdSize"
                      label="Original Sd Card Size"
                      readonly
                      box
                    ></v-text-field>
                  </v-flex>
                </v-layout>
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
              <v-flex mx-5 sm4>
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
            <v-layout column  align-start mx-5>
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
      prdBasic: {
        UPC: '',
        prdNm: ''
      },
      computerSpec: '',
      templateSchema: {},
      schemaSelect: '',
      paraChoice: '',
      schemaValues: [],
      SchemaHeader: ['Ram Type', 'Ram Size', 'OS', 'SD Card Size', 'HD Type', 'HD Size'],
      SchemaDBValue: ['ramType', 'ramSz', 'optSys', 'sdSize', 'hdType', 'hdSize']
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
          console.log('Here')
          let result = (await Product.getProductByUPC(this.UPCInput)).data
          this.UPCInput = ''
          if ((result === '') || (result === null) || (result === undefined)) {
            this.setAlert('error', 'UPC not found.')
          } else {
            this.showDetail = true
            this.prdBasic.UPC = result._id
            this.prdBasic.prdNm = result.prdNm
            if ((result.cstmiz === true) && (result.cat === 'Computer')) {
              this.computerSpec = result.compSpec
            } else {
              this.setAlert('error', 'Not a customizable product! Please check')
            }
            console.log(result)
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
          let result = (await Tempschema.getByID(this.SchemaDBValue[idx])).data
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
          let id = this.SchemaDBValue[idx]
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
        console.log('HEre')
        if (this.schemaSelect === '') {
          this.setAlert('error', 'Please select a schema parameter first.')
        } else {
          console.log(this.schemaSelect)
          console.log(aSchema)
          let idx = this.SchemaHeader.indexOf(this.schemaSelect)
          let id = this.SchemaDBValue[idx]
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
