module.exports = {

  //create new org
  async post (req, res, next) {
    const dbcollection = req.db.collection("org");
    try {
      var result1 = await dbcollection.find({'orgNm':req.body.orgName}).toArray()
      if (result1.length>0) {
        const error = new Error('Org existed, please use other orgName');
        error.status = 400;
        throw error;
      }
      // req.body.createTime = new Date().toLocaleString();
      let createTime = new Date();
      req.body.crtTm = createTime.toISOString().split('.')[0];
      req.body.crtStmp = createTime.getTime();
      result2 = await dbcollection.insertOne(req.body)
      res.send(result2)
      res.end();
    } catch (error) {
      console.log("Create Org error: " + error)
      next(error)
    }
  },

  //  Get orgs
  async get (req, res, next) {
    const dbcollection = req.db.collection("org");
    try {
      var result = await dbcollection.find().toArray()
      res.send(result)
      res.end()
    } catch (error) {
      console.log("Get Org error: " + error)
      next(error)
    }
  },

  // Get org by name
  async getByName (req, res, next) {
    const dbcollection = req.db.collection("org");
    try {
      var result = await dbcollection.find({'orgName':req.params.name}).toArray()
      res.send(result)
      res.end()
    } catch (error) {
      console.log("Get Org error: " + error)
      next(error)
    }
  }
}
