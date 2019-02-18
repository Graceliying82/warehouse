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
      <!-- Create New User -->
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
      <!-- Edit user -->
      <v-flex ma-5>
        <panel title = 'Users List'>
          <v-data-table
              :headers="usersHeaders"
              :items="users"
              :rows-per-page-items="rowsPerPageItems"
            >
            <template slot="items" slot-scope="props">
              <td class="text-xs-left">{{ props.item.usrNm }}</td>
              <td class="text-xs-left">{{ props.item.email }}</td>
              <td class="text-xs-left">{{ props.item.orgNm }}</td>
              <td class="text-xs-left">{{ props.item.isSup }}</td>
              <td class="text-xs-left">{{ props.item.isWms }}</td>
              <td class="text-xs-left">{{ props.item.status }}</td>
            </template>
          </v-data-table>
        </panel>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Users from '@/services/Users'
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
      users: [],
      rowsPerPageItems: [30, 60, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 }],
      usersHeaders: [
        { text: 'User Name', align: 'left', value: 'usrNm' },
        { text: 'Email', align: 'left', value: 'email' },
        { text: 'Org Name', align: 'left', value: 'orgNm' },
        { text: 'Supervisor', align: 'left', value: 'isSup' },
        { text: 'WmsUser', align: 'left', value: 'isWms' },
        { text: 'Status', align: 'left', value: 'status' }
      ],
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
        await Users.post(this.usr)
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
  },
  async created () {
    try {
      this.users = (await Users.get()).data
    } catch (error) {
      if (!error.response) {
        // network error
        this.setAlert('error', 'Network Error: Fail to connet to server')
      } else if (error.response.data.error.includes('jwt')) {
        console.log('jwt error')
        this.$store.dispatch('resetUserInfo', true)
        this.$router.push('/login')
      } else {
        console.log('error ' + error.response.status + ' : ' + error.response.statusText)
        this.setAlert('error', error.response.data.error)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
