<template>
  <div v-if="!$store.state.isUserLoggedIn">
    <v-container >
      <v-layout row wrap>
        <v-flex xs12 offset-xs0 class="text-md-center" mt-5>
          <h1>Please Input Gmail Address</h1>
        </v-flex>
        <v-flex xs12 sm6 offset-sm3 mt-3>
          <form @submit.prevent="login">
            <v-layout column>
              <v-flex>
                <v-alert type="error"
                  outline
                  :value="error"
                  dismissible>
                  {{ error }}
                </v-alert>
              </v-flex>
              <v-flex>
                <v-text-field
                  name="email"
                  label="Gmail"
                  id="email"
                  type="email"
                  v-model="email"
                  v-on:click = "error = null"
                  required box></v-text-field>
              </v-flex>
              <v-flex class="text-xs-center" mt-5>
                <v-btn color="light-blue darken-3"
                  dark
                  type = "submit"
                  v-on:click="login">LOGIN With Google+</v-btn>
              </v-flex>
            </v-layout>
          </form>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  data () {
    return {
      email: '',
      password: '',
      error: null
    }
  },
  methods: {
    async login () {
      try {
        const emailRegistered = (await AuthenticationService.checkEmail({
          'email': this.email
        })).data.emailExisted
        console.log('emailRegistered :' + emailRegistered)
      } catch (error) {
        this.error = error.response.data.error
      }
      try {
        const response = await AuthenticationService.login({
          'email': this.email
        })
        console.log(response.data)
        this.$store.dispatch('setUserInfo',
          {userName: response.data.userName,
            email: response.data.email,
            orgName: response.data.orgName,
            isSupervisor: response.data.isSupervisor,
            isWmsUser: response.data.isWmsUser,
            isSeller: response.data.isSeller,
            isBuyer: response.data.isBuyer,
            token: response.data.token})
        this.$router.push('/')
      } catch (error) {
        this.error = error.response.data.error
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
error{
  color: red
}
</style>
