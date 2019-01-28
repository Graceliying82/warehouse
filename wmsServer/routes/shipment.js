module.exports = {
  async post(req, res, next) {
    try {
      const orderCollection = req.db.collection("shipment");
      let createTime = new Date()
      req.body.crtTm = new Date(createTime.toLocaleString()+ ' UTC').toISOString().split('.')[0] +' EST'
      req.body.crtStmp = createTime.getTime() // add a create timestamp
      req.body.mdfTm = req.body.crtTm; //add data modify Time
      req.body.mdfStmp = req.body.crtStmp; // add a modify timestamp
      let result = await orderCollection.find({'_id': req.body.trNo}).toArray()
      if (result.length>0) {
        res.send('Existed! Fail upload.');
        res.end()
      } else {
        await orderCollection.insertOne({
          _id: req.body.trNo, 
          orderID: req.body.orderID,
          orgNm: req.body.orgNm,
          rcIts: req.body.rcIts,
          crtTm: req.body.crtTm,
          crtStmp: req.body.crtStmp,
          mdfTm: req.body.mdfTm,
          mdfStmp: req.body.mdfStmp,
          status: req.body.status,
          userID: req.decoded.email,
        }) 
        console.log(req.body.orderID + ' : ' + 'Upload Success')
        res.send('Upload Success');
        res.end()
      }
    } catch (error) {
      console.log("receive error: " + error);
      error.message = 'Fail to access database! Try again'
      next(error);
    }
  }
}