<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-content>
      <v-container>
        <h1>Creat A New User</h1>
        <v-layout justify-center align-center>
          <v-flex>
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
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>

<script>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
