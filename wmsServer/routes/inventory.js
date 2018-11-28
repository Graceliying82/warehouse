//query inventory for upc, for upc + location, for upc + seller org,...

//receive, pickup, shipment
function makeFlat(invResult) {
  let items = []
  for (let i = 0; i < invResult.length; i++) {
    for (let j = 0; j < invResult[i].rcIts.length; j++) {
      items.push({
        createTime: invResult[i].crtTm,
        trackingNo: invResult[i].trNo,
        orgName: invResult[i].ogNm,
        UPC: invResult[i].rcIts[j].UPC,
        productName: invResult[i].rcIts[j].prodNm,
        qn: invResult[i].rcIts[j].qn
      })
    }
  }
  return items
}

module.exports = {
  async post(req, res, next) {
    const dbcollection = req.db.collection("inventoryReceive");
    const invCollection = req.db.collection("inventory");
    const sellerInvCollection = req.db.collection("sellerInv");
    const locInvCollection = req.db.collection("locationInv");
    const prodCollection = req.db.collection("product");
    try {
      //Modify to add more test data:
      req.body.crtTm = new Date(new Date().setDate(new Date().getDate()-8)).toLocaleString()
//      req.body.crtTm = new Date(); // add data create Time
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
    if ((req.query.startDate !== undefined) && (req.query.endDate !== undefined)) {
      let qr = req.query
      var startDate = new Date(qr.startDate).toLocaleString()
      var endDate = new Date(qr.endDate).toLocaleString();
      let invCollection = req.db.collection("inventoryReceive");
      try {
        let invResult = await invCollection.find({
          crtTm: {
            $lte: endDate,
            $gte: startDate
          }
        }).toArray()
        console.log(invResult.length)
        res.send(makeFlat(invResult))
        res.end()
      } catch (error) {
        console.log("Get Org by dates error: " + error)
        next(error)
      }
    } else {
      let invCollection = req.db.collection("inventoryReceive");
      try {
        let invResult = await invCollection.find({
          crtTm: {
            $lte: new Date().toLocaleString(),
            $gt: new Date(new Date().setDate(new Date().getDate()-1)).toLocaleString()
          }
        }).toArray()
        res.send(makeFlat(invResult))
        res.end()
      } catch (error) {
        console.log("Get Org error: " + error)
        next(error)
      }
   }
  }
};
