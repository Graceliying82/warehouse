<template>
  <div>
    <v-container fluid class="light-blue lighten-5" >
      <v-layout row wrap>
        <v-flex xs12 class="text-xs-center" mt-5>
          <h1>Register</h1>
        </v-flex>
        <v-flex xs12 sm6 offset-sm3 mt-3>
          <form @submit.prevent="userSignUp">
            <v-layout column>
              <v-flex>
                <v-alert type="error" dismissible v-model="alert">
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
                  required></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field
                  name="password"
                  label="Password"
                  id="password"
                  type="password"
                  v-model="password"
                  required></v-text-field>
              </v-flex>
              <v-flex class="text-xs-center" mt-5>
                <v-btn color="blue-grey lighten-5" type="submit" v-on:click="register">Submit</v-btn>
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
    async register () {
      try {
        await AuthenticationService.register({
          email: this.email,
          password: this.password
        })
      } catch (error) {
        if (!error.response) {
          // network error
          this.error = 'Network Error: Fail to connet to server'
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.statusText)
          this.error = error.response.data.error
        }
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
