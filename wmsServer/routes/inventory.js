//query inventory for upc, for upc + location, for upc + seller org,... 

//receive, pickup, shipment

module.exports = {
  async receive (req, res, next) {
    const dbcollection = req.db.collection("inventoryReceive");
      try {
        req.body.crtTm = new Date().toString(); // add data create Time
        req.body.mdfTm = req.body.crtTm;  //add data modify Time
        result = await dbcollection.insertOne(req.body)
        res.send(result)
        res.end();
      } catch (error) {
        console.log("receive error: " + error)
        next(error)
      }
  }
}