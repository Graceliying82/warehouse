<template>
<div>
  <v-toolbar fixed clipped-left app class="light-blue">
    <v-toolbar-side-icon
      v-if="$store.state.isUserLoggedIn"
      @click.stop="drawer=!drawer"></v-toolbar-side-icon>
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
  <v-layout wrap app v-if="$store.state.isUserLoggedIn">
      <v-navigation-drawer
        v-model="drawer"
        app
        clipped>
        <v-list class="pa-1" mt-3>
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <v-icon>person_pin</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title >Hello! {{$store.state.userName}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-list dense class="grey lighten-4">
          <template v-for="(item, i) in items">
            <v-layout
              v-if="item.heading"
              :key="i"
              row
              align-center
            >
            <v-flex xs6>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
            </v-layout>
              <v-divider
                v-else-if="item.divider"
                :key="i"
                dark
                class="my-3">
              </v-divider>
            <v-list-tile
              v-else
              :key="i"  @click="navigateTo({name: item.name})" >
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </v-navigation-drawer>
    </v-layout>
</div>
</template>

<script>
export default {
  data () {
    return {
      drawer: false,
      items: null,
      supervisor: [
        { heading: 'Warehouse' },
        { icon: 'account_balance', text: 'Receiving', name: 'receiving' },
        { icon: 'add_shopping_cart', text: 'Shipping', name: 'shipping' },
        { icon: 'compare_arrows', text: 'Stock move', name: 'stockMove' },
        { icon: 'event_seat', text: 'Inventory Locations', name: 'inventoryLocations' },
        { divider: true },
        { heading: 'Upgrade' },
        { icon: 'class', text: 'Upgrade Request', name: 'upgradeRequest' },
        { icon: 'build', text: 'Upgrade approve', name: 'upgradeApprove' },
        { divider: true },
        { icon: 'dashboard', text: 'Inventory', name: 'inventory' },
        { divider: true },
        { icon: 'important_devices', text: 'Products', name: 'products' },
        { divider: true },
        { icon: 'textsms', text: 'Reports', name: 'reports' },
        { divider: true },
        { heading: 'User Management' },
        { icon: 'contacts', text: 'Create User', name: 'createUser' },
        { icon: 'delete', text: 'Delete User', name: 'deleteUser' }
      ],
      wmsUser: [
        { heading: 'Warehouse' },
        { icon: 'account_balance', text: 'Receiving', name: 'receiving' },
        { icon: 'add_shopping_cart', text: 'Shipping', name: 'shipping' },
        { icon: 'compare_arrows', text: 'Stock move', name: 'stockMove' },
        { icon: 'event_seat', text: 'Inventory Locations', name: 'inventoryLocations' },
        { divider: true },
        { heading: 'Upgrade' },
        { icon: 'class', text: 'Upgrade Request', name: 'upgradeRequest' },
        { icon: 'build', text: 'Upgrade approve', name: 'upgradeApprove' },
        { divider: true },
        { icon: 'dashboard', text: 'Inventory', name: 'inventory' },
        { divider: true },
        { icon: 'important_devices', text: 'Products', name: 'products' }
      ]
    }
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    },
    signOut () {
      this.$store.dispatch('resetUserInfo')
      this.$router.push({
        name: 'Hello'
      })
    }
  },
  created () {
    this.$store.watch(() => { return this.$store.getters.getSupervisor }, user => {
      if (user) {
        this.items = this.supervisor
        console.log('This is a supervisor')
      }
    })
    this.$store.watch(() => { return this.$store.getters.getWmsUser }, user => {
      if (user) {
        this.items = this.wmsUser
        console.log('This is a wmsUser')
      }
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
