<template>
  <div v-if="!$store.state.isUserLoggedIn">
    <v-container >
        <v-flex xs12 offset-xs0 class="text-md-center" mt-5>
          <h1>Login With Google+ Account</h1>
           <v-flex class="text-xs-center" mt-5>
                <v-btn color="light-blue darken-3"
                  dark
                  type = "submit"
                  v-on:click.prevent="login">LOGIN With Google+</v-btn>
          </v-flex>
        </v-flex>
    </v-container>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  methods: {
    async login () {
      try {
      //   const response = await AuthenticationService.login()
      //   console.log(response)
        console.log(window.location.href)
        window.location.href = 'http://localhost:3000/auth/google'
      } catch (error) {
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
