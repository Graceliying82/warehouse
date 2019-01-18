<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-layout row>
      <v-flex>
        <panel title = 'Order List'>
        </panel>
      </v-flex>
      <v-flex ml-5>
        <panel title = 'Upload Orders'>
          <input type= "file" id="orderFile" @change='readFile($event)' accept=".csv">
        </panel>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import * as csv from 'csvtojson'
export default {
  data () {
    return {
      csvFile: '',
      csvString: '',
      csvJson: []
    }
  },
  methods: {
    readerPromise (reader, file) {
      return new Promise(() => {
        reader.readAsText(file)
      })
    },

    // Wrap up FileReader as a promise
    readUploadedFileAsText (inputFile) {
      const temporaryFileReader = new FileReader()
      return new Promise((resolve, reject) => {
        temporaryFileReader.onerror = () => {
          temporaryFileReader.abort()
          reject(new DOMException('Problem parsing input file.'))
        }
        temporaryFileReader.onload = () => {
          resolve(temporaryFileReader.result)
        }
        temporaryFileReader.readAsText(inputFile)
      })
    },
    async readFile (event) {
      this.csvFile = event.target.files[0]
      try {
        this.csvString = await this.readUploadedFileAsText(this.csvFile)
      } catch (e) {
        console.warn(e.message)
      }
      this.csvJson = await csv().fromString(this.csvString)
        .then((jsonObj) => {
          return jsonObj
        })
    },
    showFile () {
      console.log(this.csvJson)
    }
  }
  // created () {
  //   this.orderFile = document.querySelector('input')
  //   if (this.orderFile) {
  //     console.log('come to created')
  //     this.orderFile.addEventListener('change', () => this.readFile())
  //   }
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
