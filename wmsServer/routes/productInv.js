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
  
  module.exports = {
    async post(req, res, next) {
      const dbcollection = req.db.collection("inventoryReceive");
      const invCollection = req.db.collection("inventory");
      const sellerInvCollection = req.db.collection("sellerInv");
      const locInvCollection = req.db.collection("locationInv");
      const prodCollection = req.db.collection("product");
      try {
       
        
        res.send(result);
        res.end();
      } catch (error) {
        console.log("receive error: " + error);
        error.message = 'Fail to access database! Try again'
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
            error.message = 'Fail to access database! Try again'
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
            error.message = 'Fail to access database! Try again'
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
          error.message = 'Fail to access database! Try again'
          next(error)
        }
     }
    }
  };
  