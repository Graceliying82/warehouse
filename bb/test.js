function unzipRequest(file_url) {
  return new Promise(resolve => {
    let Admzip = require('adm-zip');
    let request = require("request");
    request.get({url: file_url, encoding: null}, (err, res, body) => {
      let zip = new Admzip(body)
      var zipEntries = zip.getEntries();
      console.log(zipEntries.length);
      for (var i = 0; i < zipEntries.length; i++) {
      //   if (zipEntries[i].entryName.match(/.JSON/))
        let json = zip.readAsText(zipEntries[i])
        console.log(json);
      }
    })
  })
}
async function test() {
  try {
    await unzipRequest("https://zme-caps.amazon.com/t/OZ3deGf22MpQ/SoJ34yrTT4WMYIW34ZCpQzQc5HeqQUe7hmRNb28YNyc/1")
    // var request = require("request");
    // var zlib = require("zlib");
    // var fs = require("fs");
    
    // let response = request(
    //   "https://zme-caps.amazon.com/t/OZ3deGf22MpQ/SoJ34yrTT4WMYIW34ZCpQzQc5HeqQUe7hmRNb28YNyc/1"
    // );
    // const stream = fs.createReadStream(response)
    // const chunks = [];
    // // response.pipe(chunks)
    // stream.on("data", function(chunk){
    //   chunks.push(chunk);
    // })
    // let inflated = zlib.inflateSync(chunks).toString();
    // console.log(inflated)
    // let b = response.pipe(zlib.createGunzip());
    // const output = fs.createWriteStream()
    // b.pipe(out);
    // let c = b._buffer;
    // let d = c.toString("utf8");
    // console.log(c);
    // console.log(d);
  } catch (error) {
    console.log(error);
  }
}

// function sleep(ms) {
//   return new Promise(resolve => {
//     setTimeout(resolve, ms);
//   });
// }

// async function test2() {
//   try {
//     var request = require("request");
//     var fs = require("fs");
//     // out = fs.createWriteStream("./bb/a.zip");
//     let response = request(
//       "https://zme-caps.amazon.com/t/OZ3deGf22MpQ/SoJ34yrTT4WMYIW34ZCpQzQc5HeqQUe7hmRNb28YNyc/1"
//     );
//     response.pipe(out);
//     response.end();
//     out.destroy();
//   } catch (error) {
//     console.log(error);
//   }
// }

// async function test3() {
//   try {
//     var Admzip = require("adm-zip");
//     var zip = new Admzip("./bb/a.zip");
//     var zipEntries = zip.getEntries();
//     zipEntries.forEach(function(zipEntry) {
//       console.log(zipEntry.toString()); // outputs zip entries information
//       let content = zipEntry.getData().toString("utf8");
//       console.log(zipEntry.getData().toString("utf8"));
      
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }
//  test2();
//  test3();
test()