<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-layout>
      <v-flex xs8>
          <v-alert
            v-show = showAlert1
            :type = alertType1
            outline>
              {{message1}}
            </v-alert>
        </v-flex>
    </v-layout>
  </div>
</template>

<script>
// import Shipment from '@/services/Shipment'
export default {
  data () {
    return {
      alertType1: 'success',
      showAlert1: false,
      message1: ''
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
