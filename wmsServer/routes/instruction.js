module.exports = {
  //  Get instruction
  async get (req, res, next) {
    const dbCollection = req.db.collection("instruction");
    try {
      var result = await dbCollection.findOne({_id: {fromUPC: req.body.fromUPC, toUPC: req.body.toUPC}})
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

  async post (req, res, next) {
    const dbCollection = req.db.collection("instruction");
    let createTime = new Date()
    req.body.crtTm = new Date(createTime.toLocaleString()+ ' UTC').toISOString().split('.')[0] +' EST'
    req.body.crtStmp = createTime.getTime() // add a create timestamp
    req.body.mdfTm = req.body.crtTm; //add data modify Time
    req.body.mdfStmp = req.body.crtStmp; // add a modify timestamp
    try {
      await dbCollection.findOneAndUpdate(
        {
          _id: {fromUPC: req.body.fromUPC, toUPC: req.body.toUPC}
        },
        {
          $set: {
            reqParts: req.body.reqParts,
            offParts: req.body.offParts,
            steps: req.body.steps,
            note: req.body.note
          }
        },
        { upsert: true }
      )
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
}
