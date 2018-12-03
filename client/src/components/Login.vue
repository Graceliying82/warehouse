<template>
  <div v-if="!$store.state.isUserLoggedIn">
    <v-container >
      <panel>
        <v-layout row wrap>
          <v-flex xs12 offset-xs0 class="text-md-center" mt-5>
            <h1>Please Login</h1>
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
                    label="Email"
                    id="email"
                    type="email"
                    v-model="email"
                    v-on:click = "error = null"
                    required box></v-text-field>
                </v-flex>
                <v-flex>
                  <v-text-field
                    name="password"
                    label="Password"
                    id="password"
                    type="password"
                    v-model="password"
                    v-on:click = "error = null"
                    required box></v-text-field>
                </v-flex>
                <v-flex class="text-xs-center" mt-5>
                  <v-btn color="cyan darken-2"
                    dark
                    type = "submit"
                    v-on:click.prevent="login">LOGIN</v-btn>
                </v-flex>
              </v-layout>
            </form>
          </v-flex>
        </v-layout>
      </panel>
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
      console.log(new Date().toString())
      console.log(new Date(new Date().setDate(new Date().getDate()-1)).toString())
      try {
        const response = await AuthenticationService.login({
          'email': this.email,
          'pswd': this.password
        })
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
        this.error = error
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
