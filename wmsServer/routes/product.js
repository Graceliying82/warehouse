var ObjectId = require('mongodb').ObjectID
module.exports = {
  //  Get Products
  async get(req, res, next) {
    const dbcollection = req.db.collection("product");
    try {
      var result = await dbcollection.find().toArray();
      res.send(result);
      res.end();
    } catch (error) {
      console.log("Get User error: " + error);
      error.message = 'Fail to access database! Try again'
      next(error);
    }
  },
  //create product
  async post(req, res, next) {
    const dbcollection = req.db.collection("product");
    try {
      let UPC = req.body.UPC;
      // req.body.createTime = new Date().toLocaleString();
      let createTime = new Date();
      req.body.crtTm =  new Date(createTime.toLocaleString()+ ' UTC').toISOString().split('.')[0] +' EST';
      req.body.crtStmp = createTime.getTime();
      result2 = await dbcollection.insertOne(req.body);
      res.send(result2);
      res.end();
    } catch (error) {
      console.log("Create Product error: " + error);
      error.message = 'Fail to access database! Try again'
      next(error);
    }
  },
  // Add product information
  async updateProduct(req, res, next) {
    const prdCollection = req.db.collection("product");
    const invReceivecollection = req.db.collection("inventoryReceive");
    const sellerInvCollection = req.db.collection("sellerInv");
    const locInvCollection = req.db.collection("locationInv");
    const invCollection = req.db.collection("inventory");
    
    try {
      //update product find by upc
      let modifyTime = new Date();
      let mdfTm = new Date(modifyTime.toLocaleString()+ ' UTC').toISOString().split('.')[0] +' EST';
      let mdfStmp = modifyTime.getTime();
      let o_id = ObjectId(req.body._id);

      //update inventory receive
      //find one inventory receive by trancing NO
      //set price, set product name
      //update inventory receive recersive (for past 1 month)
      //update condition past 1 month,      

      // Updating quantity
      let invReceive = await invReceivecollection.findOne({_id: o_id, "rcIts.UPC": req.body.UPC},{orgNm:1,"rcIts.$.qn":1, trNo:1});
      let origOrgName = invReceive.orgNm;
      let origQuantity = invReceive.rcIts[0].qn;
      if (invReceive.trNo !== req.body.trNo) {
        let existedTracking = await invReceivecollection.findOne({trNo: req.body.trNo}, {});
        if (existedTracking !== null) {
          const error = new Error('Tracking No existed! Change another one!');
          error.status = 400;
          return next(error);
        }
      }
      if (req.body.qn && req.body.qn !== origQuantity){
        // let invLocOId = ObjectId({UPC: req.body.UPC, loc:"WMS"});
        // let invLocation = await locInvCollection.findOne({_id:invLocOId},{qty:1});
        // _id: { UPC: req.body.UPC, org: origOrgName }
        let invLocation = await locInvCollection.findOne({_id:{ UPC: req.body.UPC, loc:"WMS"}},{qty:1});
        let qnDelt = req.body.qn - origQuantity;
        
        //todo think more about the logic - quantity change 

        if (qnDelt !== 0){
          //Delete some items
          //invLocation.qty(wms) < origQuantity - req.body.qn  error: Not enough items.
          if ( (invLocation.qty + qnDelt) < 0) {
            const error = new Error('Products moved out of WMS');
            error.status = 400;
            return next(error);
          } else {
            // Make quantity change on locationInventory, inventoryReceive and inventory
            await locInvCollection.findOneAndUpdate(
              {
                _id: { UPC: req.body.UPC, loc:"WMS"}
              }, //query
              {
                $inc: { qty: qnDelt},
                $set: { mdfTm: mdfTm, mdfStmp: mdfStmp }
              }
            )
            await invCollection.findOneAndUpdate(
              {
                _id: req.body.UPC
              }, //query
              {
                $inc: { qty: qnDelt},
                $set: { mdfTm: mdfTm, mdfStmp: mdfStmp }
              }
            )
            await invReceivecollection.findOneAndUpdate(
              {
                _id: o_id,
                "rcIts.UPC": req.body.UPC
              }, //query
              {
                $inc: { "rcIts.$.qn" : qnDelt},
                $set: { mdfTm: mdfTm, mdfStmp: mdfStmp }
              }
            )
          };
        }
        //todo update inventory collection
      }
      if (!req.body.qn){
        req.body.qn = origQuantity;
      }
      // Todo: update tracking No
      await invReceivecollection.findOneAndUpdate(
        {
          _id: o_id
        }, //query
        {
          $set: {"mdfTm": mdfTm, "mdfStmp": mdfStmp,"trNo": req.body.trNo}
        }
      )
      // update product Name
      await prdCollection.findOneAndUpdate(
        {
          _id: req.body.UPC
        }, //query
        {
          $set: { "mdfTm": mdfTm, "mdfStmp": mdfStmp, "prdNm": req.body.prdNm }
          // $set: { "mdfStmp": mdfStmp},
          // $set: { "prdNm": req.body.prdNm }
        }
      );

      //org change
      if ((req.body.orgNm) && (req.body.orgNm !== origOrgName)){
        await sellerInvCollection.findOneAndUpdate(
          {
            _id: { UPC: req.body.UPC, org: origOrgName }
          }, //query
          {
            $inc: { qty: -origQuantity},
            $set: { mdfTm: mdfTm, mdfStmp: mdfStmp }
          }
        );

        await sellerInvCollection.findOneAndUpdate(
          {
            _id: { UPC: req.body.UPC, org: req.body.orgNm }
          }, //query
          {
            $inc: { qty: req.body.qn},
            $set: { mdfTm: mdfTm, mdfStmp: mdfStmp }
          },
          { upsert: true }
        );

      }

// update price
      await invReceivecollection.updateOne(
        {
          // "trNo": req.body.trNo,
          "_id": o_id,
          "rcIts.UPC": req.body.UPC
        },
        {
          $set: {
            "rcIts.$.price" : parseInt(req.body.price),
            "note" : req.body.note,
            "orgNm" : req.body.orgNm
          }
        }

      )

      //update product name
      await invReceivecollection.updateMany(
        {
          "rcIts.UPC": req.body.UPC
        },
        {
          $set: {
            "rcIts.$.prdNm" : req.body.prdNm
          }
        }
      )
      //TODO ste status code 
      res.end();

    } catch (error) {
      console.log("Update Product error: " + error);
      error.message = 'Fail to access database! Try again'
      next(error);
    }
  },

  // Delete a receiving records information
  async deleteProduct(req, res, next) {
    const invReceivecollection = req.db.collection("inventoryReceive");
    const sellerInvCollection = req.db.collection("sellerInv");
    try {
      let modifyTime = new Date();
      let mdfTm = new Date(modifyTime.toLocaleString()+ ' UTC').toISOString().split('.')[0] +' EST';
      let mdfStmp = modifyTime.getTime();
      let o_id = ObjectId(req.body._id);
      let invReceive = await invReceivecollection.findOne({_id: o_id},{orgNm:1,"rcIts.$.UPC":1,"rcIts.$.qn":1});
      let rcIts = invReceive.rcIts;
      let orgName = invReceive.orgNm;

      for (let i = 0; i < rcIts.length; i++){
        await sellerInvCollection.findOneAndUpdate(
          {
            _id: { UPC: rcIts[i].UPC, org: orgName }
          }, //query
          {
            $dec: { qty: rcIts[i].qn},
            $set: { mdfTm: mdfTm, mdfStmp: mdfStmp }
          }
        );
      }
//todo how to handle location inventory

      let result = await invReceivecollection.deleteOne(
        {
          "_id": o_id
        } //query
      );



      res.send(result)
      res.end();
    } catch (error) {
      console.log("Create Product error: " + error);
      error.message = 'Fail to access database! Try again'
      next(error);
    }
  }
};
