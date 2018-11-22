module.exports = {
  //  Get Products
  async get (req, res, next) {
    const dbcollection = req.db.collection("product");
    try {
      var result = await dbcollection.find().toArray()
      res.send(result)
      res.end()
    } catch (error) {
      console.log("Get User error: " + error)
      next(error)
    }
  },
  //create product
  async post (req, res, next) {
    const dbcollection = req.db.collection("product");
    try {
      // await dbcollection.findOneAndUpdate(
      //   {
      //     _id: req.data.UPC
      //   }, //query
      //   {
      //     $set: { mdfTm: req.body.crtTm },
      //   },
      //   { upsert: true }
      // );
      var UPC = req.body.UPC;
      // if ((UPC == null) || (UPC == undefined)) { 
      //   const error = new Error('UPC missing');
      //   error.status = 406;
      //   throw error;
      // }
      // var result1 = await dbcollection.find({'UPC':UPC}).toArray()
      // if (result1.length>0) {
      //   const error = new Error('Product already existed!');
      //   error.status = 409;
      //   throw error;
      // }
      req.body.createTime = new Date().toLocaleString();
      // req.body._id = req.body.UPC;
      // delete req.body.UPC;
      result2 = await dbcollection.insertOne(req.body)
      res.send(result2)
      res.end();
    } catch (error) {
      console.log("Create Product error: " + error)
      next(error)
    }
  }
}

