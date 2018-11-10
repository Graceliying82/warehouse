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
      var wmsPid = req.body.wmsPid;
      if ((wmsPid == null) || (wmsPid == undefined)) { 
        const error = new Error('wmsPid missing');
        error.status = 400;
        throw error;
      }
      var result1 = await dbcollection.find({'wmsPid':wmsPid}).toArray()
      if (result1.length>0) {
        const error = new Error('product existed, please use other wmsPid');
        error.status = 400;
        throw error;
      }
      req.body.createTime = new Date().toString();
      result2 = await dbcollection.insertOne(req.body)
      res.send(result2)
      res.end();
    } catch (error) {
      console.log("Create Product error: " + error)
      next(error)
    }
  }
}

