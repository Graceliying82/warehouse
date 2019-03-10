const nextKey = require('./nextKey');
var ObjectId = require('mongodb').ObjectID
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
  async cancelReq(req, res, next) {
    try {
      const upgradeCollection = req.db.collection("upgrade");
      const sellerInvCollection = req.db.collection("sellerInv");
      let o_id = ObjectId(req.body._id);
      let modifyTime = new Date()
      req.body.mdfTm = new Date(modifyTime.toLocaleString()+ ' UTC').toISOString().split('.')[0] +' EST'
      req.body.mdfStmp = modifyTime.getTime()
      let result = await upgradeCollection.findOne({_id: o_id})
      if ((result) && (result.status !== 'cancel')) {
        for (let item of result.baseUPCList) {
          await sellerInvCollection.findOneAndUpdate(
            {
              _id: { UPC: item.UPC, org: result.orgNm }
            }, //query
            {
              $inc: { qty: item.qty},
              $set: { mdfTm: req.body.crtTm, mdfStmp: req.body.crtStmp }
            },
            { upsert: true }
          );
        }

      }
      await upgradeCollection.findOneAndUpdate(
        {
          _id: o_id
        },
        {
          $set: { status: 'cancel', mdfTm: req.body.crtTm, mdfStmp: req.body.crtStmp }
        },
      )
      res.send('OK');
      res.end()
    } catch (error) {
      console.log("receive error: " + error);
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error);
    }
  },
  async getUpdPrdNeedInstr (req, res, next) {
    try {
      const upgradeCollection = req.db.collection("upgrade");
      const instructionCollection = req.db.collection("instruction");
      let upgList = await upgradeCollection.find({'status': 'active'}).toArray();
      let retList = [];
      for (let aUpg of upgList) {
        let toUPC = aUpg.targetUPC;
        for (let aBase of aUpg.baseUPCList) {
          let fromUPC = aBase.UPC;
          let inst = await instructionCollection.findOne({_id: {'fromUPC': fromUPC, 'toUPC': toUPC}});
          if (!inst) {
            retList.push({
              'fromUPC': fromUPC, 
              'toUPC': toUPC
            })
          }
        }
      }
      res.send(retList);
      res.end()
    } catch (error) {
      console.log("receive error: " + error);
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error);
    }
  }
}
