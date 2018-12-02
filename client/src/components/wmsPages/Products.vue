<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-content>
      <v-container fill-height>
        <v-layout justify-center align-center>
          <v-flex>
            <v-flex shrink>
            <h1>Products Under Construction</h1>
            </v-flex>
            <v-text-field
              label="Please input a UPC number"
              v-model="UPC"
              required box></v-text-field>
          </v-flex>
          <v-btn color="light-blue darken-3" type="submit" v-on:click.prevent="submit">Submit</v-btn>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>

<script>
export default {
  data () {
    return {
      UPC: ''
    }
  },
  methods: {
    async submit () {
      console.log('Submit New User Infomation')
      this.submited = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
