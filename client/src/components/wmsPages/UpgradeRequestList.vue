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
    <panel title="Upgrade Request List">
      <v-layout>
        <v-flex mx-5 sm2>
          <v-select
            :items ="ReqStatusChoice"
            v-model="statusFilter"
            label="Select Status Of Request"
            v-on:change="chooseCategory()"
            required></v-select>
        </v-flex>
      </v-layout>
    </panel>
  </div>
</template>

<script>
import Upgrade from '@/services/UpgradeService'
export default {
  data () {
    return {
      alertType: 'success',
      showAlert: false,
      message: '',
      showAlertDialog: false,
      upgReqList: [],
      ReqStatusChoice: ['Active', 'Finish', 'Cancel', 'All'],
      statusFilter: 'Active'
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
    async getUpgReqList () {
      try {
        let result = await Upgrade.get('active')
        console.log(result)
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
    this.getUpgReqList()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
