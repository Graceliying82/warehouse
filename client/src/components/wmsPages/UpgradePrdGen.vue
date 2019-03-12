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
    <h1>Upgrade Products Generator</h1>
    <panel title="Step 1 : Choose original UPC">
      <v-flex>
        <v-layout mx-2>
          <v-text-field
            label="UPC for upgrade template"
            v-model="UPCInput"
            id="UPC"
            v-on:keydown.enter="find()"
            clearable
          ></v-text-field>
          <v-btn dark @click="find()">Find</v-btn>
        </v-layout>
      </v-flex>
      <!-- Show customizable specs -->
      <v-card color="blue-grey lighten-5" ma-2>
        <v-layout row>
          <v-flex mx-5>
            <v-text-field
              label="UPC"
              v-model="newPrdBasic.UPC"
              readonly
            ></v-text-field>
          </v-flex>
          <v-flex mx-5>
            <v-text-field
              label="Product Name"
              v-model="newPrdBasic.prdNm"
              readonly
            ></v-text-field>
          </v-flex>
          <v-flex mx-5>
            <v-text-field
              label="Original UPC"
              v-model="newPrdBasic.origUPC"
              readonly
            ></v-text-field>
          </v-flex>
        </v-layout>
        <!-- Second Row -->
        <v-layout row>
          <v-flex mx-5>
            <v-text-field
              label="Ram Type"
              v-model="computerSpec.ramType"
              readonly
            ></v-text-field>
          </v-flex>
          <v-flex mx-5>
            <v-text-field
              label="Ram Size"
              v-model="computerSpec.ramSz"
              readonly
            ></v-text-field>
          </v-flex>
          <v-flex mx-5>
            <v-text-field
              label="optSys"
              v-model="computerSpec.optSys"
              readonly
            ></v-text-field>
          </v-flex>
        </v-layout>
        <!-- Third Row -->
        <v-layout row>
          <v-flex mx-5>
            <v-text-field
              label="HD1 Type"
              v-model="computerSpec.hd1Type"
              readonly
            ></v-text-field>
          </v-flex>
          <v-flex mx-5>
            <v-text-field
              label="HD1 Size"
              v-model="computerSpec.hd1Size"
              readonly
            ></v-text-field>
          </v-flex>
          <v-flex mx-5>
            <v-text-field
              label="HD2 Type"
              v-model="computerSpec.hd2Type"
              readonly
            ></v-text-field>
          </v-flex>
          <v-flex mx-5>
            <v-text-field
              label="HD2 Size"
              v-model="computerSpec.hd2Size"
              readonly
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-card>
    </panel>
    <!-- configuralbe part -->
    <v-card v-if=showStep2>
      <v-card-title class="title font-weight-light blue-grey lighten-5">
        <span style='margin-right:1.25em; display:inline-block;'>Step 2 : Choose new products configrations</span>
      </v-card-title>
      <v-card-text>
        <v-layout row>
          <v-flex xs4 sm2  mr-2>
            <v-text-field
                label="Ram Type"
                outline
                readonly
              ></v-text-field>
          </v-flex>
            <template v-for="(item, i) in ramTypeList">
              <v-checkbox
              v-model="item.value"
              v-bind:label="item.name"
              :key="i"
            ></v-checkbox>
            </template>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row mt-3>
          <v-flex xs4 sm2  mr-2>
            <v-text-field
                label="Ram Size"
                outline
                readonly
              ></v-text-field>
          </v-flex>
            <template v-for="(item, i) in ramSizeList">
              <v-checkbox
              v-model="item.value"
              v-bind:label="item.name"
              :key="i"
            ></v-checkbox>
            </template>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row mt-3>
          <v-flex xs4 sm2  mr-2>
            <v-text-field
                label="Operation System"
                outline
                readonly
              ></v-text-field>
          </v-flex>
            <template v-for="(item, i) in osList">
              <v-checkbox
              v-model="item.value"
              v-bind:label="item.name"
              :key="i"
            ></v-checkbox>
            </template>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row mt-3>
          <v-flex xs4 sm2  mr-2>
            <v-text-field
                label="HD1 Type"
                outline
                readonly
              ></v-text-field>
          </v-flex>
            <template v-for="(item, i) in hd1TypeList">
              <v-checkbox
              v-model="item.value"
              v-bind:label="item.name"
              :key="i"
            ></v-checkbox>
            </template>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row mt-3>
          <v-flex xs4 sm2  mr-2>
            <v-text-field
                label="HD1 Size"
                outline
                readonly
              ></v-text-field>
          </v-flex>
            <template v-for="(item, i) in hd1SzList">
              <v-checkbox
              v-model="item.value"
              v-bind:label="item.name"
              :key="i"
            ></v-checkbox>
            </template>
        </v-layout>
                <v-divider></v-divider>
        <v-layout row mt-3>
          <v-flex xs4 sm2  mr-2>
            <v-text-field
                label="HD2 Type"
                outline
                readonly
              ></v-text-field>
          </v-flex>
            <template v-for="(item, i) in hd2TypeList">
              <v-checkbox
              v-model="item.value"
              v-bind:label="item.name"
              :key="i"
            ></v-checkbox>
            </template>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row mt-3>
          <v-flex xs4 sm2  mr-2>
            <v-text-field
                label="HD2 Size"
                outline
                readonly
              ></v-text-field>
          </v-flex>
            <template v-for="(item, i) in hd2SzList">
              <v-checkbox
              v-model="item.value"
              v-bind:label="item.name"
              :key="i"
            ></v-checkbox>
            </template>
        </v-layout>
      </v-card-text>
      <v-btn dark @click.prevent="save()">Save config</v-btn>
      <v-btn dark @click.prevent="deleteConfig()">Delete config</v-btn>
    </v-card>
    <!-- Generator -->
    <v-card v-if=showStep2>
      <v-card-title class="title font-weight-light blue-grey lighten-5">
        <span style='margin-right:1.25em; display:inline-block;'>Step 3 : Generate Upgrade Products</span>
        <v-spacer></v-spacer>
        <v-btn dark @click.prevent="genProducts()">Generate</v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :items="generatedPrds"
          class="elevation-1"
          :headers = "genPrdHeader"
          :rows-per-page-items="rowsPerPageItems"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-left">{{ props.item.UPC }}</td>
            <td class="text-xs-left">{{ props.item.ramType }}</td>
            <td class="text-xs-left">{{ props.item.ramSz }}</td>
            <td class="text-xs-left">{{ props.item.optSys }}</td>
            <td class="text-xs-left">{{ props.item.hd1Type }}</td>
            <td class="text-xs-left">{{ props.item.hd1Size }}</td>
            <td class="text-xs-left">{{ props.item.hd2Type }}</td>
            <td class="text-xs-left">{{ props.item.hd2Size }}</td>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-card v-if=showStep4>
      <v-card-title class="title font-weight-light blue-grey lighten-5">
        <span style='margin-right:1.25em; display:inline-block;'>Step 4 : Submit</span>
        <v-spacer></v-spacer>
        <v-btn dark @click.prevent="ClearAll()">Clear All</v-btn>
        <v-btn dark @click.prevent="submit()">Submit</v-btn>
      </v-card-title>
    </v-card>
  </div>
</template>

<script>
import Product from '@/services/ProductService'
import Tempschema from '@/services/TempschemaService'
export default {
  data () {
    return {
      alertType: 'success',
      showAlert: false,
      message: '',
      showAlertDialog: false,
      showStep2: false,
      showStep4: false,
      UPCInput: '',
      SchemaDBName: ['ramType', 'ramSz', 'optSys', 'hdType', 'hdSize', 'cat'],
      SchemaDBValues: {
        'ramType': [],
        'ramSz': [],
        'optSys': [],
        'dvd': ['Yes', 'No'],
        'hdType': [],
        'hdSize': [],
        'cat': []
      },
      ramTypeList: [],
      ramSizeList: [],
      osList: [],
      hd1TypeList: [],
      hd1SzList: [],
      hd2TypeList: [],
      hd2SzList: [],
      generatedPrds: [],
      configLists: {},
      newPrdBasic: {
        UPC: '',
        prdNm: '',
        origUPC: ''
      },
      prdBasic: {},
      computerSpec: '',
      genPrdHeader: [
        { text: 'UPC', align: 'left', value: 'UPC' },
        { text: 'Ram Type', align: 'left', value: 'ramType' },
        { text: 'Ram Size', align: 'left', value: 'ramSz' },
        { text: 'OS', align: 'left', value: 'optSys' },
        { text: 'HD1 Type', align: 'left', value: 'hd1Type' },
        { text: 'HD1 Size', align: 'left', value: 'hd1Size' },
        { text: 'HD2 Type', align: 'left', value: 'hd2Type' },
        { text: 'HD2 Size', align: 'left', value: 'hd2Size' }
      ],
      rowsPerPageItems: [30, 60, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 }]
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
    clearCheckBoxLists () {
      this.ramTypeList = []
      this.ramSizeList = []
      this.osList = []
      this.hd1TypeList = []
      this.hd1SzList = []
      this.hd2TypeList = []
      this.hd2SzList = []
    },
    ClearAll () {
      this.clearAlert()
      this.showStep2 = false
      this.showStep4 = false
      this.clearCheckBoxLists()
      this.generatedPrds = []
      this.configLists = {}
      this.newPrdBasic.UPC = ''
      this.newPrdBasic.prdNm = ''
      this.newPrdBasic.origUPC = ''
      this.prdBasic = {}
      this.computerSpec = ''
    },
    setAlertDialog (message) {
      this.message = message
      this.showAlertDialog = true
    },
    genList (list, type, defVal) {
      let defFound = false
      for (let atype of this.SchemaDBValues[type]) {
        if (atype === defVal) {
          defFound = true
          list.push({
            'name': defVal,
            'value': true
          })
        } else {
          list.push({
            'name': atype,
            'value': false
          })
        }
      }
      if (!defFound) {
        list.push({
          'name': defVal,
          'value': true
        })
      }
    },
    genCheckboxList () {
      this.clearCheckBoxLists()
      if (Object.keys(this.configLists).length !== 0) {
        this.ramTypeList = this.configLists.ramType
        this.ramSizeList = this.configLists.ramSz
        this.osList = this.configLists.os
        this.hd1TypeList = this.configLists.hd1Type
        this.hd1SzList = this.configLists.hd1Sz
        this.hd2TypeList = this.configLists.hd2Type
        this.hd2SzList = this.configLists.hd2Sz
      } else {
        this.genList(this.ramTypeList, 'ramType', this.computerSpec.ramType)
        this.genList(this.ramSizeList, 'ramSz', this.computerSpec.ramSz)
        this.genList(this.osList, 'optSys', this.computerSpec.optSys)
        this.genList(this.hd1TypeList, 'hdType', this.computerSpec.hd1Type)
        this.genList(this.hd1SzList, 'hdSize', this.computerSpec.hd1Size)
        this.genList(this.hd2TypeList, 'hdType', this.computerSpec.hd2Type)
        this.genList(this.hd2SzList, 'hdSize', this.computerSpec.hd2Size)
        this.configLists.ramType = this.ramTypeList
        this.configLists.ramSz = this.ramSizeList
        this.configLists.os = this.osList
        this.configLists.hd1Type = this.hd1TypeList
        this.configLists.hd1Sz = this.hd1SzList
        this.configLists.hd2Type = this.hd2TypeList
        this.configLists.hd2Sz = this.hd2SzList
      }
    },
    async find () {
      this.clearAlert()
      this.ClearAll()
      if (this.UPCInput === '') {
        this.setAlertDialog('UPC is required.')
      } else {
        try {
          let result = (await Product.getProductByUPC(this.UPCInput)).data
          this.UPCInput = ''
          if ((result === '') || (result === null) || (result === undefined)) {
            this.setAlert('error', 'UPC not found.')
          } else if ((result.origUPC) && (result._id !== result.origUPC)) {
            // This is not a original Product
            console.log('here')
            this.setAlertDialog('Generated UPC can not be use to gen new prodcuts. Try with a original UPC.')
          } else {
            this.showDetail = true
            this.newPrdBasic.UPC = result._id
            this.newPrdBasic.prdNm = result.prdNm
            if (result.origUPC) {
              this.newPrdBasic.origUPC = result.origUPC
            } else {
              this.newPrdBasic.origUPC = result._id
            }
            this.prdBasic = result
            // console.log(this.newPrdBasic)
            // console.log(this.prdBasic)
            if ((result.cstmiz === true) && (result.cat === 'Computer')) {
              this.computerSpec = result.compSpec
              if (result.cfgLists) {
                this.configLists = result.cfgLists
              }
              this.genCheckboxList()
              this.showStep2 = true
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
    async getSchemaDBValues () {
      try {
        for (let aSchNm of this.SchemaDBName) {
          let result = (await Tempschema.getByID(aSchNm)).data
          this.SchemaDBValues[aSchNm] = result.value
        }
        // console.log(this.SchemaDBValues)
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
    listSelected (list) {
      let selected = false
      for (let i of list) {
        if (i.value === true) {
          selected = true
          break
        }
      }
      return selected
    },
    passConfigurationCheck () {
      if (!this.listSelected(this.ramTypeList)) {
        return false
      }
      if (!this.listSelected(this.ramSizeList)) {
        return false
      }
      if (!this.listSelected(this.osList)) {
        return false
      }
      if (!this.listSelected(this.hd1TypeList)) {
        return false
      }
      if (!this.listSelected(this.hd1SzList)) {
        return false
      }
      if (!this.listSelected(this.hd2TypeList)) {
        return false
      }
      if (!this.listSelected(this.hd2SzList)) {
        return false
      }
      return true
    },
    genUPC (baseUPC, product) {
      // console.log(product)
      let newUPC = baseUPC +
                  '-' + product.ramType +
                  '-' + product.ramSz +
                  '-' + product.optSys +
                  '-' + product.hd1Type +
                  '-' + product.hd1Size +
                  '-' + product.hd2Type +
                  '-' + product.hd2Size
      return newUPC
    },
    async genProductsList () {
      if (!this.passConfigurationCheck()) {
        this.setAlertDialog('Every configuration should have at least one default value.')
      } else {
        this.generatedPrds = []
        if (this.newPrdBasic.UPC !== '') {
          let aProduct = {}
          // let selected = this.listSelected(this.ramTypeList)
          for (let aRamTy of this.ramTypeList) {
            aProduct = {}
            if (aRamTy.value === true) {
              aProduct.ramType = aRamTy.name
              for (let aRamSz of this.ramSizeList) {
                if (aRamSz.value === true) {
                  aProduct.ramSz = aRamSz.name
                  for (let aOS of this.osList) {
                    if (aOS.value === true) {
                      aProduct.optSys = aOS.name
                      for (let aHD1Ty of this.hd1TypeList) {
                        if (aHD1Ty.value === true) {
                          aProduct.hd1Type = aHD1Ty.name
                          for (let aHD1Sz of this.hd1SzList) {
                            if (aHD1Sz.value === true) {
                              aProduct.hd1Size = aHD1Sz.name
                              for (let aHD2Ty of this.hd2TypeList) {
                                if (aHD2Ty.value === true) {
                                  aProduct.hd2Type = aHD2Ty.name
                                  for (let aHD2Sz of this.hd2SzList) {
                                    if (aHD2Sz.value === true) {
                                      aProduct.hd2Size = aHD2Sz.name
                                      aProduct.UPC = this.genUPC(this.prdBasic._id, aProduct)
                                      let cloneProduct = await Object.assign({}, aProduct)
                                      this.generatedPrds.push(cloneProduct)
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          // console.log(this.generatedPrds)
          if (this.generatedPrds.length > 0) {
            this.showStep4 = true
          }
        }
      }
    },
    async removeCreatedPrd () {
      let existedUPCList = (await Product.getUPCsByOrig({'UPC': this.newPrdBasic.UPC, 'UPCOnly': true})).data
      console.log(existedUPCList)
      for (let aUPC of existedUPCList) {
        if (aUPC._id === aUPC.origUPC) {
          aUPC._id = this.genUPC(aUPC._id, aUPC.compSpec)
        }
        for (let i = 0; i < this.generatedPrds.length; i++) {
          if (this.generatedPrds[i].UPC === aUPC._id) {
            console.log('Deleting UPC :' + this.generatedPrds[i].UPC)
            this.generatedPrds.splice(i, 1)
          }
        }
      }
    },
    async genProducts () {
      await this.genProductsList()
      await this.removeCreatedPrd()
    },
    async save () {
      try {
        this.prdBasic.cfgLists = this.configLists
        this.prdBasic.origUPC = this.newPrdBasic.origUPC
        // console.log(this.prdBasic)
        await Product.put(this.prdBasic)
        this.setAlertDialog('Update product information successfully.')
      } catch (error) {
        if (!error.response) {
          // network error
          this.setAlertDialog('Network Error: Fail to connet to server')
        } else if (error.response.data.error.includes('jwt')) {
          console.log('jwt error')
          this.$store.dispatch('resetUserInfo', true)
          this.$router.push('/login')
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.statusText)
          this.setAlertDialog(error.response.data.error)
        }
      }
    },
    async deleteConfig () {
      try {
        await Product.deleteConfig({'UPC': this.prdBasic.origUPC})
        this.configLists = {}
        this.genCheckboxList()
        this.setAlertDialog('Update product information successfully.')
      } catch (error) {
        if (!error.response) {
          // network error
          this.setAlertDialog('Network Error: Fail to connet to server')
        } else if (error.response.data.error.includes('jwt')) {
          console.log('jwt error')
          this.$store.dispatch('resetUserInfo', true)
          this.$router.push('/login')
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.statusText)
          this.setAlertDialog(error.response.data.error)
        }
      }
    },
    async submit () {
      try {
        // Save configuration to root product
        await this.save()
        if (this.generatedPrds.length > 0) {
          this.setAlertDialog('This may take a while. Please wait')
          for (let aPrd of this.generatedPrds) {
            await Product.put({
              '_id': aPrd.UPC,
              'origUPC': this.newPrdBasic.UPC,
              'prdNm': this.prdBasic.prdNm,
              'length': this.prdBasic.length,
              'width': this.prdBasic.width,
              'height': this.prdBasic.height,
              'weight': this.prdBasic.weight,
              'volume': this.prdBasic.volume,
              'color': this.prdBasic.color,
              'brdNm': this.prdBasic.brdNm,
              'modNo': this.prdBasic.modNo,
              'modYr': this.prdBasic.modYr,
              'cat': this.prdBasic.cat,
              'cstmiz': this.prdBasic.cstmiz,
              'compSpec': {
                'ramSz': aPrd.ramSz,
                'ramType': aPrd.ramType,
                'optSys': aPrd.optSys,
                'hd1Type': aPrd.hd1Type,
                'hd1Size': aPrd.hd1Size,
                'hd2Type': aPrd.hd2Type,
                'hd2Size': aPrd.hd2Size,
                'caddy': this.computerSpec.caddy,
                'dvd': this.computerSpec.dvd
              }
            })
          }
          this.setAlertDialog('Done Updating')
        }
      } catch (error) {
        if (!error.response) {
          // network error
          this.setAlertDialog('Network Error: Fail to connet to server')
        } else if (error.response.data.error.includes('jwt')) {
          console.log('jwt error')
          this.$store.dispatch('resetUserInfo', true)
          this.$router.push('/login')
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.statusText)
          this.setAlertDialog(error.response.data.error)
        }
      }
    }
  },
  async created () {
    try {
      await this.getSchemaDBValues()
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
