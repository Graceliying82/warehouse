const nextKey = require('./nextKey');
var ObjectId = require('mongodb').ObjectID
// async function cancelUpgrade (db, upgradeID) {
//   let createTime = new Date()
//   let mdfTm = new Date(createTime.toLocaleString() + ' UTC').toISOString().split('.')[0] + ' EST'
//   let mdfStmp = createTime.getTime() // add a create timestamp
//   try {
//     const upgradeCollection = db.collection("upgrade");
//     const sellerInvCollection = db.collection("sellerInv");
//     let o_id = ObjectId(upgradeID);
//     let result = await upgradeCollection.findOne({_id: o_id})
//     if ((result) && (result.status !== 'cancel')) {
//       for (let item of result.baseUPCList) {
//         await sellerInvCollection.findOneAndUpdate(
//           {
//             _id: { UPC: item.UPC, org: result.orgNm }
//           }, //query
//           {
//             $inc: { qty: item.qty},
//             $set: { 'mdfTm': mdfTm, 'mdfStmp': mdfStmp }
//           },
//           { upsert: true }
//         );
//       }

//     }
//     await upgradeCollection.findOneAndUpdate(
//       {
//         _id: o_id
//       },
//       {
//         $set: { 'status': 'cancel', 'mdfTm': mdfTm, 'mdfStmp': mdfStmp }
//       },
//     )
//   } catch (error) {
//     console.log("receive error: " + error);
//     if (error.message === null) {
//       error.message = 'Fail to access database! Try again'
//     };
//     next(error);
//   }
// }
module.exports = {
  // create a upgrade task
  // id; taskID; targetUPC; prdNm; pid; orgNm; qty; baseUPC [upc; pid, qty]; crtTm; crtStmp; status(active/finish/cancel); log;
  async post(req, res, next) {
    try {
      const upgradeCollection = req.db.collection("upgrade");
      const sellerInvCollection = req.db.collection("sellerInv");
      const shipCollection = req.db.collection("shipment");
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
      if (req.body.trNo) {
        // Has a shipment related to this upgrade. Need to update shipment information too
        // trNo: req.body.trNo; taskID: req.body.taskID;
        await shipCollection.findOneAndUpdate(
          {
            _id: req.body.trNo,
            "rcIts.UPC": req.body.targetUPC
          },
          {
            $set: {
              status: 'upgrade',
              "rcIts.$.status": 'upgrade',
              "rcIts.$.taskID": req.body.taskID,
              mdfTm: req.body.crtTm,
              mdfStmp: req.body.crtStmp
            }
          }
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
  // cancel by upgrade _id or by taskID
  async cancelUpgrade(req, res, next) {
    try {
      const upgradeCollection = req.db.collection("upgrade");
      const sellerInvCollection = req.db.collection("sellerInv");
      const shipmentCollection = req.db.collection("shipment");
      let createTime = new Date();
      let mdfTm = new Date(createTime.toLocaleString() + ' UTC').toISOString().split('.')[0] + ' EST';
      let mdfStmp = createTime.getTime(); // add a create timestamp
      let result = ''
      if (req.body._id) {
        // Cancelled by upgrade _id only. 
        let o_id = ObjectId(req.body._id);
        result = await upgradeCollection.findOneAndUpdate(
          {
            _id: o_id,
            status: 'active'
          },
          {
            $set: { 'status': 'cancel', 'mdfTm': mdfTm, 'mdfStmp': mdfStmp }
          },
          {
            returnOriginal: true
          }
        );
      } else if (req.body.taskID) {
        // Cancelled by upgrade taskID
        result = await upgradeCollection.findOneAndUpdate(
          {
            taskID: req.body.taskID,
            status: 'active'
          },
          {
            $set: { 'status': 'cancel', 'mdfTm': mdfTm, 'mdfStmp': mdfStmp }
          },
          {
            returnOriginal: true
          }
        );
      }
      // result point to document before updating.
      if (result.value) {
        for (let item of result.value.baseUPCList) {
          await sellerInvCollection.findOneAndUpdate(
            {
              _id: { UPC: item.UPC, org: result.value.orgNm }
            }, //query
            {
              $inc: { qty: item.qty},
              $set: { 'mdfTm': mdfTm, 'mdfStmp': mdfStmp }
            },
            { upsert: true }
          );
        }
        if (result.value.taskID) {
          await shipmentCollection.findOneAndUpdate(
            {
              'rcIts.taskID': result.value.taskID
            },
            {
              $set: {
                'rcIts.$.status': 'ready',
                'rcIts.$.taskID': '',
                'mdfTm': mdfTm, 
                'mdfStmp': mdfStmp
              }
            }
          )
        }
      }
      res.send('OK');
      res.end();
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
  },
  // input:
  // 'targetUPC': UPC,
  // 'qty': qty,
  // 'orgNm': item.orgNm
  // 'urgent': true/false
  // if targetUPC doesn't has a origUPC or origUPC equals to targetUPC, this product is not fast upgradable (fast upgrade)
  // should return false
  // if a targetUPC has a origUPC but qty of origUPC < qty required for upgrade, this product is not fast upgradable
  // should return false
  // else return true.
  async fastUpgrade (req, res, next) {
    const prodCollection = req.db.collection("product");
    const sellerInvCollection = req.db.collection("sellerInv");
    const shipmentCollection = req.db.collection("shipment");
    const upgradeCollection = req.db.collection("upgrade");
    try {
      let upgradable = true
      let message = ''
      let targetPrd = await prodCollection.findOne({ _id: req.body.targetUPC });
      if ((!targetPrd.origUPC) || (targetPrd.origUPC === req.body.targetUPC)) {
        upgradable = false
        message = 'This product is qualify for One-click Upgrade. Please try regular upgrade.'
      } else {
        let sellerInv = await sellerInvCollection.findOne({ _id: {UPC: targetPrd.origUPC, org: req.body.orgNm}});
        if ((!sellerInv) || (sellerInv.qty < req.body.qty)) {
          upgradable = false;
          message = 'Not enough seller inventory for One-click upgrade. Please try regular upgrade.'
        } else {
          upgradable = true;
          let upgradeInfo = {}
          let createTime = new Date()
          upgradeInfo.crtTm = new Date(createTime.toLocaleString() + ' UTC').toISOString().split('.')[0] + ' EST'
          upgradeInfo.crtStmp = createTime.getTime() // add a create timestamp
          upgradeInfo.mdfTm = upgradeInfo.crtTm; //add data modify Time
          upgradeInfo.mdfStmp = upgradeInfo.crtStmp; // add a modify timestamp
          upgradeInfo.targetUPC = req.body.targetUPC;
          upgradeInfo.orgNm = req.body.orgNm;
          upgradeInfo.prdNm = targetPrd.prdNm;
          upgradeInfo.pid = targetPrd.pid;
          upgradeInfo.qty = req.body.qty;
          upgradeInfo.status = 'active';
          upgradeInfo.taskID = await nextKey.key("upgrade",req.db);
          upgradeInfo.urgent = req.body.urgent;
          upgradeInfo.baseUPCList = [];
          upgradeInfo.trNo = req.body.trNo;
          let origPrd = await prodCollection.findOne({ _id:  targetPrd.origUPC});
          upgradeInfo.baseUPCList.push({
            'UPC': targetPrd.origUPC,
            'pid': origPrd.pid,
            'qty': req.body.qty
          })
          await sellerInvCollection.findOneAndUpdate(
            {
              _id: {UPC: targetPrd.origUPC, org: req.body.orgNm}
            }, //query
            {
              $inc: { qty: -req.body.qty},
              $set: { mdfTm: upgradeInfo.mdfTm, mdfStmp: upgradeInfo.mdfStmp }
            },
          );
          await upgradeCollection.insertOne(upgradeInfo);
          message = 'Creat a upgrade successfully.';
          await shipmentCollection.findOneAndUpdate(
            {
              _id: req.body.trNo,
              "rcIts.UPC": req.body.targetUPC
            }, //query
            {
              $set: {
                status: 'upgrade',
                "rcIts.$.status": 'upgrade',
                "rcIts.$.taskID": upgradeInfo.taskID,
                mdfTm: upgradeInfo.mdfTm,
                mdfStmp: upgradeInfo.mdfStmp
              }
            },
          );
        }
      }
      res.send({
        'upgradable': upgradable,
        'message': message
      });
      res.end();
    } catch (error) {
      console.log("query product inventory: " + error);
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error);
    }
  },
  // // Cancel an upgrade with shipment information
  // // input: shipmentID; UPC; taskID
  // async cancelUpgradeWithShip(req, res, next) {
  //   const upgradeCollection = req.db.collection("upgrade");
  //   const shipmentCollection = req.db.collection("shipment");
  //   let createTime = new Date()
  //   let mdfTm = new Date(createTime.toLocaleString() + ' UTC').toISOString().split('.')[0] + ' EST'
  //   let mdfStmp = createTime.getTime() // add a create timestamp
  //   try {
  //     let upgrade = await upgradeCollection.findOne({taskID: req.body.taskID});
  //     if ((!upgrade)) {
  //       const error = new Error('Upgrade: ' + req.body.taskID + ' not found!');
  //       error.status = 400;
  //       return next(error)
  //     }
  //     await cancelUpgrade(req.db, upgrade._id);
  //     await shipmentCollection.findOneAndUpdate(
  //       {
  //         _id: req.body.shipmentID,
  //         'rcIts.UPC': req.body.UPC
  //       },
  //       {
  //         $set: {
  //           'rcIts.$.status': 'ready',
  //           'rcIts.$.taskID': '',
  //           'mdfTm': mdfTm, 
  //           'mdfStmp': mdfStmp
  //         }
  //       }
  //     )
  //     res.send('Upgrade for shipment has been canceled.');
  //     res.end()
  //   } catch (error) {
  //     console.log("receive error: " + error);
  //     if (error.message === null) {
  //       error.message = 'Fail to access database! Try again'
  //     };
  //     next(error);
  //   }
  // },
}
