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
      let UPC = req.body.UPC;
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
  },
  // Add product information
  async updateProduct (req, res, next) {
    const prdCollection = req.db.collection("product");
    try {
      result = await prdCollection.find({
        _id: req.body.UPC
      }).toArray()
      if (result !== []) {
        // Need some code to upateProduct        
        res.send(result);
        res.end()
      } else {
        const error = new Error('UPC not found');
        error.status = 404;
        throw error;
      }
    } catch (error) {
      console.log("Create Product error: " + error)
      next(error)
    }
  } 
}

