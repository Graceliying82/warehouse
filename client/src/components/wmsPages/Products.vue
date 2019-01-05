<template>
  <div v-if="$store.state.isUserLoggedIn">
    <panel title = "Products and Inventory">
        <v-data-table
          :headers="headers"
          :items="products"
          :rows-per-page-items="rowsPerPageItems"
        >
        <template v-for = "it in products" slot="items" slot-scope="props">
          <td :key="it.id + '-UPC'" class="text-xs-left">{{ props.item.UPC }}</td>
          <td :key="it.id + '-prdNm'" class="text-xs-left">
            {{ props.item.prdNm }}
          </td>
          <td :key="it.id + '-qty'" class="text-xs-left">{{ props.item.qty }}</td>
        </template>
      </v-data-table>
    </panel>
  </div>
</template>

<script>
import ProductInv from '@/services/productInv'
export default {
  data () {
    return {
      rowsPerPageItems: [30, 60, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 }],
      headers: [
        {
          text: 'UPC',
          align: 'left',
          value: 'UPC'
        },
        { text: 'Product Name', value: 'prdNm' },
        { text: 'Quantity', value: 'qty' }
      ],
      products: []
    }
  },
  methods: {
    async getAllProductInventory () {
      this.products = (await ProductInv.getAllProductInventory()).data
      console.log(this.products)
    }
  },
  created () {
    this.getAllProductInventory()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
