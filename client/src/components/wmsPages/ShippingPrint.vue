<template>
  <div v-if="$store.state.isUserLoggedIn">
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
        <v-layout justify-center>
            <v-btn color="cyan darken-2"
              dark
              v-on:click.prevent="submit">Submit</v-btn>
            <v-btn color="cyan darken-2"
              dark
              v-on:click="clear">Clear</v-btn>
        </v-layout>
        <!-- Barcodes -->
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
          <!-- End Barcodes -->
    </v-layout>
  </div>
</template>

<script>
export default {
  data () {
    return {
      codes: '',
      barcodes: [],
      barcode: '',
      ready4Print: false
    }
  },
  methods: {
    handleCodes () {
      if (this.codes.length !== 0) {
        // Have to get rid of the last ';' in codes
        if (this.codes.charAt(this.codes.length - 1) === ';') {
          this.codes = this.codes.substring(0, this.codes.length - 1)
        }
        // get rid of the white space
        this.codes = this.codes.replace(/\s+/g, '')
        this.barcodes = this.codes.split(';', 10)
        let atrbName = ''
        for (let i = 0; i < this.barcodes.length; i++) {
          console.log('@' + this.barcodes[i] + '@')
          atrbName = '#barcode' + i
          // eslint-disable-next-line
          let result = JsBarcode(atrbName, this.barcodes[i])
          console.log(result)
        }
        this.codes = ''
      }
    },
    addCodes () {
      this.codes = this.codes + ';'
    },
    submit () {
      this.clearCanvas()
      this.handleCodes()
      this.codes = ''
    },
    clearCanvas () {
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
    },
    clear () {
      this.clearCanvas()
      this.codes = ''
      this.ready4Print = false
    }
    // printContent () {
    //   // console.log('Here')
    //   // let restorepage = document.body.innerHTML
    //   let printcontent = document.getElementById('printable').innerHTML
    //   let frame = document.createElement('IFRAME')
    //   frame.width = 0
    //   frame.height = 0
    //   document.body.appendChild(frame)
    //   frame.contentWindow.document.write(printcontent)
    //   frame.contentWindow.document.close()
    //   frame.contentWindow.focus()
    //   frame.contentWindow.print()
    //   document.body.removeChild(frame)
    // }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
