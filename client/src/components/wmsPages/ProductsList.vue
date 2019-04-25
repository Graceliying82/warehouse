<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-layout column ma-5>
      <v-flex xs8>
        <v-alert
          v-show = "showAlert1"
          :type = "alertType1"
          outline>
            {{message1}}
          </v-alert>
      </v-flex>
      <!-- Filters -->
      <v-layout>
        <v-flex sm2>
          <v-select
            :items ="CategoryChoice"
            v-model="filter.cat"
            label="Select product category"
            v-on:change="chooseCategory()"
            required></v-select>
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex>
          <download-excel
              class   = "v-btn"
              type    = "csv"
              :name    = "downloadName"
              :data   = "computersForDownload"
              >
              Download
          </download-excel>
        </v-flex>
      </v-layout>
      <!-- Data Table for basic infomation -->
      <v-layout v-if="!computerChoosed">
        <v-data-table
          :headers="headersBasics"
          :items="basics"
          :rows-per-page-items="rowsPerPageItems"
          class="elevation-1"
        >
        <template slot="items" slot-scope="props">
          <tr
            @click.prevent="navigateTo({
              name: 'productDetail',
              params: { idUPC: props.item._id }
            })">
          <td class="text-xs-left">{{ props.item._id }}</td>
          <td class="text-xs-left">{{ props.item.prdNm }}</td>
          <td class="text-xs-left">{{ props.item.pid }}</td>
          <td class="text-xs-left">{{ props.item.length }}</td>
          <td class="text-xs-left">{{ props.item.width }}</td>
          <td class="text-xs-left">{{ props.item.height }}</td>
          <td class="text-xs-left">{{ props.item.weight }}</td>
          <td class="text-xs-left">{{ props.item.volume }}</td>
          <td class="text-xs-left">{{ props.item.color }}</td>
          <td class="text-xs-left">{{ props.item.brdNm }}</td>
          <td class="text-xs-left">{{ props.item.modNo }}</td>
          <td class="text-xs-left">{{ props.item.modYr }}</td>
          <td class="text-xs-left">{{ props.item.cat }}</td>
          <td class="text-xs-left">{{ props.item.cstmiz }}</td>
          <td class="text-xs-left">{{ props.item.note }}</td>
          </tr>
        </template>
        </v-data-table>
      </v-layout>
      <!-- Computer Data table -->
      <v-layout v-if="computerChoosed">
        <v-flex>
          <v-data-table
            :headers="headersComputer"
            :items="computers"
            :rows-per-page-items="rowsPerPageItems"
            class="elevation-1"
          >
          <template slot="items" slot-scope="props">
            <tr
              @click.prevent="navigateTo({
                name: 'productDetail',
                params: { idUPC: props.item._id }
                })">
            <td class="text-xs-left">{{ props.item._id }}</td>
            <td class="text-xs-left">{{ props.item.prdNm }}</td>
            <td class="text-xs-left">{{ props.item.pid }}</td>
            <td class="text-xs-left">{{ props.item.length }}</td>
            <td class="text-xs-left">{{ props.item.width }}</td>
            <td class="text-xs-left">{{ props.item.height }}</td>
            <td class="text-xs-left">{{ props.item.weight }}</td>
            <td class="text-xs-left">{{ props.item.volume }}</td>
            <td class="text-xs-left">{{ props.item.color }}</td>
            <td class="text-xs-left">{{ props.item.brdNm }}</td>
            <td class="text-xs-left">{{ props.item.modNo }}</td>
            <td class="text-xs-left">{{ props.item.modYr }}</td>
            <td class="text-xs-left">{{ props.item.cat }}</td>
            <td class="text-xs-left">{{ props.item.cstmiz }}</td>
            <td class="text-xs-left">{{ props.item.compSpec.ramSz }}</td>
            <td class="text-xs-left">{{ props.item.compSpec.ramType }}</td>
            <td class="text-xs-left">{{ props.item.compSpec.optSys }}</td>
            <td class="text-xs-left">{{ props.item.compSpec.dvd }}</td>
            <td class="text-xs-left">{{ props.item.compSpec.sdSize }}</td>
            <td class="text-xs-left">{{ props.item.compSpec.hd1Size }}</td>
            <td class="text-xs-left">{{ props.item.compSpec.hd1Type }}</td>
            <td class="text-xs-left">{{ props.item.compSpec.hd2Size }}</td>
            <td class="text-xs-left">{{ props.item.compSpec.hd2Type }}</td>
            <td class="text-xs-left">{{ props.item.note }}</td>
            </tr>
          </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-layout>
  </div>
</template>

<script>
import Product from '@/services/ProductService'
import Tempschema from '@/services/TempschemaService'
export default {
  data () {
    return {
      alertType1: 'success',
      showAlert1: false,
      message1: '',
      downloadName: 'computerProductInfo.xls',
      rowsPerPageItems: [5, 10, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 }],
      CategoryChoice: [],
      filter: {
        cat: 'All'
      },
      computerChoosed: false,
      catChoosed: '',
      headersBasics: [
        { text: 'UPC', align: 'left', value: '_id' },
        { text: 'Product Name', align: 'left', value: 'prdNm' },
        { text: 'PID', align: 'left', value: 'pid' },
        { text: 'Length(inch)', align: 'left', value: 'length' },
        { text: 'Width(inch)', align: 'left', value: 'width' },
        { text: 'Height(inch)', align: 'left', value: 'height' },
        { text: 'Weight(oz)', align: 'left', value: 'weight' },
        { text: 'Volume(ml)', align: 'left', value: 'volume' },
        { text: 'Color', align: 'left', value: 'color' },
        { text: 'Brand Name', align: 'left', value: 'brdNm' },
        { text: 'Model No', align: 'left', value: 'modNo' },
        { text: 'Model year', align: 'left', value: 'modYr' },
        { text: 'Category', align: 'left', value: 'cat' },
        { text: 'Customizable', align: 'left', value: 'cstmiz' },
        { text: 'Note', align: 'left', value: 'note' }
      ],
      basics: [],
      headersComputer: [
        { text: 'UPC', align: 'left', value: '_id' },
        { text: 'Product Name', align: 'left', value: 'prdNm' },
        { text: 'PID', align: 'left', value: 'pid' },
        { text: 'Length(inch)', align: 'left', value: 'length' },
        { text: 'Width(inch)', align: 'left', value: 'width' },
        { text: 'Height(inch)', align: 'left', value: 'height' },
        { text: 'Weight(oz)', align: 'left', value: 'weight' },
        { text: 'Volume(ml)', align: 'left', value: 'volume' },
        { text: 'Color', align: 'left', value: 'color' },
        { text: 'Brand Name', align: 'left', value: 'brdNm' },
        { text: 'Model No', align: 'left', value: 'modNo' },
        { text: 'Model year', align: 'left', value: 'modYr' },
        { text: 'Category', align: 'left', value: 'cat' },
        { text: 'Customizable', align: 'left', value: 'cstmiz' },
        { text: 'Ram Size', align: 'left', value: 'ramType' },
        { text: 'Ram Type', align: 'left', value: 'ramType' },
        { text: 'OS', align: 'left', value: 'optSys' },
        { text: 'DVD', align: 'left', value: 'dvd' },
        { text: 'SD size', align: 'left', value: 'sdSize' },
        { text: 'HD1 Size', align: 'left', value: 'hd1Size' },
        { text: 'HD1 Type', align: 'left', value: 'hd1Type' },
        { text: 'HD2 Size', align: 'left', value: 'hd2Size' },
        { text: 'HD2 Type', align: 'left', value: 'hd2Type' },
        { text: 'Note', align: 'left', value: 'note' }
      ],
      computers: [],
      computersForDownload: []
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
    async chooseCategory () {
      if (this.filter.cat === 'Computer') {
        this.computerChoosed = true
        this.catChoosed = 'Computer'
      } else {
        if (this.catChoosed === 'Computer') {
          this.computerChoosed = false
          this.catChoosed = ''
        }
      }
      await this.getByFilter()
    },
    async getByFilter () {
      try {
        let result = (await Product.getProductsByFilter(this.filter.cat)).data
        if (this.filter.cat === 'Computer') {
          this.computers = result
          for (let aCom of this.computers) {
            aCom.compSpec.UPC = aCom._id
            aCom.compSpec.pid = aCom.pid
            aCom.compSpec.origUPC = aCom.origUPC
            this.computersForDownload.push(aCom.compSpec)
          }
          console.log(this.computersForDownload)
        } else {
          this.basics = result
        }
        // console.log(result)
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
    deleteItem () {
      console.log('Delete')
    },
    navigateTo (route) {
      this.$router.push(route)
    }
  },
  async created () {
    try {
      let result = (await Tempschema.getByID('cat')).data
      this.CategoryChoice = result.value
      this.CategoryChoice.unshift('All')
      await this.getByFilter()
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
