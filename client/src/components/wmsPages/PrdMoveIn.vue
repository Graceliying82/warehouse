<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-layout justify-center>
      <h1>Move in Products</h1>
    </v-layout>
    <v-layout justify-center xs-6>
      <v-flex ma-5 xs-6>
        <v-alert
          v-show = showAlert1
          :type = alertType1
          outline>
            {{message1}}
          </v-alert>
        <v-card>
          <panel title="Scan Items by UPC ">
            <v-text-field
            v-model="miLocUPC"
            label="Move in Location"
            ></v-text-field>
            <v-layout xs-4>
              <v-flex>
              <v-text-field
              v-model="UPC"
              label="UPC"
              ref="UPC"
              v-bind:autofocus= "true"
              required
              ></v-text-field>
              </v-flex>
              <v-flex offset-xs2>
              <v-text-field
              v-model.number="qn"
              label="Quantity"
              type="number"
              ></v-text-field>
              </v-flex>
            </v-layout>
            <v-btn dark class="cyan darken-2" @click.prevent="clear()">Clear</v-btn>
          </panel>
        </v-card>
      </v-flex>
      <v-flex ma-5 xs6>
        <v-alert
          v-show = showAlert2
          :type = alertType2
          outline>
            {{message2}}
          </v-alert>
        <v-card>
          <panel title="Scan Items by Tracking Number ">
            <v-text-field
            v-model="miLocTracking"
            label="Move in Location"
            ></v-text-field>
            <v-text-field
            v-model="trackingNo"
            label="Tracking No"
            ref="Tracking"
            required
            ></v-text-field>
            <v-btn dark class="cyan darken-2" @click.prevent="clear()">Clear</v-btn>
          </panel>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout justify-center>
      <v-flex ma-5 xs8>
        <panel title = "Moved in items ">
            <v-data-table
              :items="miItems"
              class="elevation-1"
              :headers = "headers"
              :rows-per-page-items="rowsPerPageItems"
            >
              <template slot="items" slot-scope="props">
                <td>{{ props.item.UPC }}</td>
                <td >{{ props.item.qn }}</td>
                <td >{{ props.item.miLoc }}</td>
              </template>
            </v-data-table>
        </panel>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  data () {
    return {
      UPC: '',
      qn: null,
      miLocUPC: '',
      miLocTracking: '',
      alertType1: 'success',
      showAlert1: false,
      message1: '',
      alertType2: 'success',
      showAlert2: false,
      message2: '',
      miItems: [],
      rowsPerPageItems: [30, 60, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 }]
    }
  },
  methods: {
    changeFocusToOrgName1 () {
      this.$refs.orgName1.focus()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
