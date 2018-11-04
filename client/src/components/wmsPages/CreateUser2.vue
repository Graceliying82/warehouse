<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-content>
      <v-container v-if= "!this.submited">
        <h1>Creat A New User</h1>
        <v-layout justify-center align-center>
          <v-flex>
            <v-flex xs12 sm6 offset-sm3 mt-3>
          <form @submit.prevent="submit">
            <v-layout column>
              <v-flex>
                <v-text-field
                  name="email"
                  label="Email for the new account"
                  id="email"
                  type="email"
                  v-model="email"
                  required box></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field
                  name="password"
                  label="Password for the new accout"
                  id="password"
                  v-model="password"
                  min="8"
                  :append-icon="pwv ? 'visibility' : 'visibility_off'"
                  @click:append="() => (pwv = !pwv)"
                  :type="!pwv ? 'password' : 'text'"
                  required box></v-text-field>
              </v-flex>
              <v-flex class="text-xs-center" mt-5>
                <v-btn color="light-blue darken-3" type="submit" v-on:click.prevent="submit">Submit</v-btn>
              </v-flex>
            </v-layout>
          </form>
        </v-flex>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container v-if= "this.submited">
        <h1>You have created a new User {{email}}</h1>
        <v-flex class="text-xs-center" mt-5>
          <v-btn color="light-blue darken-3"  type="submit" v-on:click="createAnother()">Creat Another User</v-btn>
        </v-flex>
      </v-container>
    </v-content>
  </div>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      password: '',
      error: null,
      pwv: false,
      submited: false
    }
  },
  methods: {
    submit () {
      console.log('Submit New User Infomation')
      this.submited = true
    },
    createAnother () {
      this.email = ''
      this.password = ''
      this.pwv = false
      this.submited = !this.submited
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
