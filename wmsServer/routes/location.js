module.exports = {
  //create new location
  async post (req, res, next) {
    const dbcollection = req.db.collection("location");
    try {
      var result1 = await dbcollection.find({'locID':req.body.locID}).toArray()
      if (result1.length>0) {
        const error = new Error('Location ID existed. Please use other Location ID');
        error.status = 400;
        return next(error);
      }
      let createTime = new Date();
      req.body.crtTm = new Date(createTime.toLocaleString()+ ' UTC').toISOString().split('.')[0] +' EST';
      req.body.crtStmp = createTime.getTime();
      result2 = await dbcollection.insertOne(req.body)
      res.send(result2)
      res.end();
    } catch (error) {
      console.log("Create Location error: " + error)
      error.message = 'Fail to access database! Try again'
      next(error)
    }
  },
  //  Get Location
  async get (req, res, next) {
    const dbcollection = req.db.collection("location");
    let result = []
    try {
      if (req.query.locID !== undefined) {
        result = await dbcollection.find({'locID':req.query.locID}).toArray()
      } else {
        result = await dbcollection.find().toArray()
      }
      res.send(result)
      res.end()
    } catch (error) {
      console.log("Get Location error: " + error)
      error.message = 'Fail to access database! Try again'
      next(error)
    }
  }
}