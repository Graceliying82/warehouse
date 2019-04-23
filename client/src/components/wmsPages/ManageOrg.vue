<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-layout column mx-5>
      <v-flex xs8>
          <v-alert
            v-show = showAlert1
            :type = alertType1
            outline>
              {{message1}}
            </v-alert>
      </v-flex>
      <!-- Add an Org -->
      <v-flex my-5>
        <panel title='Add a new organization'>
          <v-layout row>
            <v-flex mx-5>
              <v-text-field
                label='Organization Name'
                v-model="org.orgNm"
                clearable
              ></v-text-field>
            </v-flex>
            <v-flex mx-5>
              <v-text-field
                label='Description'
                v-model="org.dspt"
                clearable
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-btn dark @click.prevent="submit">submit</v-btn>
          <v-btn dark @click.prevent="clear">clear</v-btn>
        </panel>
      </v-flex>
      <!--Org List-->
      <v-layout>
        <v-flex md6 sm12>
          <panel title='Organization List'>
            <v-data-table
              :headers="orgHeaders"
              :items="orgList"
              :rows-per-page-items="rowsPerPageItems"
              class="elevation-1"
            >
              <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{ props.item.orgNm }}</td>
                <td class="text-xs-left">{{ props.item.dspt }}</td>
                <td
                  class="justify-left layout px-0">
                  <v-btn icon class="mx-0" @click="editItem(props.item)">
                    <v-icon color="teal">edit</v-icon>
                  </v-btn>
                  <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                    <v-icon color="teal">delete_forever</v-icon>
                  </v-btn>
                </td>
              </template>
            </v-data-table>
          </panel>
        </v-flex>
        <v-flex md6 sm12 ml-2>
          <v-dialog v-model="dialogEdit" max-width="500px">
            <panel title='Edit Org'>
              <v-flex mx-5>
              <v-text-field
                label='Organization Name'
                v-model="editedItem.orgNm"
                clearable
              ></v-text-field>
            </v-flex>
            <v-flex mx-5>
              <v-text-field
                label='Description'
                v-model="editedItem.dspt"
                clearable
              ></v-text-field>
            </v-flex>
            <v-btn dark @click.prevent="confirmEdit">confirm</v-btn>
            <v-btn dark @click.prevent="clearEdit">cancel</v-btn>
            </panel>
          </v-dialog>
          <v-dialog v-model="dialogDel" max-width="500px">
            <panel title='Delete Org'>
              <h2>You are going to delete Org {{editedItem.orgNm}}</h2>
              <v-btn dark @click.prevent="confirmDel">confirm</v-btn>
              <v-btn dark @click.prevent="clearDel">cancel</v-btn>
            </panel>
          </v-dialog>
        </v-flex>
      </v-layout>
    </v-layout>
  </div>
</template>

<script>
import Org from '@/services/OrgService'
export default {
  data () {
    return {
      alertType1: 'success',
      showAlert1: false,
      message1: '',
      org: {
        orgNm: '',
        dspt: ''
      },
      dialogEdit: false,
      dialogDel: false,
      orgList: [],
      orgHeaders: [
        { text: 'Org Name', align: 'left', value: 'orgNm' },
        { text: 'Description', align: 'left', value: 'dspt' },
        { text: 'Actions', align: 'left', value: '_id' }
      ],
      editedIndex: -1,
      editedItem: {
        orgNm: '',
        dspt: '',
        _id: ''
      },
      rowsPerPageItems: [30, 60, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 }]
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
    clear () {
      this.clearAlert()
      this.org.orgNm = ''
      this.org.dspt = ''
    },
    async submit () {
      try {
        this.org.orgNm = this.org.orgNm.trim()
        this.org.dspt = this.org.dspt.trim()
        await Org.post(this.org)
        this.showOrgs()
        this.clear()
        this.setAlert('success', 'Add a new organization')
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
    },
    async showOrgs () {
      try {
        this.orgList = (await Org.get()).data
        // console.log(this.orgList)
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
    },
    editItem (item) {
      this.dialogEdit = true
      this.editedIndex = this.orgList.indexOf(item)
      this.editedItem = Object.assign({}, item)
    },
    deleteItem (item) {
      this.dialogDel = true
      this.editedIndex = this.orgList.indexOf(item)
      this.editedItem = Object.assign({}, item)
    },
    async confirmEdit () {
      try {
        // this.org.orgNm = this.org.orgNm.trim()
        // this.org.dspt = this.org.dspt.trim()
        // await Org.post(this.org)
        // this.clear()
        // this.setAlert('success', 'Add a new organization')
        if (this.editedItem.orgNm === '') {
          this.setAlert('error', 'Org Name is required')
        } else {
          // console.log(this.editedItem)
          await Org.put(this.editedItem)
          this.dialogEdit = false
          this.setAlert('success', 'Edit Item successfully')
          await this.showOrgs()
        }
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
    },
    clearEdit () {
      this.dialogEdit = false
    },
    async confirmDel () {
      try {
        await Org.deleteById(this.editedItem)
        this.dialogDel = false
        this.setAlert('success', 'Delete Item successfully')
        await this.showOrgs()
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
    },
    clearDel () {
      this.dialogDel = false
    }
  },
  mounted () {
    this.showOrgs()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
