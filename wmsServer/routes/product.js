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
      var UPC = req.body.UPC;
      // req.body.createTime = new Date().toLocaleString();
      let createTime = new Date();
      req.body.crtTm = createTime.toISOString().split('.')[0];
      req.body.crtStmp = createTime.getTime();
      result2 = await dbcollection.insertOne(req.body)
      res.send(result2)
      res.end();
    } catch (error) {
      console.log("Create Product error: " + error)
      next(error)
    }
  }
}

