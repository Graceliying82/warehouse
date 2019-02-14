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
          <v-flex mr-5 md4>
            <v-text-field
              v-model="prdBasic.UPC"
              label="UPC"
              required
            ></v-text-field>
          </v-flex>
          <v-flex mx-5 md4>
            <v-text-field
              v-model="prdBasic.prdNm"
              label="Product Name"
            ></v-text-field>
          </v-flex>
          <v-flex mx-5 md4>
            <v-select
            :items ="CategoryChoice"
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
            <v-text-field
              v-model="prdBasic.color"
              label="Color"
            ></v-text-field>
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
          <v-flex ml-2 mr-5 md2>
            <v-text-field
              v-model="computerSpec.ramSz"
              label="Ram size"
            ></v-text-field>
          </v-flex>
          <v-flex mx-5 md2>
            <v-text-field
              v-model="computerSpec.ramType"
              label="Ram Type"
            ></v-text-field>
          </v-flex>
          <v-flex mx-5 md2>
            <v-text-field
              v-model="computerSpec.optSys"
              label="operation System"
            ></v-text-field>
          </v-flex>
          <v-flex mx-5 md2>
            <v-select
            :items ="DvdChoice"
            v-model="computerSpec.dvd"
            label="DVD"
            v-on:change="chooseCategory()"
            required></v-select>
          </v-flex>
          <v-flex ml-5 mr-2 md2>
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
          <v-flex ml-2 mr-5 md2>
            <v-text-field
              v-model="computerSpec.sdSize"
              label="Sd Card Size"
            ></v-text-field>
          </v-flex>
          <v-flex mx-5 md2>
            <v-text-field
              v-model="computerSpec.hd1Size"
              label="Hard Drive #1 Size"
            ></v-text-field>
          </v-flex>
          <v-flex mx-5 md2>
            <v-text-field
              v-model="computerSpec.hd1Type"
              label="Hard Drive #1 Type"
            ></v-text-field>
          </v-flex>
          <v-flex mx-5 md2>
            <v-text-field
              v-model="computerSpec.hd2Size"
              label="Hard Drive #2 Size"
            ></v-text-field>
          </v-flex>
          <v-flex ml-5 mr-2 md2>
            <v-text-field
              v-model="computerSpec.hd2Type"
              label="Hard Drive #2 Type"
            ></v-text-field>
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
        'color': 'N/A',
        'brdNm': 'N/A', // Brand Name
        'modNo': 'N/A', // Model No
        'modYr': 'N/A', // Model year
        'note': '',
        'cat': 'N/A', // category
        'cstmiz': false // customizable
      },
      CategoryChoice: [],
      DvdChoice: ['No', 'Yes'],
      csmzChoice: [true, false],
      computerSpec: {
        'ramSz': 'N/A', // Ram Size
        'ramType': 'N/A', // Ram Size
        'optSys': 'N/A', // operation system
        'dvd': 'No',
        'caddy': 'No',
        'sdSize': 'N/A', // sd card size
        'hd1Size': 'N/A', // hard drive #1 size
        'hd1Type': 'N/A', // hard drive #1 type
        'hd2Size': 'N/A', // hard drive #2 size
        'hd2Type': 'N/A' // hard drive #2 type
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
      this.prdBasic.color = 'N/A'
      this.prdBasic.brdNm = 'N/A'
      this.prdBasic.modNo = 'N/A'
      this.prdBasic.modYr = 'N/A'
      this.prdBasic.note = ''
      this.prdBasic.cat = 'N/A'
      this.prdBasic.cstmiz = false
      this.computerSpec.ramSz = 'N/A'
      this.computerSpec.ramType = 'N/A'
      this.computerSpec.optSys = 'N/A'
      this.computerSpec.dvd = 'No'
      this.computerSpec.caddy = 'No'
      this.computerSpec.sdSize = 'N/A'
      this.computerSpec.hd1Size = 'N/A'
      this.computerSpec.hd1Type = 'N/A'
      this.computerSpec.hd2Size = 'N/A'
      this.computerSpec.hd2Type = 'N/A'
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
        this.computerSpec = result.compSpec
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
      console.log('Here')
      if (this.prdBasic.cat === 'Computer') {
        this.computerCategroy = true
      }
    },
    trimData () {
      this.prdBasic.UPC = this.prdBasic.UPC.trim()
      this.prdBasic.prdNm = this.prdBasic.prdNm.trim()
      this.prdBasic.length = parseInt(this.prdBasic.length)
      this.prdBasic.width = parseInt(this.prdBasic.width)
      this.prdBasic.height = parseInt(this.prdBasic.height)
      this.prdBasic.weight = parseInt(this.prdBasic.weight)
      this.prdBasic.volume = parseInt(this.prdBasic.volume)
      this.prdBasic.color = this.prdBasic.color.trim()
      this.prdBasic.brdNm = this.prdBasic.brdNm.trim()
      this.prdBasic.modNo = this.prdBasic.modNo.trim()
      this.prdBasic.modYr = this.prdBasic.modYr.trim()
      this.prdBasic.note = this.prdBasic.note.trim()
      this.prdBasic.cat = this.prdBasic.cat.trim()
      if (this.prdBasic.cat === 'Computer') {
        this.computerSpec.ramSz = this.computerSpec.ramSz.trim()
        this.computerSpec.ramType = this.computerSpec.ramType.trim()
        this.computerSpec.optSys = this.computerSpec.optSys.trim()
        this.computerSpec.dvd = this.computerSpec.dvd.trim()
        this.computerSpec.sdSize = this.computerSpec.sdSize.trim()
        this.computerSpec.hdSize = this.computerSpec.hd1Size.trim()
        this.computerSpec.hdType = this.computerSpec.hd1Type.trim()
        this.computerSpec.hdSize = this.computerSpec.hd2Size.trim()
        this.computerSpec.hdType = this.computerSpec.hd2Type.trim()
      }
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
          console.log(this.prdBasic)
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
    }
  },
  async created () {
    try {
      let result = (await Tempschema.getByID('cat')).data
      this.CategoryChoice = result.value
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
