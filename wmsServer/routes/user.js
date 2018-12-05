module.exports = {

  //create new user
  async post (req, res, next) {
    const dbcollection = req.db.collection("user");
    try {
      var result1 = await dbcollection.find({'email':req.body.email}).toArray()
      if (result1.length>0) {
        const error = new Error('User existed. Please use other email');
        error.status = 400;
        return next(error)
      }
      // req.body.createTime = new Date().toString();
      let createTime = new Date();
      req.body.crtTm = new Date(createTime.toLocaleString()+ ' UTC').toISOString().split('.')[0] +' EST'
      req.body.crtStmp = createTime.getTime();
      result2 = await dbcollection.insertOne(req.body);
      res.send(result2);
      res.end()
    } catch (error) {
      console.log("Create User error: " + error)
      error.message = 'Fail to access database! Try again'
      next(error)
    }
  },

  //  Get users
  async get (req, res, next) {
    const dbcollection = req.db.collection("user");
    try {
      var result = await dbcollection.find().toArray()
      res.send(result)
      res.end()
    } catch (error) {
      console.log("Get User error: " + error)
      error.message = 'Fail to access database! Try again'
      next(error)
    }
  }
}

