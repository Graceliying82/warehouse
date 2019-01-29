module.exports = {
  async post(req, res, next) {
    try {
      const shipmentCollection = req.db.collection("shipment");
      let createTime = new Date()
      req.body.crtTm = new Date(createTime.toLocaleString() + ' UTC').toISOString().split('.')[0] + ' EST'
      req.body.crtStmp = createTime.getTime() // add a create timestamp
      req.body.mdfTm = req.body.crtTm; //add data modify Time
      req.body.mdfStmp = req.body.crtStmp; // add a modify timestamp
      let result = await shipmentCollection.find({ '_id': req.body.trNo }).toArray()
      if (result.length > 0) {
        res.send('Existed! Fail upload.');
        res.end()
      } else {
        await shipmentCollection.insertOne({
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
  },
  //startDate, endDate, status are mandatory, 
  //valid status = all, ready, update, ship
  async get(req, res, next) {
    const shipmentCollection = req.db.collection("shipment");
    try {
      if ((req.query.startDate === undefined) ||
        (req.query.endDate === undefined) ||
        (req.query.status === null)) {
        const error = new Error('startDate, endDate, status have to be passed');
        error.status = 400;
        return next(error);
      };
      let startDate = new Date(req.query.startDate).getTime();
      let endDate = new Date(req.query.endDate).getTime();
      let status = req.query.status;
      let shipmentResult = null;
      if (status === "all") {
        shipmentResult = await shipmentCollection.find({
          crtStmp: {
            $lte: endDate,
            $gte: startDate,
          }
        }).toArray();
      } else {
        shipmentResult = await shipmentCollection.find({
          crtStmp: {
            $lte: endDate,
            $gte: startDate,
          }, "status": status
        }).toArray();
      }
      res.send(shipmentResult);
      res.end();
    } catch (error) {
      console.log("get shipment: " + error);
      error.message = 'Fail to access database! Try again'
      next(error);
    }

  },
  async getByShipmentId(req, res, next) {
    const shipCollection = req.db.collection("shipment");
    const locInvCollection = req.db.collection("locationInv");
    const sellerInvCollection = req.db.collection("sellerInv");
    try {
      let shipment = await shipCollection.findOne({ _id: req.params.Id });
      if (shipment.rcIts) {
        let rcIts = shipment.rcIts;
        for (let anItem of rcIts) {
          let locInv = await locInvCollection.find({"_id.UPC": anItem.UPC}, {"_id.loc": 1, qty: 1}).toArray();
          anItem.locInv = locInv;
          let sellerInvQty = await sellerInvCollection.findOne({ "_id.UPC": anItem.UPC, "_id.org": shipment.orgNm }, { qty: 1});
          if (!sellerInvQty) {
            anItem.warning = true;
            anItem.sellerInv = 0;
          } else if (sellerInvQty.qty < anItem.qty){
            anItem.warning = true;
            anItem.sellerInv = sellerInvQty.qty;
          } else {
            anItem.warning = false;
            anItem.sellerInv = sellerInvQty.qty;
          }
        }
      }
      res.send(shipment);
      res.end();
    } catch (error) {
      console.log("get shipment: " + error);
      error.message = 'Fail to access database! Try again'
      next(error);
    }
  }
}