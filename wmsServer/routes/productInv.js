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
const nextKey = require('./nextKey');
module.exports = {
  async getAllProductInventory(req, res, next) {
    const prodCollection = req.db.collection("product");
    const invCollection = req.db.collection("inventory");
    let prdWithInv = [];
    let prdWOInv = [];
    try {
      const productArray = await prodCollection.find({}, { _id: 1, prdNm: 1 }).toArray();
      const inventoryArray = await invCollection.find({qty: { $ne: 0 }}, { _id: 1, qty: 1 }).toArray();
      for (let prod of productArray) {
        let qty = 0;
        for (let inv of inventoryArray) {
          if (inv._id === prod._id) {
            balance = inv.balance
            qty = inv.qty;
            break;
          }
        }
        if (qty === 0) {
          let prod1 = {UPC: prod._id, prdNm: prod.prdNm, pid: prod.pid, qty: qty}
          prdWOInv.push(prod1)
          continue
        }
        let prod2 = { UPC: prod._id, prdNm: prod.prdNm, pid: prod.pid, qty: qty, balance: balance};
        prdWithInv.push(prod2);
      }
      res.send({
        'prdWOInv': prdWOInv,
        'prdWithInv': prdWithInv
      });
      res.end();
    } catch (error) {
      console.log("query all product inventory: " + error);
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error);
    }

  },
  async getProdInvByLoc(req, res, next) {
    let locIDArray = [];
    const locCollection = req.db.collection("location");
    let locationArray = [];
    try {
      locationArray = await locCollection.find({}, { locID: 1, dspt: 1 }).toArray();
    } catch (error) {
      console.log("query product inventory for location: " + error);
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error);
    }
    if (req.params.loc === "all") {
      for (let aloc of locationArray) {
        locIDArray.push(aloc.locID);
      }
    } else {
      locIDArray = req.params.loc.split(",");
    }

    const prodCollection = req.db.collection("product");

    const locInvCollection = req.db.collection("locationInv");
    try {
      let locInvArray = await locInvCollection.find({ "_id.loc": { $in: locIDArray }, qty: {$ne:0} }, { _id: 1, qty: 1 }).toArray();

      let UPCSet = [];
      for (let anLocInv of locInvArray) {
        UPCSet.push(anLocInv._id.UPC);
      }
      let prodArray = await prodCollection.find({ _id: { $in: UPCSet } }, { _id: 1, prdNm: 1 }).toArray();
      let result = [];
      for (let locInv of locInvArray) {
        let locID = locInv._id.loc;
        let locRecord = null;
        for (let entry of result) {
          if (entry.loc === locID) {
            //found
            locRecord = entry;
            break;
          }
        }
        if (!locRecord) {
          let locName = '';
          for (let aloc of locationArray) {
            if (locID === aloc.locID) {
              locName = aloc.dspt;
              break;
            }
          }
          locRecord = { loc: locID, locName: locName, inventory: [] };
          result.push(locRecord);
        }

        let prodName = '';
        for (let aProduct of prodArray) {
          if (locInv._id.UPC === aProduct._id) {
            prodName = aProduct.prdNm;
            break;
          }
        }
        locRecord.inventory.push({ UPC: locInv._id.UPC, prdNm: prodName, qty: locInv.qty });
      }
      res.send(result);
      res.end();
    } catch (error) {
      console.log("query product inventory for location: " + error);
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error);
    }
  },
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
      let invList = await invCollection.find({ _id: { $in: UPCs }}, { _id: 1, qty: 1 }).toArray();
      let sellerInvList = await sellerInvCollection.find({ "_id.UPC": { $in: UPCs } }, { _id: 1, qty: 1 }).toArray();
      let locInvList = await locInvCollection.find({ "_id.UPC": { $in: UPCs } }, { _id: 1, qty: 1 }).toArray();

      for (var aUPC of UPCs) {
        const aProInv = {};
        aProInv.UPC = aUPC;
        for (var aProd of productList) {
          if (aProd._id === aUPC) {
            aProInv.prdNm = aProd.prdNm;
            aProInv.pid = aProd.pid;
            break;
          }
        }
        for (var aInv of invList) {
          if (aInv._id === aUPC) {
            aProInv.qty = aInv.qty;
            aProInv.balance = aInv.balance
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
          if ((aLocInv._id.UPC === aUPC) && (aLocInv.qty !== 0)) {
            aProInv.locationInventory.push({ loc: aLocInv._id.loc, qty: aLocInv.qty });
          }
        }
        result.push(aProInv);
      }
      res.send(result);
      res.end();
    } catch (error) {
      console.log("query product inventory: " + error);
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error);
    }
  },
  // Input a UPC for upgrading. Will return a list of UPCs with the same original UPC and under the same orgNm
  async getUPCFamilyListByOrg (req, res, next) {
    // input: Base UPC for upgrade and Organization Name
    const prodCollection = req.db.collection("product");
    const sellerInvCollection = req.db.collection("sellerInv");
    let result = [];
    try {
      let targetPrd = await prodCollection.findOne({_id: req.body.UPC});
      if (!targetPrd) {
        const error = new Error('UPC Not Found. Please check');
        error.status = 400;
        return next(error)
      }
      if (!targetPrd.origUPC) {
        const error = new Error('This Product is not upgradable. Please use Upgrade Products Generator to create upgrade products first.');
        error.status = 400;
        return next(error)
      }
      let tempUPCList = await prodCollection.find({origUPC: targetPrd.origUPC}).project({ _id: 1}).toArray();
      let UPCFamilyList = [];
      for (let atemp of tempUPCList) {
        UPCFamilyList.push(atemp._id);
      };
      let sellerInvList = await sellerInvCollection.find({ "_id.UPC": { $in: UPCFamilyList }, "_id.org": req.body.orgNm }).project({ _id: 1, qty: 1 }).toArray();
      let productList = await prodCollection.find({ _id: { $in: UPCFamilyList } }, { _id: 1, prdNm: 1, pid: 1 }).toArray();
      let targetUPCAdded = false
      for (var aUPC of UPCFamilyList) {
        const aProInv = {};
        aProInv.UPC = aUPC;
        for (var aProd of productList) {
          if (aProd._id === aUPC) {
            aProInv.prdNm = aProd.prdNm;
            aProInv.pid = aProd.pid
            break;
          }
        }
        for (var aSellInv of sellerInvList) {
          if ((aSellInv._id.UPC === aUPC)) {
              if (aProInv.UPC === req.body.UPC) {
                targetUPCAdded = true
                aProInv.qty = aSellInv.qty;
                result.push(aProInv);
                break;
              } else if ((aSellInv.qty > 0)) {
                aProInv.qty = aSellInv.qty;
                result.push(aProInv);
                break;
              }
          }
        }
        if ((req.body.includeTarget) && (!targetUPCAdded) && (aProInv.UPC === req.body.UPC)) {
          aProInv.qty = 0;
          result.push(aProInv)
        }
      }
      res.send(result);
      res.end();
    } catch (error) {
      console.log("query product inventory: " + error);
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error);
    }
  },
  async getSellerInvAndOrgList(req, res, next) {
    // This function is used for get current seller Inventory List and Organization List
    // Data can be used for inventory adjust
    let UPC = req.params.UPC;
    const sellerInvCollection = req.db.collection("sellerInv");
    const orgCollection = req.db.collection("org")
    try {
      let sellerInvList = await sellerInvCollection.find({
        "_id.UPC": UPC,
        "qty": { $ne: 0}}).toArray();
      let orgList = await orgCollection.distinct("orgNm");
      let result = {};
      result.sellerInv = [];
      result.orgList = [];
      for (let aItem of sellerInvList) {
        result.sellerInv.push({
          'org': aItem._id.org,
          'qty': aItem.qty})
      };
      for (let aOrg of orgList) {
        result.orgList.push({
          'org': aOrg,
          'qty': 0
        })
      }
      res.send(result);
      res.end();
    } catch (error) {
      console.log("getSellerInvAndOrgList: " + error);
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
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
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error);
    }
  },
  // Get Location Inventory by UPC
  async getLocInvByUPC(req, res, next) {
    // const prodCollection = req.db.collection("product");
    const locInvCollection = req.db.collection("locationInv");
    try {
      let result = await locInvCollection.find({ "_id.UPC":  req.params.UPC }).toArray()
      res.send(result);
      res.end();
    } catch (error) {
      console.log("query product inventory: " + error);
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
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
  async adjustInvUpdate (db, inventoryAdjustArray) {
    const invCollection = db.collection("inventory");
    const sellerInvCollection = db.collection("sellerInv");
    const locInvCollection = db.collection("locationInv");
    try {
      let succesUPC = [];
      let failUPC = [];
      let createTime = new Date();
      let crtTm = new Date(createTime.toLocaleString() + ' UTC').toISOString().split('.')[0] + ' EST';
      let crtStmp = createTime.getTime();
      for (var adjust of inventoryAdjustArray) {
        let aUPC = adjust.UPC;
        try {
          if (adjust.qty) {
            await invCollection.findOneAndUpdate(
              {
                _id: aUPC
              }, //query
              {
                $set: { qty: adjust.qty, mdfTm: crtTm, mdfStmp: crtStmp },
              },
              { upsert: true }
            );
          } else if (adjust.qtyDelta) {
            await invCollection.findOneAndUpdate(
              {
                _id: aUPC
              }, //query
              {
                $set: { mdfTm: crtTm, mdfStmp: crtStmp },
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
                  $set: { qty: sellerInv.qty, mdfTm: crtTm, mdfStmp: crtStmp }
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
                  $set: { mdfTm: crtTm, mdfStmp: crtStmp }
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
                  $set: { qty: locInv.qty, mdfTm: crtTm, mdfStmp: crtStmp }
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
                  $set: { mdfTm: crtTm, mdfStmp: crtStmp }
                },
                { upsert: true }
              );
            }
          }
          succesUPC.push(aUPC);
        } catch (error) {
          failUPC.push(aUPC);
        }
      }
      result = {};
      result.success = succesUPC;
      result.failure = failUPC;
      return result
    } catch (error) {
      console.log("adjustInvUpdate: " + error);
      throw error
    }
  },
  async postInvUpdate(req, res, next) {
    try {
      await module.exports.adjustInvUpdate(req.db, req.body.adjust)
      res.send('Done!');
      res.end();
    } catch (error) {
      console.log("adjust product inventory: " + error);
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
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
        aMove.qty = parseInt(aMove.qty)
        if (isNaN(aMove.qty)) {
          aMove.qty = 0
        }
        if (fromInventoryLocation === null) {
          const error = new Error('Not enough items  in ' + req.body.locFrom + '! Please check your inventory!');
          error.status = 400;
          return next(error);
        } else {
          fromQty = fromInventoryLocation.qty;
          if (!fromQty) {
            const error = new Error('Not enough items  in ' + req.body.locFrom + '! Please check your inventory!');
            error.status = 400;
            return next(error);
          } else if (fromQty < aMove.qty) {
            const error = new Error('Not enough inventory in location. You may need manual adjustment!');
            error.status = 400;
            return next(error);
          } else if (aMove.qty <= 0) {
            const error = new Error('Quantity not valid!');
            error.status = 400;
            return next(error);
          }
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
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error);
    }
  },
  // This is a task will check balance of all products with qty larger than 0
  async checkBalanceOfPrdInv (req, res, next) {
    const invCollection = req.db.collection("inventory");
    const sellerInvCollection = req.db.collection("sellerInv");
    const locInvCollection = req.db.collection("locationInv");
    try 
    {
      let inventoryList = await invCollection.find({qty: { $ne: 0 }}).project({ _id: 1, qty: 1 }).toArray();
      for (let aInv of inventoryList) {
        let total = 0;
        let balanced = true;
        let locInvList = await locInvCollection.find({"_id.UPC" : aInv._id, qty: { $ne: 0 }}).toArray();
        for (let alocInv of locInvList) {
          total += alocInv.qty;
        }
        if (total !== aInv.qty) {
          balanced = false;
        }
        total = 0;
        let sellerList = await sellerInvCollection.find({"_id.UPC" : aInv._id, qty: { $ne: 0 }}).toArray();
        for (let aSeller of sellerList) {
          total += aSeller.qty
        }
        if (total != aInv.qty) {
          balanced = false;
        }
        if (balanced) {
          await invCollection.findOneAndUpdate(
            {
              _id: aInv._id
            }, //query
            {
              $set: { "balance": 'balanced'}
             }
          );
        } else {
          await invCollection.findOneAndUpdate(
            {
              _id: aInv._id
            }, //query
            {
              $set: { "balance": 'unbalanced'}
             }
          );
        }
      }
      res.send('Done!');
      res.end();
    } catch (error) {
      next(error)
    }
  },
}

  
