<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-content>
      <v-container v-if= "!this.submited">
        <h1>Creat A New User</h1>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-layout row wrap>
          <v-flex lg5 xs12>
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="Email"
            required
          ></v-text-field>
          </v-flex>
          <v-flex lg5 xs12 offset-lg2>
          <v-text-field
            v-model="name"
            label="User Name"
            required
          ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex lg5 xs12>
          <v-text-field
            v-model="orgName"
            label="Organization Name"
            required
          ></v-text-field>
          </v-flex>
          <v-flex lg5 xs12 offset-lg2>
          <v-select
            :items="items"
            v-model="select"
            label="User Role"
            required></v-select>
          </v-flex>
        </v-layout>
        <v-text-field
          name="password"
          label="Password for the new accout"
          id="password"
          v-model="password"
          min="8"
          :append-icon="pwv ? 'visibility' : 'visibility_off'"
          @click:append="() => (pwv = !pwv)"
          :type="!pwv ? 'password' : 'text'"
          required>
        </v-text-field>
        <v-btn
          :disabled="!valid"
          @click="createUser()"
          color="light-blue darken-2"
          type="submit">submit
        </v-btn>
        <v-btn @click="clear()">clear</v-btn>
        <v-container v-if= "this.submited">
          <h1>You have created a new User {{email}}</h1>
          <v-flex class="text-xs-center" mt-5>
            <v-btn color="light-blue darken-3"
              type="submit"
              v-on:click="createAnother()">Creat Another User
            </v-btn>
          </v-flex>
        </v-container>
      </v-form>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  data () {
    return {
      valid: true,
      orgName: '',
      name: '',
      email: '',
      password: '',
      error: null,
      select: null,
      pwv: false,
      submited: false,
      isSupervisor: false,
      isWmsUser: false,
      isSeller: false,
      isBuyer: false,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      items: [
        'Supervisor',
        'WmsUser',
        'Buyer',
        'Seller'
      ]
    }
  },
  methods: {
    createAnother () {
      this.email = ''
      this.password = ''
      this.pwv = false
      this.submited = !this.submited
    },
    clear () {
      this.$refs.form.reset()
    },
    setRole () {
      console.log('This.select: ' + this.select)
      if (this.select === this.items[0]) {
        this.isSupervisor = true
      } else if (this.select === this.items[1]) {
        this.isWmsUser = true
      } else if (this.select === this.items[2]) {
        this.isSeller = true
      } else if (this.select === this.items[3]) {
        this.isBuyer = true
      }
    },
    async createUser () {
      try {
        this.setRole()
        const response = await AuthenticationService.createUser({
          'email': this.email,
          'password': this.password,
          'userName': this.name,
          'OrgName': this.orgName,
          'isSupervisor': this.isSupervisor,
          'isWmsUser': this.isWmsUser,
          'isBuyer': this.isBuyer,
          'isSeller': this.isSeller
        })
        this.submited = true
        console.log('response: ' + response.data)
      } catch (error) {
        console.log('error:' + error.response.data.error)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
