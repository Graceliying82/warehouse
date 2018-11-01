<template>
  <div v-if="!$store.state.isUserLoggedIn">
    <v-container >
      <v-layout row wrap>
        <v-flex xs12 offset-xs0 class="text-md-center" mt-5>
          <h1>Please Sign In</h1>
        </v-flex>
        <v-flex xs12 sm6 offset-sm3 mt-3>
          <form @submit.prevent="login">
            <v-layout column>
              <v-flex>
                <v-alert type="error" dismissible>
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
                  required box></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field
                  name="password"
                  label="Password"
                  id="password"
                  type="password"
                  v-model="password"
                  required box></v-text-field>
              </v-flex>
              <v-flex class="text-xs-center" mt-5>
                <v-btn color="light-blue darken-3" type="submit" v-on:click="login">LOGIN</v-btn>
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
        const response = await AuthenticationService.login({
          'email': this.email,
          'password': this.password
        })
        console.log(response.data.email)
        this.$store.dispatch('setUserInfo',
          {userName: 'abc',
            email: 'response.data.email',
            token: 'response.data.token',
            isSupervisor: true,
            isWmsUser: false})
      } catch (error) {
        console.log('error:' + error)
      }
      this.$router.push('/')
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
