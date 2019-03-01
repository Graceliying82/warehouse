const bcrypt = require('bcrypt')
var ObjectId = require('mongodb').ObjectID
module.exports = {
  //  Get Products
  async get(req, res, next) {
    const prdCollection = req.db.collection("product");
    try {
      let UPC = req.params.id
      let dbRst = null
      let result = []
      if (UPC != undefined) {
        // If UPC is passed in, return one product
        result = await prdCollection.findOne({_id: UPC})
      } else {
        let CategoryChoice = ['Computer', 'Parts', 'Others'];
        // If UPC is not passed in, return the whole list
        if ((req.query.category === undefined) || (req.query.category === 'All')) {
          result = await prdCollection.find().toArray();
        } else {
          // result = await dbcollection.find().toArray();
          result = await prdCollection.find({'cat':req.query.category}).toArray()
        }
      }
      res.send(result);
      res.end();
    } catch (error) {
      console.log("Get User error: " + error);
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error);
    }
  },
  //create product
  // Note: put UPC as _id at client side. this rest api will not handle duplicate situation.
  async post(req, res, next) {
    const dbcollection = req.db.collection("product");
    try {
      let UPC = req.body.UPC;
      // req.body.createTime = new Date().toLocaleString();
      let createTime = new Date();
      req.body.crtTm = new Date(createTime.toLocaleString() + ' UTC').toISOString().split('.')[0] + ' EST';
      req.body.crtStmp = createTime.getTime();
      let result1 = await dbcollection.findOne({_id: UPC})
      if (result1) {
        const error = new Error('Product UPC existed.');
        error.status = 400;
        return next(error)
      }
      await dbcollection.insertOne(req.body);
      res.send('success');
      res.end();
    } catch (error) {
      console.log("Create Product error: " + error);
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error);
    }
  },
  // Update product detail informations
  // product: {
  //   'UPC': '', // Must be Unique
  //   'prdNm': '', // product full name
  //   'length': 0, // By inch
  //   'width': 0, // By inch
  //   'height': 0, // By inch
  //   'weight': 0, // By oz
  //   'volume': 0, // By ml
  //   'color': 'N/A',
  //   'brdNm': 'N/A', // Brand Name
  //   'modNo': 'N/A', // Model No
  //   'modYr': 'N/A', // Model year
  //   'note': '',
  //   'category': 'N/A', //category
  //   'customizable': false //customizable
  //    compSpec: {  // If 'category' === 'computer' otherwise will be 'null'
  //      'ramSz': 'N/A', // Ram Size
  //      'ramType': 'N/A', // Ram Size
  //      'optSys': 'N/A', // operation system
  //      'dvd': 'No',
  //      'sdSize': 'N/A', // sd card size
  //      'hd1Size': 'N/A', // hard drive #1 size
  //      'hd1Type': 'N/A', // hard drive #1 type
  //      'hd2Size': 'N/A', // hard drive #2 size
  //      'hd2Type': 'N/A' // hard drive #2 type
  // }, 
  // },
  async put(req, res, next) {
    const prdCollection = req.db.collection("product");
    try {
      let modifyTime = new Date();
      let mdfTm = new Date(modifyTime.toLocaleString() + ' UTC').toISOString().split('.')[0] + ' EST';
      let mdfStmp = modifyTime.getTime();
      await prdCollection.findOneAndUpdate(
        { // query
          _id: req.body.UPC
        }, 
        { // update
          $set: { 
            mdfTm: mdfTm, 
            mdfStmp: mdfStmp,
            prdNm: req.body.prdNm,
            length: req.body.length,
            width: req.body.width,
            height: req.body.height,
            weight: req.body.weight,
            volume: req.body.volume,
            color: req.body.color,
            brdNm: req.body.brdNm,
            modNo: req.body.modNo,
            modYr: req.body.modYr,
            note: req.body.note,
            cat: req.body.cat,
            origUPC: req.body.origUPC,
            cstmiz: req.body.cstmiz,
            compSpec: req.body.compSpec,
            cfgLists: req.body.cfgLists
          }
        },
        { upsert: true }
      );
      res.send('Success!');
      res.end();
    } catch (error) {
      console.log("Create Product error: " + error);
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
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
      let mdfTm = new Date(modifyTime.toLocaleString() + ' UTC').toISOString().split('.')[0] + ' EST';
      let mdfStmp = modifyTime.getTime();
      let o_id = ObjectId(req.body._id);

      //will compare whether track, price, product name, note changed, if not... do
      //update tracking, update product name, update price  --req.body.UPC is always passed in
      //set price, set product name
      //update inventory receive recersive (for past 1 month)
      //update condition past 1 month,   

      //check quantity change or not, if quantity changed, need update quantity - inventory receive, seller inventory, location env and total inventory
      //check whether org change or not, if org changed, need chang receive inventory, seller inventory,

      let invReceive = await invReceivecollection.findOne({ _id: o_id });

      //receive level
      let origOrgName = invReceive.orgNm;
      let origTrack = invReceive.trNo;
      let origNote = invReceive.note;

      let newOrgName = origOrgName;
      let newTrack = origTrack;
      let newNote = origNote;
      //item level
      let origPrice = 0;
      let origQn = 0;
      let origPrdNm = '';

      //receive level
      let orgChanged = false;
      let trChanged = false;
      let noteChanged = false;
      //item level
      let priceChanged = false;
      let qtyChanged = false;
      let prdNmChanged = false;

      //get item level thing
      let found = false;
      for (let item of invReceive.rcIts) {
        if (item.UPC === req.body.UPC) {
          origPrice = item.price;
          origQn = item.qn;
          origPrdNm = item.prdNm;
          found = true;
          break;
        }
      }
      if (!found) { // should not happen
        const error = new Error('UPC is wrong! should never happen');
        error.status = 400;
        return next(error);
      }
      if ((req.body.orgNm) && (req.body.orgNm !== origOrgName)) {
        orgChanged = true;
        newOrgName = req.body.orgNm;
      }
      if ((req.body.trNo && req.body.trNo !== origTrack)) {
        trChanged = true;
        newTrack = req.body.trNo
      }
      if ((req.body.note) && req.body.note !== origNote) {
        noteChanged = true;
        newNote = req.body.note;
      }

      if ((req.body.price) && req.body.price !== origPrice) {
        priceChanged = true;
      }
      if ((req.body.qn) && req.body.qn !== origQn) {
        qtyChanged = true;
      }
      if ((req.body.prdNm) && req.body.prdNm !== origPrdNm) {
        prdNmChanged = true;
      }

      if (trChanged) {
        let existedTracking = await invReceivecollection.findOne({ trNo: req.body.trNo });
        if (existedTracking !== null) {
          const error = new Error('Tracking No existed! Change another one!');
          error.status = 400;
          return next(error);
        }
      }
      
      // handle quantity change
      if (qtyChanged) {
        let invLocation = await locInvCollection.findOne({ _id: { UPC: req.body.UPC, loc: "WMS" } }, { qty: 1 });
        let qnDelt = req.body.qn - origQn;

        if (qnDelt !== 0) {
          //Delete some items
          //invLocation.qty(wms) < origQuantity - req.body.qn  error: Not enough items.
          if ((invLocation.qty + qnDelt) < 0) {
            const error = new Error('Products has been moved out of WMS! Move back before delete.');
            error.status = 400;
            return next(error);
          } else {
            // Make quantity change on locationInventory, inventoryReceive and inventory
            await locInvCollection.findOneAndUpdate(
              {
                _id: { UPC: req.body.UPC, loc: "WMS" }
              }, //query
              {
                $inc: { qty: qnDelt },
                $set: { mdfTm: mdfTm, mdfStmp: mdfStmp }
              }
            );
            await invCollection.findOneAndUpdate(
              {
                _id: req.body.UPC
              }, //query
              {
                $inc: { qty: qnDelt },
                $set: { mdfTm: mdfTm, mdfStmp: mdfStmp }
              }
            );
            await invReceivecollection.findOneAndUpdate(
              {
                _id: o_id,
                "rcIts.UPC": req.body.UPC
              }, //query
              {
                $inc: { "rcIts.$.qn": qnDelt },
                $set: { mdfTm: mdfTm, mdfStmp: mdfStmp }
              }
            );
            await sellerInvCollection.findOneAndUpdate(
              {
                _id: { UPC: req.body.UPC, org: origOrgName }
              }, //query
              {
                $inc: { qty: qnDelt },
                $set: { mdfTm: mdfTm, mdfStmp: mdfStmp }
              }
            )
          };
        };
      };
      //org change
      if (orgChanged) {
        //receive inventory will be upated together with note, track
        let anInvReceive = await invReceivecollection.findOne({ _id: o_id });
        for (let anItem of anInvReceive.rcIts){
          let itemUPC = anItem.UPC;
          let itemQn = anItem.qn;
          await sellerInvCollection.findOneAndUpdate(
            {
              _id: { UPC: itemUPC, org: origOrgName }
            }, //query
            {
              $inc: { qty: -itemQn },
              $set: { mdfTm: mdfTm, mdfStmp: mdfStmp }
            }
          );
  
          await sellerInvCollection.findOneAndUpdate(
            {
              _id: { UPC: itemUPC, org: req.body.orgNm }
            }, //query
            {
              $inc: { qty: itemQn },
              $set: { mdfTm: mdfTm, mdfStmp: mdfStmp }
            },
            { upsert: true }
          );
        }
      }

      if (prdNmChanged){
        await prdCollection.findOneAndUpdate(
          {
            _id: req.body.UPC
          }, //query
          {
            $set: { "mdfTm": mdfTm, "mdfStmp": mdfStmp, "prdNm": req.body.prdNm }
           }
        );
  
        //update product name
        await invReceivecollection.updateMany(
          {
            "rcIts.UPC": req.body.UPC
          },
          {
            $set: {
              "rcIts.$.prdNm": req.body.prdNm
            }
          }
        );
      }
      
      // update price
      if (priceChanged) {
        await invReceivecollection.updateOne(
          {
            // "trNo": req.body.trNo,
            "_id": o_id,
            "rcIts.UPC": req.body.UPC
          },
          {
            $set: {
              "rcIts.$.price": parseInt(req.body.price),
              mdfTm: mdfTm, 
              mdfStmp: mdfStmp
            }
          }
        )
      }
      
      if (noteChanged || orgChanged || trChanged){
        await invReceivecollection.findOneAndUpdate(
          {
            _id: o_id
          }, //query
          {
            $set: { "mdfTm": mdfTm, "mdfStmp": mdfStmp, "orgNm": newOrgName, "trNo": newTrack, "note": newNote}
          }
        );
      }

      res.end();

    } catch (error) {
      console.log("Update Product error: " + error);
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error);
    }
  },

  // Delete a receiving records information
  async deleteProduct(req, res, next) {
    const invReceivecollection = req.db.collection("inventoryReceive");
    const sellerInvCollection = req.db.collection("sellerInv");
    const locInvCollection = req.db.collection("locationInv");
    const invCollection = req.db.collection("inventory");
    try {
      let modifyTime = new Date();
      let mdfTm = new Date(modifyTime.toLocaleString() + ' UTC').toISOString().split('.')[0] + ' EST';
      let mdfStmp = modifyTime.getTime();
      // must have enough items in wms. Otherwise can't delete! 
      let o_id = ObjectId(req.body._id);
      let invRecive = await invReceivecollection.findOne({ "_id": o_id });
      let locInv = await locInvCollection.findOne({ _id: { UPC: req.body.UPC, loc: "WMS" } })
      let qtyFromInvRec = 0;
      let orgName = "";
      if (invRecive) {
        orgName = invRecive.orgNm;
        for (var item of invRecive.rcIts) {
          if (item.UPC === req.body.UPC) {
            qtyFromInvRec = item.qn;
            break;
          }
        }
      }
      if (qtyFromInvRec > locInv.qty) {
        const error = new Error('Products has been moved out of WMS! Move back before delete.');
        error.status = 400;
        return next(error);
      }

      if (invRecive.rcIts.length === 1) {
        // Last Item in tracking. Delete directly
        let result = await invReceivecollection.deleteOne(
          {
            "_id": o_id
          } //query
        )
      } else {
        await invReceivecollection.findOneAndUpdate(
          {
            "_id": o_id,
          },
          {
            $pull: { rcIts: { UPC: req.body.UPC } }
          }
        )
      }
      //update seller inventory
      await sellerInvCollection.findOneAndUpdate(
        {
          _id: { UPC: req.body.UPC, org: orgName }
        },
        {
          $inc: { qty: - qtyFromInvRec },
          $set: { mdfTm: mdfTm, mdfStmp: mdfStmp }
        }
      );
      await locInvCollection.findOneAndUpdate(
        {
          _id: { UPC: req.body.UPC, loc: "WMS" }
        },
        {
          $inc: { qty: - qtyFromInvRec },
          $set: { mdfTm: mdfTm, mdfStmp: mdfStmp }
        }
      );
      await invCollection.findOneAndUpdate(
        {
          _id: req.body.UPC
        },
        {
          $inc: { qty: - qtyFromInvRec },
          $set: { mdfTm: mdfTm, mdfStmp: mdfStmp }
        }
      );
      //update location inventory
      //       let o_id = ObjectId(req.body._id);
      //       let invReceive = await invReceivecollection.findOne({_id: o_id},{orgNm:1,"rcIts.$.UPC":1,"rcIts.$.qn":1});
      //       let rcIts = invReceive.rcIts;
      //       let orgName = invReceive.orgNm;

      //       for (let i = 0; i < rcIts.length; i++){
      //         await sellerInvCollection.findOneAndUpdate(
      //           {
      //             _id: { UPC: rcIts[i].UPC, org: orgName }
      //           }, //query
      //           {
      //             $dec: { qty: rcIts[i].qn},
      //             $set: { mdfTm: mdfTm, mdfStmp: mdfStmp }
      //           }
      //         );
      //       }
      // //todo how to handle location inventory

      //       let result = await invReceivecollection.deleteOne(
      //         {
      //           "_id": o_id
      //         } //query
      //       );



      //  res.send(result)
      res.end();
    } catch (error) {
      console.log("Create Product error: " + error);
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error);
    }
  },
  async deleteConfig (req, res, next) {
    const dbcollection = req.db.collection("product");
    try {
      let result1 = await dbcollection.findOne({_id: req.body.UPC})
      if (!result1) {
        const error = new Error('Not a valid UPC');
        error.status = 400;
        return next(error)
      }
      await dbcollection.findOneAndUpdate(
        {
          "_id": req.body.UPC,
        },
        {
          $unset: { cfgLists: "" }
        }
      )
      res.send('success');
      res.end();
    } catch (error) {
      console.log("Create Product error: " + error);
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error);
    }
  },
  async getUPCsByOrig (req, res, next) {
    const dbcollection = req.db.collection("product");
    try {
      let result = []
      if (req.body.UPCOnly) {
        // return _id and origUPC only
        result = await dbcollection.find({origUPC: req.body.UPC}).project({ _id: 1, origUPC: 1, compSpec: 1 }).toArray()
      } else {
        // return full list
        result = await dbcollection.find({origUPC: req.body.UPC}).toArray()
      }
      res.send(result);
      res.end();
    } catch (error) {
      console.log("Create Product error: " + error);
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error);
    }
  }
};
