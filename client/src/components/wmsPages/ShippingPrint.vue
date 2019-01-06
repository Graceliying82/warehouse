<template>
  <div v-if="$store.state.isUserLoggedIn">
    <v-content>
      <v-container fill-height>
        <v-layout column>
          <v-flex>
              <v-text-field
                autofocus
                label="Scan or Input barcode; No more than 10 codes"
                ref="codes"
                v-model="codes"
                v-on:keydown.enter="addCodes()"
                required
                ></v-text-field>
            </v-flex>
            <v-flex class="text-xs-center" mt-5>
              <v-btn color="cyan darken-2"
                dark
                v-on:click="submit">Submit</v-btn>
            </v-flex>
            <v-flex class="text-xs-center" mt-5>
              <v-btn color="cyan darken-2"
                dark
                v-on:click="clear">Clear</v-btn>
            </v-flex>
            <v-flex>
               <canvas id = "barcode0" ></canvas>
            </v-flex>
            <v-flex>
               <canvas id = "barcode1" ></canvas>
            </v-flex>
            <v-flex>
               <canvas id = "barcode2" ></canvas>
            </v-flex>
            <v-flex>
               <canvas id = "barcode3" ></canvas>
            </v-flex>
            <v-flex>
               <canvas id = "barcode4" ></canvas>
            </v-flex>
            <v-flex>
               <canvas id = "barcode5" ></canvas>
            </v-flex>
            <v-flex>
               <canvas id = "barcode6" ></canvas>
            </v-flex>
            <v-flex>
               <canvas id = "barcode7" ></canvas>
            </v-flex>
            <v-flex>
               <canvas id = "barcode8" ></canvas>
            </v-flex>
            <v-flex>
               <canvas id = "barcode9" ></canvas>
            </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>

<script>
// var JsBarcode = require('jsbarcode')
export default {
  data () {
    return {
      codes: '',
      barcodes: [],
      barcode: ''
    }
  },
  methods: {
    handleCodes () {
      // Have to get rid of the last ';' in codes
      this.codes = this.codes.substring(0, this.codes.length - 1)
      this.barcodes = this.codes.split(';', 10)
      let atrbName = ''
      for (let i = 0; i < this.barcodes.length; i++) {
        atrbName = '#barcode' + i
        JsBarcode(atrbName, this.barcodes[i])
      }
      console.log(this.barcodes)
      // this.$nextTick(() => {
      //   for (let i = 0; i < this.barcodes.length; i++) {
      //     console.log(this.barcodes[i].id + '  ' + this.barcodes[i].code)
      //     JsBarcode(this.barcodes[i].id, this.barcodes[i].code)
      //   }
      // })
      // this.$nextTick(() => $nextTick(() => {
      //   let atrbName = ''
      //   for (let i = 0; i < this.barcodes.length; i++) {
      //     atrbName = '#barcode' + i
      //     console.log(atrbName)
      //     JsBarcode(atrbName, this.barcodes[i])
      //   }
      // })
      this.codes = ''
    },
    addCodes () {
      this.codes = this.codes + ';'
    },
    submit () {
      this.handleCodes()
      this.codes = ''
    },
    clear () {
      this.codes = ''
      let canvas = ''
      let ctx = ''
      let atrbName = ''
      for (let i = 0; i < 10; i++) {
        atrbName = 'barcode' + i
        canvas = document.getElementById(atrbName)
        ctx = canvas.getContext('2d')
        ctx.save()
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.restore()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
