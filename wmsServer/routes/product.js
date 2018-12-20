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

      let invReceive = await invReceivecollection.findOne({_id: o_id, "rcIts.UPC": req.body.UPC},{orgNm:1,"rcIts.$.qn":1});
      let origOrgName = invReceive.orgNm;
      let origQuanity = invReceive.rcIts[0].qn;
      if (!req.body.qn){
        req.body.qn = origQuanity;
      }

      if ((req.body.orgNm) && (req.body.orgNm !== origOrgName)){
        await sellerInvCollection.findOneAndUpdate(
          {
            _id: { UPC: req.body.UPC, org: origOrgName }
          }, //query
          {
            $dec: { qty: origQuanity},
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

      await invReceivecollection.updateOne(
        {
          // "trNo": req.body.trNo,
          "_id": o_id,
          "rcIts.UPC": req.body.UPC
        },
        {
          $set: {
            "rcIts.$.price" : parseInt(req.body.price),
            "rcIts.$.qn" : req.body.qn,
            "note" : req.body.note,
            "orgNm" : req.body.orgNm
          }
        }

      )
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
