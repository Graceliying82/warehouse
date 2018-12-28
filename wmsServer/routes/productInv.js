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
    async getByUPC(req, res, next){
      let UPCs = req.params.UPC.split(",");
      const prodCollection = req.db.collection("product");
      const invCollection = req.db.collection("inventory");
      const sellerInvCollection = req.db.collection("sellerInv");
      const locInvCollection = req.db.collection("locationInv");
      //if admin of wms org, return all seller inventory + location inv
      //if seller org, return seller inventory only
      //TODO add condition for admin or seller, now it's default... admin
      let result = [];
      try{
        let productList = await prodCollection.find({ _id : { $in : UPCs}},{_id:1,prdNm:1}).toArray();
        let invList = await invCollection.find({ _id : { $in : UPCs}},{_id:1,qty:1}).toArray();
        let sellerInvList = await sellerInvCollection.find({ "_id.UPC" : { $in : UPCs}},{_id:1,qty:1}).toArray();
        let locInvList = await locInvCollection.find({ "_id.UPC" : { $in : UPCs}},{_id:1,qty:1}).toArray();

        for (var aUPC of UPCs){
          const aProInv = {};
          aProInv.UPC = aUPC;
          for (var aProd of productList){
            if (aProd._id === aUPC){
              aProInv.prdNm = aProd.UPC;
              break;
            }
          }
          for (var aInv of invList){
            if (aInv._id === aUPC) {
              aProInv.qty = aInv.qty;
            }
          }
          aProInv.sellerInventory = [];
          for (var aSellInv of sellerInvList){
            if (aSellInv._id.UPC === aUPC) {
              aProInv.sellerInventory.push({org:aSellInv._id.org, qty:aSellInv.qty});
            }
          }
          aProInv.locationInventory = [];
          for (var aLocInv of locInvList){
            if (aLocInv._id.UPC === aUPC){
              aProInv.locationInventory.push({loc:aLocInv._id.loc, qty:aLocInv.qty});
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
    async postInvUpdateAbsolute(req, res, next){

    },
  };
  