let ObjectId = require('mongodb').ObjectID
module.exports = {

  //create new org
  async post (req, res, next) {
    const dbcollection = req.db.collection("org");
    try {
      var result1 = await dbcollection.find({'orgNm':req.body.orgNm}).toArray()
      if (result1.length>0) {
        const error = new Error('Org Name existed. Please use other orgName');
        error.status = 400;
        return next(error);
      }
      // req.body.createTime = new Date().toLocaleString();
      let createTime = new Date();
      req.body.crtTm = new Date(createTime.toLocaleString()+ ' UTC').toISOString().split('.')[0] +' EST';
      req.body.crtStmp = createTime.getTime();
      result2 = await dbcollection.insertOne(req.body)
      res.send(result2)
      res.end();
    } catch (error) {
      console.log("Create Org error: " + error)
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error)
    }
  },

  async put (req, res, next) {
    const dbcollection = req.db.collection("org");
    let o_id = ObjectId(req.body._id);
    try {
      await dbcollection.findOneAndUpdate(
        {
          _id: o_id
        }, //query
        {
          $set: { orgNm: req.body.orgNm, dspt: req.body.dspt },
        }
      );
      res.send('Success')
      res.end();
    } catch (error) {
      console.log("Create Org error: " + error)
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
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
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
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
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error)
    }
  },

  //delete org by id
  async deleteById (req, res, next) {
    const dbcollection = req.db.collection("org");
    let o_id = ObjectId(req.body._id);
    try {
      await dbcollection.deleteOne(
        {
          "_id": o_id
        } //query
      )
      res.send('Delete success')
      res.end();
    } catch (error) {
      console.log("Create Org error: " + error)
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error)
    }
  }
}
