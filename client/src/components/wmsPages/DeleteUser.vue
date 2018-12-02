<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-flex shrink>
      <h1>User Records Under Construction</h1>
    </v-flex>
    <v-content>
      <v-container fill-height>
        <v-layout justify-center align-center>
           <v-card>
            <v-toolbar color="cyan" dark>
              <v-toolbar-side-icon></v-toolbar-side-icon>
              <v-toolbar-title>Inbox</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>search</v-icon>
              </v-btn>
            </v-toolbar>
            <v-list>
              <v-flex ma-3 row>
              <template v-for="(email, i) in UserEmails">
                <v-list-tile-content v-bind:key=i>
                  <v-list-tile-title
                  v-text= email>
                  </v-list-tile-title>
               </v-list-tile-content>
              </template>
              </v-flex>
            </v-list>
          </v-card>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>

<script>
export default {
  data () {
    return {
      UserEmails: ['abc@gmail.com', 'efd@gmail.com', 'xyz@gmail.com'
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
