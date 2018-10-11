<template>
<div>
  <v-toolbar fixed class="light-blue">
    <v-toolbar-side-icon
      v-if="$store.state.isUserLoggedIn"
      @click.stop="clickSideBar()"></v-toolbar-side-icon>
    <v-toolbar-title class="mr-4 white--text">
      Warehouse Management System
    </v-toolbar-title >
    <v-spacer></v-spacer>
    <v-toolbar-items v-if="$store.state.isUserLoggedIn">
      <v-btn
        flat dark @click="signOut()">
        Log Out
      </v-btn>
    </v-toolbar-items>
    <v-toolbar-items v-if="!$store.state.isUserLoggedIn">
      <v-btn
        flat dark @click="navigateTo({name: 'login'})">
        Login
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    navigateTo (route) {
      console.log(this.$store.state.userName)
      this.$router.push(route)
    },
    signOut () {
      this.$store.dispatch('resetUserInfo')
      this.$router.push({
        name: 'Hello'
      })
    },
    clickSideBar () {
      this.$store.dispatch('setDrawer')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
