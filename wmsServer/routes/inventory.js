//query inventory for upc, for upc + location, for upc + seller org,...

//receive, pickup, shipment

module.exports = {
  async receive(req, res, next) {
    const dbcollection = req.db.collection("inventoryReceive");
    const invCollection = req.db.collection("inventory");
    const sellerInvCollection = req.db.collection("sellerInv");
    const locInvCollection = req.db.collection("locationInv");
    try {
      req.body.crtTm = new Date().toLocaleString(); // add data create Time
      req.body.mdfTm = req.body.crtTm; //add data modify Time
      
      result = await dbcollection.insertOne(req.body);
      const ogNm = req.body.ogNm;

      //todo update inventory table
      /*  raw request structure
        {
          "_id": {
            "$oid": "5bee2078a3e3574170b7d9f9"
          },
          "trNo": "9102805213683062123455",
          "ogNm": "D",
          "rcIts": [
            {
              "UPC": "744120875512",
              "qn": "4"
            },
            {
              "UPC": "4891081668038",
              "qn": "1"
            },
            {
              "UPC": "9787115230959",
              "qn": "3"
            }
          ],
          "crtTm": "Thu Nov 15 2018 20:42:16 GMT-0500 (Eastern Standard Time)",
          "mdfTm": "Thu Nov 15 2018 20:42:16 GMT-0500 (Eastern Standard Time)"
        } */

      for (var i = 0; i < req.body.rcIts.length; i++) {
        let proQ = req.body.rcIts[i];
        let aUPC = proQ.UPC;
        let aQty = Number(proQ.qn);
        //find product, if not find create product
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
      res.send(result);
      res.end();
    } catch (error) {
      console.log("receive error: " + error);
      next(error);
    }
  }
};
