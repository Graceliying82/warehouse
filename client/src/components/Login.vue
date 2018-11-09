<template>
  <div v-if="!$store.state.isUserLoggedIn">
    <v-container >
        <v-flex xs12 offset-xs0 class="text-md-center" mt-5>
          <h1>Login With Google+ Account</h1>
           <router-link to="/google">
            Google+
           </router-link>
        </v-flex>
    </v-container>
  </div>
</template>

<script>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
error{
  color: red
}
</style>
