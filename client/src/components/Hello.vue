<template>
  <div class="hello">
    <v-layout>
      <v-flex xs12 sm6 offset-sm3>
        <v-card v-if="!$store.state.isUserLoggedIn">
          <v-img
            src="https://cdn.vuetifyjs.com/images/cards/desert.jpg"
            aspect-ratio="2.75"
            @click="navigateTo({name: 'login'})"
          ></v-img>
          <v-card-title primary-title
            @click="navigateTo({name: 'login'})">
              <h3 class="headline mb-0">{{ msg }}</h3>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: 'Hello',
  data () {
    return {
      msg: 'Welcome! Please Login.'
    }
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
