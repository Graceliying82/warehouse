const nextKey = require('./nextKey');
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
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error);
    }
  },
  //startDate, endDate, status are mandatory, 
  //valid status = all, ready, upgrade, ship
  async get(req, res, next) {
    const shipmentCollection = req.db.collection("shipment");
    try {
      let startDate = '';
      let endDate = '';
      let status = req.query.status;
      let shipmentResult = null;
      if (status === undefined) {
        const error = new Error('Status is needed.');
        error.status = 400;
        return next(error);
      } else if (status === "all") {
        // For status === all, startDate and endDate must specified.
        if ((req.query.startDate === undefined) || (req.query.endDate === undefined)) {
          const error = new Error('startDate, endDate is needed');
          error.status = 400;
          return next(error);
        }
        startDate = new Date(req.query.startDate).getTime();
        endDate = new Date(req.query.endDate).getTime();
        shipmentResult = await shipmentCollection.find({
          crtStmp: {
            $lte: endDate,
            $gte: startDate,
          }
        }).toArray();
      } else {
        // When status !== all, return all data in that status
        shipmentResult = await shipmentCollection.find({
          "status": status
        }).toArray();
      }
      res.send(shipmentResult);
      res.end();
    } catch (error) {
      console.log("get shipment: " + error);
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error);
    }
  },
  async calcShipStatus (db, shipId) {
    const shipCollection = db.collection("shipment");
    const sellerInvCollection = db.collection("sellerInv")
    try {
      let shipment = await shipCollection.findOne({ _id: shipId });
      if (
        (shipment) &&
        (shipment.status !== 'shipped') &&
        (shipment.status !== 'cancel')
      ) {
        let enough = true
        let upgradeCount = 0 // user to calculate how many rcIts is in upgrade status.
        // this enough will be set false if any of rcIts has no enough items
        for (let i = 0; i < shipment.rcIts.length; i++) {
          let sellerInv = await sellerInvCollection.findOne(
            {
              _id: { UPC: shipment.rcIts[i].UPC, org: shipment.orgNm }
            }
          );
          if ((!sellerInv) || (sellerInv.qty < shipment.rcIts[i].qty)) {
            // Not enough item
            if (shipment.rcIts[i].status === 'upgrade') {
              upgradeCount += 1
            } else {
              shipment.rcIts[i].status = 'backOrder'
            }
            enough = false
          } else {
            // Enough item. Means done upgrade of this item
            shipment.rcIts[i].status = 'ready'
          }
        }
        if (shipment.status === 'upgrade') {
          if (upgradeCount === 0) {
            // No more upgrading items. change status to other
            if (enough) {
              shipment.status = 'ready'
            } else {
              shipment.status = 'backOrder'
            }
          }
        } else if (enough) {
          shipment.status = 'ready'
        } else if (!enough) {
          shipment.status = 'backOrder'
        }
        await shipCollection.replaceOne({ _id: shipment._id }, shipment );
      }
    } catch (error) {
      console.log("get shipment: " + error);
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error);
    }
  },
  async getByShipmentId(req, res, next) {
    const shipCollection = req.db.collection("shipment");
    const prdCollection = req.db.collection("product");
    try {
      let createTime = new Date()
      req.body.crtTm = new Date(createTime.toLocaleString() + ' UTC').toISOString().split('.')[0] + ' EST'
      req.body.crtStmp = createTime.getTime() // add a create timestamp
      req.body.mdfTm = req.body.crtTm; //add data modify Time
      req.body.mdfStmp = req.body.crtStmp; // add a modify timestamp
      await module.exports.calcShipStatus(req.db, req.params.Id);
      let shipment = await shipCollection.findOne({ _id: req.params.Id });
      if (shipment === null) {
        console.log('Tracking No ' + req.params.Id + ' is not found')
        shipment = []
      } else {
        if (shipment.rcIts) {
          for (i =0; i < shipment.rcIts.length; i++) {
            let prod = await prdCollection.findOne({_id: shipment.rcIts[i].UPC});
            if (prod){
              shipment.rcIts[i].prdNm = prod.prdNm;
              shipment.rcIts[i].pid = prod.pid;
            } else {
              // create a product
              let apid = await nextKey.key("product",req.db);
              await prdCollection.insertOne(
                {
                  _id: shipment.rcIts[i].UPC,
                  prdNm: "",
                  pid: apid,
                  crtTm: req.body.crtTm,
                  crtStmp: req.body.crtStmp,
                  mdfTm: req.body.mdfTm,
                  mdfStmp: req.body.mdfStmp
                }
              )
              shipment.rcIts[i].prdNm = "";
              shipment.rcIts[i].pid = apid;
            };
          }
        }
      }
      res.send(shipment);
      res.end();
    } catch (error) {
      console.log("get shipment: " + error);
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error);
    }
  },
  /*
  {
    "_id" : "1Z81R75W0292816010",  //tracking number
    "orgNm" : "Apple",
    "rcIts" : [ 
        {
            "UPC" : "884116277361",
            "loc" : "L1ABC"
            "qty" : 10
        },
         {
            "UPC" : "884116277361",
            "loc" : "L1ABC"
            "qty" : 33
        },  
        {
            "UPC" : "192330666473",
             "loc" : "L2ABC"
            "qty" : 9
        }
    ]
  }
  validate seller inventory for all UPC
  will not validate location inventory
  will not validate shipment sku, quantity is right.. it will be done by the UI
  update shipment status to shipped
  update modified time, add - shippedby
  decrease inventory for inventory, sellerInventory, location inventory, if localtion inventory become minus, they need do move... 
  */  
  async ship(req, res, next) {
    const shipCollection = req.db.collection("shipment");
    const invCollection = req.db.collection("inventory");
    const locInvCollection = req.db.collection("locationInv");
    const sellerInvCollection = req.db.collection("sellerInv");
    let shipTime = new Date()
    let shipTm = new Date(shipTime.toLocaleString() + ' UTC').toISOString().split('.')[0] + ' EST'
    let shipStmp = shipTime.getTime() // add a create timestamp
    try {
      let shipment = req.body;
      let shipmentID = shipment._id;
      let userID = req.decoded.email;
      let orgNm = shipment.orgNm;
      //validate seller inventory
      let shipFromDB = await shipCollection.findOne({_id:shipmentID});
      if (!shipFromDB) {
        const error = new Error('shipment not found');
        error.status = 400;
        return next(error);
      } else if (shipFromDB.status === "shipped"){
        const error = new Error("shipped already, can not ship again");
        error.status = 400;
        return next(error);
      }
      
      for (let anItem of shipFromDB.rcIts){
        let sellerInv = await sellerInvCollection.findOne({ "_id.UPC": anItem.UPC, "_id.org": orgNm }, { qty: 1});
        if ((!sellerInv) || (sellerInv.qty < anItem.qty )){
          const error = new Error('Not enough inventory');
          error.status = 400;
          return next(error);
        } 
      }
      //update inventory records
      for (let anItem of shipment.rcIts){
        let aUPC = anItem.UPC;
        let aloc = anItem.loc;
        let aQty = anItem.qty;
        await invCollection.findOneAndUpdate(
          {
            _id: aUPC
          }, //query
          {
            $set: { mdfTm: shipTm, mdfStmp: shipStmp },
            $inc: { qty: -aQty }
          },
          { upsert: true }   //up sert for easy test
        );
        await locInvCollection.findOneAndUpdate(
          {
            _id: {UPC: aUPC, loc: aloc}
          }, //query
          {
            $inc: { qty: -aQty},
            $set: { mdfTm: shipTm, mdfStmp: shipStmp }
          },
          { upsert: true }   //up sert for easy test
        );
        await sellerInvCollection.findOneAndUpdate(
          {
            _id: { UPC: aUPC, org: orgNm }
          }, //query
          {
            $inc: { qty: -aQty},
            $set: { mdfTm: shipTm, mdfStmp: shipStmp }
          }
        );
      }
      //update shipment
      if (shipFromDB){
        shipFromDB.status = "shipped";
        shipFromDB.shipBy = userID;
        shipFromDB.mdfTm = shipTm;
        shipFromDB.mdfStmp = shipStmp;
        result = await shipCollection.replaceOne({_id:shipmentID}, shipFromDB);
      } else {
        const error = new Error('shipment not found, this should never happen');
        error.status = 400;
        return next(error);
      }
      res.send("Ship success");
      res.end();
    } catch (error) {
      console.log("ship confirmation: " + error);
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error);
    }
  },
  // Delete a shipment record by trackingNo
  async deleteByTracking (req, res, next) {
    try {
      const shipCollection = req.db.collection("shipment");
      await shipCollection.deleteOne({"_id": req.body.id});
      res.send("Delete Order success");
      res.end();
    } catch (error) {
      console.log("delete shipment: " + error);
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error);
    }
  }
}