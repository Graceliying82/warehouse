<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-layout justify-center column mx-5>
      <h1>Input Product Detail</h1>
      <v-flex lg8>
        <v-alert
          v-show = showAlert1
          :type = alertType1
          outline>
            {{message1}}
          </v-alert>
      </v-flex>
      <v-flex>
        <v-layout mx-5>
            <v-text-field
              label="Please input UPC of the product"
              v-model="UPCInput"
              id="UPC"
              clearable
            ></v-text-field>
            <v-btn dark @click="find()">Find</v-btn>
            <v-btn dark @click="reset()">Reset</v-btn>
          </v-layout>
      </v-flex>
      <!-- Show Product-->
      <v-layout v-if="showPrd" column>
        <!-- First Row -->
        <h2>Basic Infomation</h2>
        <v-layout row mx-5>
          <v-flex mr-5 md8>
            <v-text-field
              v-model="prdBasic.UPC"
              label="UPC"
              required
            ></v-text-field>
          </v-flex>
          <v-flex mx-5 md4>
            <v-select
            :items ="SchemaDBValues['cat']"
            v-model="prdBasic.cat"
            label="Category"
            v-on:change="chooseCategory()"
            required></v-select>
          </v-flex>
          <v-flex ml-5 md4>
            <v-select
            :items ="csmzChoice"
            v-model="prdBasic.cstmiz"
            label="Customizable"
            required></v-select>
          </v-flex>
        </v-layout>
        <!-- Second Row -->
        <v-layout row>
          <v-flex mx-5 md4>
            <v-text-field
              v-model="prdBasic.prdNm"
              label="Product Name"
            ></v-text-field>
          </v-flex>
          <v-flex mx-5 md4>
          <v-text-field
            v-model="prdBasic.brdNm"
            label="Brand Name"
          ></v-text-field>
          </v-flex>
          <v-flex mx-5 md4>
            <v-text-field
              v-model="prdBasic.modNo"
              label="Model Number"
            ></v-text-field>
          </v-flex>
          <v-flex mx-5 md4>
            <v-text-field
              v-model="prdBasic.modYr"
              label="Model Year"
            ></v-text-field>
          </v-flex>
          <v-flex mx-5 md4>
            <v-select
              :items ="SchemaDBValues['color']"
              v-model="prdBasic.color"
              label="Color"
              ></v-select>
          </v-flex>
        </v-layout>
        <!-- Third Row -->
        <v-layout row>
          <v-flex mx-5>
          <v-text-field
            v-model.number="prdBasic.height"
            type="number"
            label="Height"
            suffix="inch"
            :rules="[rules.valuePos]"
          ></v-text-field>
          </v-flex>
          <v-flex mx-5>
            <v-text-field
              v-model.number="prdBasic.width"
              type="number"
              label="Width"
              suffix="inch"
              :rules="[rules.valuePos]"
            ></v-text-field>
          </v-flex>
          <v-flex mx-5>
            <v-text-field
              v-model.number="prdBasic.length"
              type="number"
              label="Length"
              suffix="inch"
              :rules="[rules.valuePos]"
            ></v-text-field>
          </v-flex>
          <v-flex mx-5>
            <v-text-field
              v-model.number="prdBasic.volume"
              type="number"
              label="Volume"
              suffix="ml"
              :rules="[rules.valuePos]"
            ></v-text-field>
          </v-flex>
          <v-flex mx-5>
            <v-text-field
              v-model.number="prdBasic.weight"
              type="number"
              label="Weight"
              suffix="oz"
              :rules="[rules.valuePos]"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <!-- Fourth Row -->
        <v-flex mx-5>
          <v-textarea
            label="You can write a note"
            v-model="prdBasic.note"
            outline
            counter =  5000>
          </v-textarea>
        </v-flex>
      <!-- Computer Category related more information -->
      <v-layout v-if="computerCategroy" mx-5 column>
        <v-flex>
          <h2>More Information</h2>
        </v-flex>
        <!-- First Row -->
        <v-layout row>
          <v-flex ml-2 mr-3 md2>
            <v-select
              :items ="SchemaDBValues['ramSz']"
              v-model="computerSpec.ramSz"
              label="Ram size"
              required
              ></v-select>
          </v-flex>
          <v-flex mx-3 md2>
            <v-select
              :items ="SchemaDBValues['ramType']"
              v-model="computerSpec.ramType"
              label="Ram Type"
              required
              ></v-select>
          </v-flex>
          <v-flex mx-3 md2>
            <v-select
              :items ="SchemaDBValues['optSys']"
              v-model="computerSpec.optSys"
              label="Operation System"
              ></v-select>
          </v-flex>
          <v-flex mx-3 md2>
            <v-select
            :items ="DvdChoice"
            v-model="computerSpec.dvd"
            label="DVD"
            v-on:change="chooseCategory()"
            required></v-select>
          </v-flex>
          <v-flex ml-3 mr-2 md2>
            <v-select
            :items ="DvdChoice"
            v-model="computerSpec.caddy"
            label="Caddy"
            v-on:change="chooseCategory()"
            required></v-select>
          </v-flex>
        </v-layout>
        <!-- Second Row -->
        <v-layout row>
          <v-flex mr-3 md2>
            <v-select
              :items ="SchemaDBValues['hdType']"
              v-model="computerSpec.hd1Type"
              label="HD1 Type"
              required
              ></v-select>
          </v-flex>
          <v-flex mx-3 md2>
            <v-select
              :items ="SchemaDBValues['hdSize']"
              v-model="computerSpec.hd1Size"
              label="HD1 Size"
              required
              ></v-select>
          </v-flex>
          <v-flex mx-3 md2>
            <v-select
              :items ="SchemaDBValues['hdType']"
              v-model="computerSpec.hd2Type"
              label="HD2 Type"
              required
              ></v-select>
          </v-flex>
          <v-flex mx-3 md2>
            <v-select
              :items ="SchemaDBValues['hdSize']"
              v-model="computerSpec.hd2Size"
              label="HD2 Size"
              required
              ></v-select>
          </v-flex>
        </v-layout>
      </v-layout>
      <!-- End show Product-->
      <v-flex>
        <v-btn
          dark
          @click.prevent="submit()">Submit</v-btn>
      </v-flex>
      </v-layout> <!-- End Show Detail by UPC -->
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
      productItems: '',
      showPrd: false,
      computerCategroy: false,
      prdBasic: {
        'UPC': '', // Must be Unique
        'prdNm': '', // product full name
        'length': 0, // By inch
        'width': 0, // By inch
        'height': 0, // By inch
        'weight': 0, // By oz
        'volume': 0, // By ml
        'color': 'NA',
        'brdNm': 'NA', // Brand Name
        'modNo': 'NA', // Model No
        'modYr': 'NA', // Model year
        'note': '',
        'cat': 'NA', // category
        'cstmiz': false // customizable
      },
      CategoryChoice: [],
      DvdChoice: ['No', 'Yes'],
      csmzChoice: [true, false],
      computerSpec: {
        'ramSz': 'NA', // Ram Size
        'ramType': 'NA', // Ram Size
        'optSys': 'NA', // operation system
        'dvd': 'No',
        'caddy': 'No',
        'sdSize': 'NA', // sd card size
        'hd1Size': 'NA', // hard drive #1 size
        'hd1Type': 'NA', // hard drive #1 type
        'hd2Size': 'NA', // hard drive #2 size
        'hd2Type': 'NA' // hard drive #2 type
      },
      SchemaDBName: ['ramType', 'ramSz', 'optSys', 'hdType', 'hdSize', 'cat', 'color'],
      SchemaDBValues: {
        'ramType': [],
        'ramSz': [],
        'optSys': [],
        'dvd': ['Yes', 'No'],
        'hdType': [],
        'hdSize': [],
        'cat': [],
        'color': []
      },
      rules: {
        valuePos: val => val >= 0 || 'Not a valid number'
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
    clearData () {
      this.UPCInput = ''
      this.productItems = ''
      this.showPrd = false
      this.computerCategroy = false
      this.prdBasic.UPC = ''
      this.prdBasic.prdNm = ''
      this.prdBasic.length = 0
      this.prdBasic.width = 0
      this.prdBasic.height = 0
      this.prdBasic.weight = 0
      this.prdBasic.volume = 0
      this.prdBasic.color = 'NA'
      this.prdBasic.brdNm = 'NA'
      this.prdBasic.modNo = 'NA'
      this.prdBasic.modYr = 'NA'
      this.prdBasic.note = ''
      this.prdBasic.cat = 'NA'
      this.prdBasic.cstmiz = false
      this.computerSpec.ramSz = 'NA'
      this.computerSpec.ramType = 'NA'
      this.computerSpec.optSys = 'NA'
      this.computerSpec.dvd = 'No'
      this.computerSpec.caddy = 'No'
      this.computerSpec.sdSize = 'NA'
      this.computerSpec.hd1Size = 'NA'
      this.computerSpec.hd1Type = 'NA'
      this.computerSpec.hd2Size = 'NA'
      this.computerSpec.hd2Type = 'NA'
    },
    reset () {
      this.clearData()
      this.clearAlert()
    },
    handleNewPrd (result) {
      // Method to handle New Product
      this.prdBasic.UPC = result._id
      this.prdBasic.prdNm = result.prdNm
    },
    handleKnownPrd (result) {
      // Method to handle New Product
      this.prdBasic = result
      this.prdBasic.UPC = result._id
      if (this.prdBasic.cat === 'Computer') {
        if (result.compSpec) {
          this.computerSpec = result.compSpec
        }
        this.computerCategroy = true
      }
    },
    async find () {
      try {
        let result = (await Product.getProductByUPC(this.UPCInput)).data
        this.clearAlert()
        this.clearData()
        // console.log(result)
        if (result.cat === undefined) {
          this.showPrd = true
          this.handleNewPrd(result)
        } else {
          this.showPrd = true
          this.handleKnownPrd(result)
        }
        this.UPCInput = ''
        this.$forceUpdate()
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
      // console.log('Here')
      if (this.prdBasic.cat === 'Computer') {
        this.computerCategroy = true
      }
    },
    trimData () {
      this.prdBasic.UPC = this.prdBasic.UPC.trim()
      this.prdBasic.prdNm = this.prdBasic.prdNm.trim()
      this.prdBasic.length = Math.ceil(this.prdBasic.length)
      this.prdBasic.width = Math.ceil(this.prdBasic.width)
      this.prdBasic.height = Math.ceil(this.prdBasic.height)
      this.prdBasic.weight = Math.ceil(this.prdBasic.weight)
      this.prdBasic.volume = Math.ceil(this.prdBasic.volume)
      this.prdBasic.brdNm = this.prdBasic.brdNm.trim()
      this.prdBasic.modNo = this.prdBasic.modNo.trim()
      this.prdBasic.modYr = this.prdBasic.modYr.trim()
      this.prdBasic.note = this.prdBasic.note.trim()
      this.prdBasic.cat = this.prdBasic.cat.trim()
      // if (this.prdBasic.cat === 'Computer') {
      //   this.computerSpec.ramSz = this.computerSpec.ramSz.trim()
      //   this.computerSpec.ramType = this.computerSpec.ramType.trim()
      //   this.computerSpec.optSys = this.computerSpec.optSys.trim()
      //   this.computerSpec.dvd = this.computerSpec.dvd.trim()
      //   this.computerSpec.sdSize = this.computerSpec.sdSize.trim()
      //   this.computerSpec.hdSize = this.computerSpec.hd1Size.trim()
      //   this.computerSpec.hdType = this.computerSpec.hd1Type.trim()
      //   this.computerSpec.hdSize = this.computerSpec.hd2Size.trim()
      //   this.computerSpec.hdType = this.computerSpec.hd2Type.trim()
      // }
    },
    async submit () {
      if (this.prdBasic.UPC === '') {
        this.setAlert('error', 'UPC is required!')
      } else {
        try {
          this.trimData()
          if (this.prdBasic.cat === 'Computer') {
            this.prdBasic.compSpec = this.computerSpec
          } else {
            this.prdBasic.compSpec = null
          }
          // console.log(this.prdBasic)
          await Product.put(this.prdBasic)
          this.clearData()
          this.setAlert('success', 'Update product information successfully.')
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
  },
  async mounted () {
    const idUPC = this.$store.state.route.params.idUPC
    if (idUPC) {
      this.UPCInput = idUPC
      try {
        await this.find()
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
