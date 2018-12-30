/** 
 * product inventory query - for specific UPC
 * 
 * update - optional - total number - return a warning - inventory not balanced...  
 * return result - total seller inventory (and segment), total loc inventory (and segment)
 * seller inventory: move x from seller a to seller b, ajustment inventory (delta or absolute) x for seller A (list of org, batch)
 * e.g. move 2 from seller a to seller b, change inventory for seller a +2 or -1 (delta), absolute - from 10 to 20
 * locatin inventory: batch 
 * wms: +2 or -2   //delta,    wms  10->20 //absolute 
 * 
 * Query result - total seller inventory (and segment), total loc inventory (and segment)
 */

//get inventory info for list of UPC - UPC are separated by ,
module.exports = {
  async getByUPC(req, res, next) {
    //comment out temporarily
    // if (req.decoded.orgNm !== "WMS") {
    //   const error = new Error('A seller can not call this api!');
    //   error.status = 400;
    //   return next(error);
    // }
    let UPCs = req.params.UPC.split(",");
    const prodCollection = req.db.collection("product");
    const invCollection = req.db.collection("inventory");
    const sellerInvCollection = req.db.collection("sellerInv");
    const locInvCollection = req.db.collection("locationInv");
    //if admin of wms org, return all seller inventory + location inv
    //if seller org, return seller inventory only
    //TODO add condition for admin or seller, now it's default... admin
    let result = [];
    try {
      let productList = await prodCollection.find({ _id: { $in: UPCs } }, { _id: 1, prdNm: 1 }).toArray();
      let invList = await invCollection.find({ _id: { $in: UPCs } }, { _id: 1, qty: 1 }).toArray();
      let sellerInvList = await sellerInvCollection.find({ "_id.UPC": { $in: UPCs } }, { _id: 1, qty: 1 }).toArray();
      let locInvList = await locInvCollection.find({ "_id.UPC": { $in: UPCs } }, { _id: 1, qty: 1 }).toArray();

      for (var aUPC of UPCs) {
        const aProInv = {};
        aProInv.UPC = aUPC;
        for (var aProd of productList) {
          if (aProd._id === aUPC) {
            aProInv.prdNm = aProd.prdNm;
            break;
          }
        }
        for (var aInv of invList) {
          if (aInv._id === aUPC) {
            aProInv.qty = aInv.qty;
          }
        }
        aProInv.sellerInventory = [];
        for (var aSellInv of sellerInvList) {
          if (aSellInv._id.UPC === aUPC) {
            aProInv.sellerInventory.push({ org: aSellInv._id.org, qty: aSellInv.qty });
          }
        }
        aProInv.locationInventory = [];
        for (var aLocInv of locInvList) {
          if (aLocInv._id.UPC === aUPC) {
            aProInv.locationInventory.push({ loc: aLocInv._id.loc, qty: aLocInv.qty });
          }
        }
        result.push(aProInv);
      }
      res.send(result);
      res.end();
    } catch (error) {
      console.log("query product inventory: " + error);
      error.message = 'Fail to access database! Try again'
      next(error);
    }
  },

  async getSellerInvByUPC(req, res, next) {
    let UPCs = req.params.UPC.split(",");
    const prodCollection = req.db.collection("product");
    const sellerInvCollection = req.db.collection("sellerInv");
    //if admin of wms org, return all seller inventory + location inv
    //if seller org, return seller inventory only
    //TODO add condition for admin or seller, now it's default... admin
    let result = [];
    try {
      let productList = await prodCollection.find({ _id: { $in: UPCs } }, { _id: 1, prdNm: 1 }).toArray();
      let sellerInvList = await sellerInvCollection.find({ "_id.UPC": { $in: UPCs }, "_id.org": req.decoded.orgNm }, { _id: 1, qty: 1 }).toArray();

      for (var aUPC of UPCs) {
        const aProInv = {};
        aProInv.UPC = aUPC;
        for (var aProd of productList) {
          if (aProd._id === aUPC) {
            aProInv.prdNm = aProd.prdNm;
            break;
          }
        }
        for (var aInv of invList) {
          if (aInv._id === aUPC) {
            aProInv.qty = aInv.qty;
          }
        }
        aProInv.sellerInventory = [];
        for (var aSellInv of sellerInvList) {
          if (aSellInv._id.UPC === aUPC) {
            aProInv.sellerInventory.push({ org: aSellInv._id.org, qty: aSellInv.qty });
          }
        }
        aProInv.locationInventory = [];
        for (var aLocInv of locInvList) {
          if (aLocInv._id.UPC === aUPC) {
            aProInv.locationInventory.push({ loc: aLocInv._id.loc, qty: aLocInv.qty });
          }
        }
        result.push(aProInv);
      }
      res.send(result);
      res.end();
    } catch (error) {
      console.log("query product inventory: " + error);
      error.message = 'Fail to access database! Try again'
      next(error);
    }
  },

  /**
   * if qty is passed, qtyDelta will be ignored
{adjust:[
{
  UPC:"123456",
  qty:123,
  qtyDelta:-4,
  sellerInventory:[
    {
      org:"A",
      qtyDelta:2
    },
    {
      org:"B",
      qty:3,
    }
    ],
  locationInventory:[
    {
      loc:"WMS",
      qty:120,
    },
    {
      loc:"ABC",
      qtyDelta:-3
    }
    ]
  
}
],
note:"this is a inventory change"  
}

   */
  async postInvUpdate(req, res, next) {
    const invCollection = req.db.collection("inventory");
    const sellerInvCollection = req.db.collection("sellerInv");
    const locInvCollection = req.db.collection("locationInv");
    try {
      let inventoryAdjustArray = req.body.adjust;
      let succesUPC = [];
      let failUPC = [];
      let createTime = new Date();
      req.body.crtTm = new Date(createTime.toLocaleString() + ' UTC').toISOString().split('.')[0] + ' EST';
      req.body.crtStmp = createTime.getTime();
      for (var adjust of inventoryAdjustArray) {
        let aUPC = adjust.UPC;
        try {
          if (adjust.qty) {
            await invCollection.findOneAndUpdate(
              {
                _id: aUPC
              }, //query
              {
                $set: { qty: adjust.qty, mdfTm: req.body.crtTm, mdfStmp: req.body.crtStmp },
              },
              { upsert: true }
            );
          } else if (adjust.qtyDelta) {
            await invCollection.findOneAndUpdate(
              {
                _id: aUPC
              }, //query
              {
                $set: { mdfTm: req.body.crtTm, mdfStmp: req.body.crtStmp },
                $inc: { qty: adjust.qtyDelta }
              },
              { upsert: true }
            );
          }

          for (var sellerInv of adjust.sellerInventory) {
            if (sellerInv.qty) {
              await sellerInvCollection.findOneAndUpdate(
                {
                  _id: { UPC: aUPC, org: sellerInv.org }
                }, //query
                {
                  $set: { qty: sellerInv.qty, mdfTm: req.body.crtTm, mdfStmp: req.body.crtStmp }
                },
                { upsert: true }
              );
            } else if (sellerInv.qtyDelta) {
              await sellerInvCollection.findOneAndUpdate(
                {
                  _id: { UPC: aUPC, org: sellerInv.org }
                }, //query
                {
                  $inc: { qty: sellerInv.qtyDelta },
                  $set: { mdfTm: req.body.crtTm, mdfStmp: req.body.crtStmp }
                },
                { upsert: true }
              );
            }
          }

          for (var locInv of adjust.locationInventory) {
            if (locInv.qty) {
              await locInvCollection.findOneAndUpdate(
                {
                  _id: { UPC: aUPC, loc: locInv.loc }
                }, //query
                {
                  $set: { qty: locInv.qty, mdfTm: req.body.crtTm, mdfStmp: req.body.crtStmp }
                },
                { upsert: true }
              );
            } else if (locInv.qtyDelta) {
              await locInvCollection.findOneAndUpdate(
                {
                  _id: { UPC: aUPC, loc: locInv.loc }
                }, //query
                {
                  $inc: { qty: locInv.qtyDelta },
                  $set: { mdfTm: req.body.crtTm, mdfStmp: req.body.crtStmp }
                },
                { upsert: true }
              );
            }
          }
          succesUPC.push(aUPC);
        } catch (error) {
          failUPC.push(aUPC);
        }
        result = {};
        result.success = succesUPC;
        result.failure = failUPC;
        res.send(result);
        res.end();
      }
    } catch (error) {
      console.log("adjust product inventory: " + error);
      error.message = 'Fail to access database! Try again'
      next(error);
    }

  },
  /**
{
  move: [
    {  UPC:"123456", qty:123,},
    {  UPC:"1234567", qty:123,}
  ],
  locFrom:"WMS",
  locTo:"LOC1",
  note:"this is a inventory move"  
}
   */
  async moveInvBatch(req, res, next) {
    try {
      const invMoveCollection = req.db.collection("invMove");
      const locInvCollection = req.db.collection("locationInv");
      req.body.email = req.decoded.email;
      let createTime = new Date();
      req.body.crtTm = new Date(createTime.toLocaleString() + ' UTC').toISOString().split('.')[0] + ' EST';
      req.body.crtStmp = createTime.getTime();

      for (let aMove of req.body.move) {
        let fromInventoryLocation = await locInvCollection.findOne({ _id: { UPC: aMove.UPC, loc: req.body.locFrom } }, { qty: 1 });
        let fromQty = fromInventoryLocation.qty;
        if (!fromQty) {
          const error = new Error('no record found for UPC and loc');
          error.status = 400;
          return next(error);
        } else if (fromQty < aMove.qty) {
          const error = new Error('not enough inv in loc, you may need manual adjust inv');
          error.status = 400;
          return next(error);
        }
      }

      for (let bMove of req.body.move) {
        //decrease inv
        await locInvCollection.findOneAndUpdate(
          {
            _id: { UPC: bMove.UPC, loc: req.body.locFrom }
          }, //query
          {
            $inc: { qty: - bMove.qty },
            $set: { mdfTm: req.body.crtTm, mdfStmp: req.body.crtStmp }
          },
        );

        await locInvCollection.findOneAndUpdate(
          {
            _id: { UPC: bMove.UPC, loc: req.body.locTo }
          }, //query
          {
            $inc: { qty: bMove.qty },
            $set: { mdfTm: req.body.crtTm, mdfStmp: req.body.crtStmp }
          },
          { upsert: true }
        );
      }
      await invMoveCollection.insertOne(req.body);
      res.end();
    } catch (error) {
      console.log("move location inventory: " + error);
      error.message = 'Fail to access database! Try again'
      next(error);
    }
  },
};
