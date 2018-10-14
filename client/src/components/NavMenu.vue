<template>
  <div>
      <v-layout  wrap style="height: 200px;" >
      <v-navigation-drawer
        v-on.capture:$store.state.drawer="syncDrawer()"
        v-model="drawer"
        absolute
        style='top: 5px'
        >
        <v-list class="pa-1" mt-4>
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
              :key="i">
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
      drawer: null,
      items: null,
      supervisor: [
        { heading: 'Warehouse' },
        { icon: 'account_balance', text: 'Receiving' },
        { icon: 'add_shopping_cart', text: 'Shipping' },
        { icon: 'compare_arrows', text: 'Stock move' },
        { icon: 'event_seat', text: 'Inventory Locations' },
        { divider: true },
        { heading: 'Upgrade' },
        { icon: 'class', text: 'Upgrade Request' },
        { icon: 'build', text: 'Upgrade approve' },
        { divider: true },
        { icon: 'dashboard', text: 'Inventory' },
        { divider: true },
        { icon: 'important_devices', text: 'Products' },
        { divider: true },
        { icon: 'textsms', text: 'Reports' },
        { divider: true },
        { heading: 'User Management' },
        { icon: 'contacts', text: 'Create User' },
        { icon: 'delete', text: 'Delete User' }
      ],
      wmsUser: [
        { heading: 'Warehouse' },
        { icon: 'account_balance', text: 'Receiving' },
        { icon: 'add_shopping_cart', text: 'Shipping' },
        { icon: 'compare_arrows', text: 'Stock move' },
        { icon: 'event_seat', text: 'Inventory Locations' },
        { divider: true },
        { heading: 'Upgrade' },
        { icon: 'class', text: 'Upgrade Request' },
        { icon: 'build', text: 'Upgrade approve' },
        { divider: true },
        { icon: 'dashboard', text: 'Inventory' },
        { divider: true },
        { icon: 'important_devices', text: 'Products' }
      ]
    }
  },
  methods: {
    syncDrawer () {
      this.drawer = this.$store.state.drawer
    }
  },
  created () {
    if (this.$store.state.isSupervisor) {
      this.items = this.supervisor
      console.log(this.items)
    } else if (this.$store.state.isWmsUser) {
      this.items = this.wmsUser
    } else {
      console.log('Wrong role setting!')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.v-icon {
  color: #0D47A1;
}
</style>
