<template>
  <div  v-if="$store.state.isUserLoggedIn">
    <v-layout justify-center>
      <h1>Inventory Location Management</h1>
    </v-layout>
    <v-layout  justify-cente>
      <v-flex ma-5 xs4>
        <panel title = "Add New Location">
          <v-text-field
            v-model="LocationID"
            label="Location ID"
            required
          ></v-text-field>
          <v-text-field
            v-model="LocationNickName"
            label="Location Nick Name"
          ></v-text-field>
          <v-btn>Submit</v-btn>
        </panel>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex ma-5>
        <panel title = "Current Locations">
          <v-text-field
            v-model="LocationID"
            label="Location ID"
            required
          ></v-text-field>
          <v-text-field
            v-model="LocationNickName"
            label="Location Nick Name"
          ></v-text-field>
        </panel>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
