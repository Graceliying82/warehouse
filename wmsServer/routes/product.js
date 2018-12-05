module.exports = {
  //  Get Products
  async get(req, res, next) {
    const dbcollection = req.db.collection("product");
    try {
      var result = await dbcollection.find().toArray();
      res.send(result);
      res.end();
    } catch (error) {
      console.log("Get User error: " + error);
      error.message = 'Fail to access database! Try again'
      next(error);
    }
  },
  //create product
  async post(req, res, next) {
    const dbcollection = req.db.collection("product");
    try {
      let UPC = req.body.UPC;
      // req.body.createTime = new Date().toLocaleString();
      let createTime = new Date();
      req.body.crtTm =  new Date(createTime.toLocaleString()+ ' UTC').toISOString().split('.')[0] +' EST';
      req.body.crtStmp = createTime.getTime();
      result2 = await dbcollection.insertOne(req.body);
      res.send(result2);
      res.end();
    } catch (error) {
      console.log("Create Product error: " + error);
      error.message = 'Fail to access database! Try again'
      next(error);
    }
  },
  // Add product information
  async updateProduct(req, res, next) {
    const prdCollection = req.db.collection("product");
    const invReceivecollection = req.db.collection("inventoryReceive");
    try {
      //update product find by upc
      let modifyTime = new Date();
      let mdfTm = new Date(modifyTime.toLocaleString()+ ' UTC').toISOString().split('.')[0] +' EST';
      let mdfStmp = modifyTime.getTime();

      //update inventory receive
      //find one inventory receive by trancing NO
      //set price, set product name
      //update inventory receive recersive (for past 1 month)
      //update condition past 1 month,

      await prdCollection.findOneAndUpdate(
        {
          _id: req.body.UPC
        }, //query
        {
          $set: { "mdfTm": mdfTm, "mdfStmp": mdfStmp, "prdNm": req.body.prdNm }
          // $set: { "mdfStmp": mdfStmp},
          // $set: { "prdNm": req.body.prdNm }
        }
      );
      await invReceivecollection.updateMany(
        {
          "trNo": req.body.trNo,
          "rcIts.UPC": req.body.UPC
        },
        {
          $set: {
            "rcIts.$.price" : parseInt(req.body.price),
            "note" : req.body.note
          }
        }

      )
      await invReceivecollection.updateMany(
        {
          "rcIts.UPC": req.body.UPC
        },
        {
          $set: {
            "rcIts.$.prdNm" : req.body.prdNm
          }
        }
      )
      //TODO ste status code 
      res.end();

    } catch (error) {
      console.log("Create Product error: " + error);
      error.message = 'Fail to access database! Try again'
      next(error);
    }
  }
};
