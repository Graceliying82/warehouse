<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-content>
      <v-container v-if= "!this.submited">
        <h1>Create New User</h1>
      <v-form ref="form" v-model="valid">
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
            :rules="nameRules"
            required
          ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex lg5 xs12>
          <v-select
            :items ="orgNames"
            v-model="selectOrg"
            label="Organization Name"
            required></v-select>
          </v-flex>
          <v-flex lg5 xs12 offset-lg2>
          <v-select
            :items="userRoles"
            v-model="selectRole"
            label="User Role"
            required></v-select>
          </v-flex>
        </v-layout>
        <v-text-field
          name="password"
          label="Password for the new accout"
          id="password"
          v-model="password"
          :rules="passwordRules"
          min="8"
          :append-icon="pwv ? 'visibility' : 'visibility_off'"
          @click:append="() => (pwv = !pwv)"
          :type="!pwv ? 'password' : 'text'"
          required>
        </v-text-field>
        <v-btn
          :disabled="!valid"
          @click.prevent="createUser()"
          color="light-blue darken-2"
          type="submit">submit
        </v-btn>
        <v-btn @click="clear()">clear</v-btn>
      </v-form>
     </v-container>
        <v-container v-if= "this.submited">
          <h1>You have created a new User {{email}}</h1>
          <v-flex class="text-xs-center" mt-5>
            <v-btn color="light-blue darken-3"
              v-on:click="createAnother()">Create Another User
            </v-btn>
          </v-flex>
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
      selectOrg: null,
      selectRole: null,
      pwv: false,
      submited: false,
      isSupervisor: false,
      isWmsUser: false,
      isSeller: false,
      isBuyer: false,
      orgNames: [],
      orgs: null,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      nameRules: [
        v => !!v || 'User Name is required'
      ],
      passwordRules: [
        v => !!v || 'User Name is required',
        v => (v && v.length >= 6) || 'Password must be more than 6 characters'
      ],
      userRoles: [
        'Supervisor',
        'WmsUser',
        'Buyer',
        'Seller'
      ]
    }
  },
  methods: {
    clear () {
      this.$refs.form.reset()
    },
    setRole () {
      if (this.selectRole === this.items[0]) {
        this.isSupervisor = true
      } else if (this.selectRole === this.items[1]) {
        this.isWmsUser = true
      } else if (this.selectRole === this.items[2]) {
        this.isSeller = true
      } else if (this.selectRole === this.items[3]) {
        this.isBuyer = true
      }
    },
    resetData () {
      this.valid = true
      this.orgName = ''
      this.name = ''
      this.email = ''
      this.password = ''
      this.error = null
      this.selectOrg = null
      this.selectRole = null
      this.pwv = false
      this.isSupervisor = false
      this.isWmsUser = false
      this.isSeller = false
      this.isBuyer = false
      this.submited = false
    },
    async createUser () {
      try {
        this.$refs.form.validate()
        this.setRole()
        await AuthenticationService.createUser({
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
      } catch (error) {
        console.log('error:' + error.response.data.error)
      }
    },
    createAnother () {
      this.resetData()
    }
  },
  async created () {
    try {
      this.orgs = (await AuthenticationService.getOrgName()).data
    } catch (error) {
      console.log('error: ' + error)
    }
    for (var i in this.orgs) {
      this.orgNames.push(this.orgs[i].orgName)
    }
    this.orgNames.sort()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
