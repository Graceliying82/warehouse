<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-layout column>
      <v-flex xs8>
          <v-alert
            v-show = showAlert1
            :type = alertType1
            outline>
              {{message1}}
            </v-alert>
        </v-flex>
    </v-layout>
    <v-flex ma-5>
      <panel title='Create New User'>
        <v-form ref="form" v-model="valid" @submit.prevent>
            <v-layout row wrap>
              <v-flex md5 xs12 mx-5>
              <v-text-field
                v-model="usr.email"
                :rules="emailRules"
                label="Email"
                required
              ></v-text-field>
              </v-flex>
              <v-flex md5 xs12 mx-5>
              <v-text-field
                v-model="usr.usrNm"
                label="User Name"
                :rules="nameRules"
                required
              ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex md5 xs12 mx-5>
              <v-select
                :items="userRoles"
                v-model="selectRole"
                label="User Role"
                ref = "userRoles"
                @change="changeRole()"
                required></v-select>
              </v-flex>
              <v-flex md5 xs12 mx-5>
                <v-text-field
                  name="password"
                  label="Password for the new accout"
                  id="password"
                  v-model="usr.pswd"
                  :rules="passwordRules"
                  min="8"
                  :append-icon="pwv ? 'visibility' : 'visibility_off'"
                  @click:append="() => (pwv = !pwv)"
                  :type="!pwv ? 'password' : 'text'"
                  required>
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
          <v-btn
            v-if=valid
            @click.prevent="createUser()"
            dark>submit
          </v-btn>
          <v-btn @click.prevent="clear()" dark>clear</v-btn>
      </panel>
    </v-flex>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
export default {
  data () {
    return {
      alertType1: 'success',
      showAlert1: false,
      message1: '',
      valid: true,
      selectRole: null,
      pwv: false,
      usr: {
        'email': '',
        'pswd': '',
        'usrNm': '',
        'orgNm': 'WMS',
        'isSup': false,
        'isWms': false,
        'isB': false,
        'isS': false
      },
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
        'WmsUser'
      ]
    }
  },
  methods: {
    clearAlert () {
      this.showAlert1 = false
      this.message1 = ''
    },
    setAlert (type, message) {
      this.message1 = message
      this.alertType1 = type
      this.showAlert1 = true
    },
    clearData () {
      this.usr.email = ''
      this.usr.pswd = ''
      this.usr.usrNm = ''
      this.usr.orgNm = 'WMS'
      this.usr.isSup = false
      this.usr.isWms = false
      this.usr.isB = false
      this.usr.isS = false
      this.pwv = false
      this.selectRole = ''
      this.$refs.form.reset()
    },
    clear () {
      this.clearAlert()
      this.clearData()
    },
    changeRole () {
      if (this.selectRole === 'Supervisor') {
        this.usr.isSup = true
      } else if (this.selectRole === 'WmsUser') {
        this.usr.isWms = true
      }
    },
    async createUser () {
      try {
        // this.$refs.form.validate()
        await AuthenticationService.createUser(this.usr)
        this.setAlert('success', 'A new user ' + this.usr.usrNm + ' is added.')
        this.clearData()
      } catch (error) {
        if (!error.response) {
          // network error
          this.error = 'Network Error: Fail to connet to server'
        } else if (error.response.data.error.includes('jwt')) {
          console.log('jwt error')
          this.$store.dispatch('resetUserInfo', true)
          this.$router.push('/login')
        } else {
          console.log('error ' + error.response.status + ' : ' + error.response.statusText)
          this.error = error.response.data.error
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
