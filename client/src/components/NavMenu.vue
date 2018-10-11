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
              <v-list-tile-title>Hello! {{$store.state.userName}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

        <v-list class="pt-0" dense>
          <v-divider></v-divider>

          <v-list-tile
            v-for="item in items"
            :key="item.title">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
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
      items: [
        { title: 'Warehouse Management', icon: 'store' },
        { title: 'User Management', icon: 'supervised_user_circle' },
        { title: 'Upgrade', icon: 'build' },
        { title: 'Stock Management', icon: 'business' },
        { title: 'Products Management', icon: 'desktop_mac' }
      ]
    }
  },
  methods: {
    syncDrawer () {
      this.drawer = this.$store.state.drawer
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
