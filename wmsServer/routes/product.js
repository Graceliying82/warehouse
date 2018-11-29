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
      req.body.crtTm = createTime.toISOString().split(".")[0];
      req.body.crtStmp = createTime.getTime();
      result2 = await dbcollection.insertOne(req.body);
      res.send(result2);
      res.end();
    } catch (error) {
      console.log("Create Product error: " + error);
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
      let mdfTm = modifyTime.toISOString().split(".")[0];
      let mdfStmp = modifyTime.getTime();

      await prdCollection.findOneAndUpdate(
        {
          _id: req.body.UPC
        }, //query
        {
          $set: { mdfTm: mdfTm, mdfStmp: mdfStmp },
          $set: { prdNm: req.body.prdNm }
        }
      );

      await invReceivecollection.findOneAndUpdate(
        {
          "trNo": req.body.trNo,
          "rcIts.UPC": req.body.UPC
        },
        {
          $set: {"rcIts.$.price" : new Number(req.body.price)}
        }
      )
      //update inventory receive
      //find one inventory receive by trancing NO
      //set price, set product name
      //update inventory receive recersive (for past 1 month)
      //update condition past 1 month,
    } catch (error) {
      console.log("Create Product error: " + error);
      next(error);
    }
  }
};
