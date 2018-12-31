<template>
<div>
  <v-toolbar fixed clipped-left app class="cyan">
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
        temporary
        clipped>
        <v-list class="pa-1 font-weight-regular" mt-3>
          <v-list-tile font-weight-regular>
          <v-list-tile-content font-weight-regular>
              <v-list-tile-title font-weight-regular>
                <h3>
                Hello!   {{$store.state.orgName}}  {{$store.state.userName}}
                </h3>
              </v-list-tile-title>
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
      drawer: true,
      items: null,
      supervisor: [
        { heading: 'Receiving' },
        { icon: 'library_add', text: 'Receiving', name: 'receiving' },
        { icon: 'library_books', text: 'Receiving Records', name: 'receiveRecords' },
        { divider: true },
        { heading: 'Location' },
        { icon: 'business', text: 'Locations Management', name: 'invtLocMg' },
        { icon: 'last_page', text: 'Product Move In', name: 'PrdMoveIn' },
        { icon: 'first_page', text: 'Product Move Out', name: 'PrdMoveOut' },
        { icon: 'border_color', text: 'Edit Locations', name: 'invtLocEdit' },
        { divider: true },
        { heading: 'Shipping' },
        { icon: 'local_shipping', text: 'Shipping', name: 'shipping' },
        { icon: 'assignment', text: 'Shipping Records', name: 'shippingRecords' },
        { divider: true },
        { heading: 'Manage Product' },
        { icon: 'important_devices', text: 'Products', name: 'products' },
        { divider: true },
        { heading: 'Upgrade' },
        { icon: 'build', text: 'New Upgrade Request', name: 'upgradeRequest' },
        { icon: 'gavel', text: 'Active Upgrade Request', name: 'upgradeApprove' },
        { icon: 'receipt', text: 'Upgrade Request Records', name: 'upgradeRequestRecord' },
        { divider: true },
        { heading: 'User' },
        { icon: 'person_add', text: 'Add User', name: 'createUser' },
        { icon: 'person_pin', text: 'User Records', name: 'deleteUser' }
      ],
      wmsUser: [
        { heading: 'Receiving' },
        { icon: 'library_add', text: 'Receiving', name: 'receiving' },
        { icon: 'library_books', text: 'Receiving Records', name: 'receiveRecords' },
        { divider: true },
        { heading: 'Location' },
        { icon: 'business', text: 'Locations Management', name: 'invtLocMg' },
        { icon: 'last_page', text: 'Product Move In', name: 'stockMove' },
        { icon: 'first_page', text: 'Product Move Out', name: 'stockMove' },
        { divider: true },
        { heading: 'Shipping' },
        { icon: 'local_shipping', text: 'Shipping', name: 'shipping' },
        { icon: 'assignment', text: 'Shipping Records', name: 'shippingRecords' },
        { divider: true },
        { heading: 'Manage Product' },
        { icon: 'important_devices', text: 'Products', name: 'products' },
        { divider: true },
        { heading: 'Upgrade' },
        { icon: 'build', text: 'New Upgrade Request', name: 'upgradeRequest' },
        { icon: 'gavel', text: 'Active Upgrade Request', name: 'upgradeApprove' },
        { icon: 'receipt', text: 'Upgrade Request Records', name: 'upgradeRequestRecord' }
      ],
      buyer: [
        { heading: 'Receiving' },
        { icon: 'library_add', text: 'Receiving', name: 'receiving' },
        { icon: 'library_books', text: 'Receiving Records', name: 'receiveRecords' },
        { divider: true },
        { heading: 'Shipping' },
        { icon: 'local_shipping', text: 'Shipping', name: 'shipping' },
        { icon: 'assignment', text: 'Shipping Records', name: 'shippingRecords' },
        { divider: true },
        { heading: 'Manage Product' },
        { icon: 'important_devices', text: 'Products', name: 'products' },
        { divider: true },
        { heading: 'Upgrade' },
        { icon: 'build', text: 'New Upgrade Request', name: 'upgradeRequest' },
        { icon: 'gavel', text: 'Active Upgrade Request', name: 'upgradeApprove' },
        { icon: 'receipt', text: 'Upgrade Request Records', name: 'upgradeRequestRecord' }
      ],
      seller: [
        { heading: 'Receiving' },
        { icon: 'library_add', text: 'Receiving', name: 'receiving' },
        { icon: 'library_books', text: 'Receiving Records', name: 'inventory' },
        { divider: true },
        { heading: 'Shipping' },
        { icon: 'local_shipping', text: 'Shipping', name: 'shipping' },
        { icon: 'assignment', text: 'Shipping Records', name: 'shippingRecords' },
        { divider: true },
        { heading: 'Manage Product' },
        { icon: 'important_devices', text: 'Products', name: 'products' }
      ]
    }
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    },
    signOut () {
      this.$store.dispatch('resetUserInfo', false)
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
    this.$store.watch(() => { return this.$store.getters.getBuyer }, user => {
      if (user) {
        this.items = this.buyer
        console.log('This is a buyer')
      }
    })
    this.$store.watch(() => { return this.$store.getters.getSeller }, user => {
      if (user) {
        this.items = this.seller
        console.log('This is a seller')
      }
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
