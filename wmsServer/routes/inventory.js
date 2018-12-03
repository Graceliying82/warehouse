//query inventory for upc, for upc + location, for upc + seller org,...

//receive, pickup, shipment
function makeFlat(invResult) {
  let items = []
  for (let i = 0; i < invResult.length; i++) {
    for (let j = 0; j < invResult[i].rcIts.length; j++) {
      items.push({
        createTime: invResult[i].crtTm,
        trackingNo: invResult[i].trNo,
        orgName: invResult[i].orgNm,
        note: invResult[i].note,
        UPC: invResult[i].rcIts[j].UPC,
        productName: invResult[i].rcIts[j].prdNm,
        qn: invResult[i].rcIts[j].qn,
        price: invResult[i].rcIts[j].price / 100
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
      // let createTime = new Date(new Date().setDate(new Date().getDate()-49))
      let createTime = new Date()
      req.body.crtTm = new Date(createTime.toLocaleString()+ ' UTC').toISOString().split('.')[0] +' EST'
      req.body.crtStmp = createTime.getTime() // add a create timestamp
      req.body.mdfTm = req.body.crtTm; //add data modify Time
      req.body.mdfStmp = req.body.crtStmp; // add a modify timestamp
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
          req.body.rcIts[i].prdNm = prod.prdNm;
        } else { //no product found
          await prodCollection.insertOne(
            {
              _id: aUPC, prdNm: "", status: 0, crtTm: req.body.crtTm, crtStmp: req.body.crtStmp }
          )
        }
        await invCollection.findOneAndUpdate(
          {
            _id: aUPC
          }, //query
          {
            $set: { mdfTm: req.body.crtTm, mdfStmp: req.body.crtStmp },
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
            $set: { mdfTm: req.body.crtTm, mdfStmp: req.body.crtStmp }
          },
          { upsert: true }
        );
        await sellerInvCollection.findOneAndUpdate(
          {
            _id: { UPC: aUPC, org: ogNm }
          }, //query
          {
            $inc: { qty: aQty},
            $set: { mdfTm: req.body.crtTm, mdfStmp: req.body.crtStmp }
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
    if ((req.query.startDate !== undefined) && (req.query.endDate !== undefined)) {
      var startDate = new Date(req.query.startDate).getTime() 
      var endDate = new Date(req.query.endDate).getTime()
      if (req.query.orgNm == undefined) {
        try {
          let invResult = await invCollection.find({
            crtStmp: {
              $lte: endDate,
              $gte: startDate,
            }
          }).toArray();
          res.send(makeFlat(invResult))
          res.end()
        } catch (error) {
          console.log("Get Org by dates error: " + error)
          next(error)
        }
      } else {
        try {
          let invResult = await invCollection.find({
            crtStmp: {
              $lte: endDate,
              $gte: startDate
            },
            orgNm : req.query.orgNm
          }).toArray();
          res.send(makeFlat(invResult));
          res.end()
        } catch (error) {
          console.log("Get Org by dates error: " + error)
          next(error)
        }
      }
    } else {
      try {
        let invResult = await invCollection.find().toArray()
        res.send(makeFlat(invResult))
        res.end()
      } catch (error) {
        console.log("Get Org error: " + error)
        next(error)
      }
   }
  }
};
