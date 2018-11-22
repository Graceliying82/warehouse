//query inventory for upc, for upc + location, for upc + seller org,...

//receive, pickup, shipment

module.exports = {
  async post(req, res, next) {
    const dbcollection = req.db.collection("inventoryReceive");
    const invCollection = req.db.collection("inventory");
    const sellerInvCollection = req.db.collection("sellerInv");
    const locInvCollection = req.db.collection("locationInv");
    const prodCollection = req.db.collection("product");
    try {
      req.body.crtTm = new Date().toLocaleString(); // add data create Time
      req.body.mdfTm = req.body.crtTm; //add data modify Time
      const ogNm = req.body.ogNm;
      for (var i = 0; i < req.body.rcIts.length; i++) {
        let proQ = req.body.rcIts[i];
        let aUPC = proQ.UPC;
        let aQty = Number(proQ.qn);
        //find product, if not find create product
        prod = await prodCollection.findOne(
          {
            _id: aUPC
          },
          {
            projection: { _id: 0, prdNm: 1 }
          }
        );
        if (prod) {
          req.body.rcIts[i].prodNm = prod.prdNm;
        } else { //no product found
          await prodCollection.insertOne(
            {
              _id: aUPC, crtTm: req.body.crtTm, prdNm: "", status: 0
            }
          )
        }
        await invCollection.findOneAndUpdate(
          {
            _id: aUPC
          }, //query
          {
            $set: { mdfTm: req.body.crtTm },
            $inc: { qty: aQty }
          },
          { upsert: true }
        );
        await locInvCollection.findOneAndUpdate(
          {
            _id: {UPC: aUPC, loc: "WMS"}
          }, //query
          {
            $inc: { qty: aQty},
            $set: { mdfTm: req.body.crtTm }
          },
          { upsert: true }
        );
        await sellerInvCollection.findOneAndUpdate(
          {
            _id: { UPC: aUPC, org: ogNm }
          }, //query
          {
            $inc: { qty: aQty},
            $set: { mdfTm: req.body.crtTm }
          },
          { upsert: true }
        );
        
      }

      result = await dbcollection.insertOne(req.body);
      
      res.send(result);
      res.end();
    } catch (error) {
      console.log("receive error: " + error);
      next(error);
    }
  },

  async get(req, res, next) {
    let invCollection = req.db.collection("inventoryReceive");
    try {
      let invResult = await invCollection.find().toArray()
      res.send(invResult)
      res.end()
    } catch (error) {
      console.log("Get Org error: " + error)
      next(error)
    }
  }
};
