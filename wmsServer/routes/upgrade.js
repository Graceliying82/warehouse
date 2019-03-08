const nextKey = require('./nextKey');
module.exports = {
  // create a upgrade task
  // id; taskID; targetUPC; prdNm; pid; orgNm; qty; baseUPC [upc; pid, qty]; crtTm; crtStmp; status(active/finish/cancel); log;
  async post(req, res, next) {
    try {
      const upgradeCollection = req.db.collection("upgrade");
      const sellerInvCollection = req.db.collection("sellerInv");
      let createTime = new Date()
      req.body.crtTm = new Date(createTime.toLocaleString() + ' UTC').toISOString().split('.')[0] + ' EST'
      req.body.crtStmp = createTime.getTime() // add a create timestamp
      req.body.mdfTm = req.body.crtTm; //add data modify Time
      req.body.mdfStmp = req.body.crtStmp; // add a modify timestamp
      req.body.taskID = await nextKey.key("upgrade",req.db);
      req.body.status = 'active'
      await upgradeCollection.insertOne(req.body)
      for (let item of req.body.baseUPCList) {
        await sellerInvCollection.findOneAndUpdate(
          {
            _id: { UPC: item.UPC, org: req.body.orgNm }
          }, //query
          {
            $inc: { qty: -item.qty},
            $set: { mdfTm: req.body.crtTm, mdfStmp: req.body.crtStmp }
          },
        );
      }
      res.send('Upgrade task created.');
      res.end()
    } catch (error) {
      console.log("receive error: " + error);
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error);
    }
  },
  async get(req, res, next) {
    try {
      const upgradeCollection = req.db.collection("upgrade");
      // req.query.status
      let result = ''
      if (req.query.status) {
        result = await upgradeCollection.find({status: req.query.status}).toArray()
      } else {
        result = await upgradeCollection.find().toArray()
      }
      res.send(result);
      res.end()
    } catch (error) {
      console.log("receive error: " + error);
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error);
    }
  },
}
