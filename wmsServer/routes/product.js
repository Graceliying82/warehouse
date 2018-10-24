//create product
//query product
var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// Connection URL
//const dburl = 'mongodb://localhost:32768';
// Database Name
//const dbName = 'wms';

/* GET products listing. TODO fix it
 */
router.get('/', function(req, res, next) {
  MongoClient.connect(req.dburl, function(err, client){
    assert.equal(null, err);
    console.log("connected successfully to mongo server");
    client.db(req.dbName).collection("products").find().toArray((error, result)=>{
      if (error) {
        client.close();
        return next(error);
      }
      res.send(result)
      client.close();
    });
    
  })
});

/* create WMS product ID */

router.post('/', function(req, res, next) {
  MongoClient.connect(req.dburl, function(err, client){
    var wmsPid = req.body.wmsPid;
    if ((wmsPid == null) || (wmsPid == undefined)) {
        const error = new Error('wmsPid missing');
        error.status = 400;
        client.close();
        return next(error);
    } 
    client.db(req.dbName).collection("products").find({'wmsPid':wmsPid}).toArray((error, result)=>{
        if (err) next(err);
        if (result.length>0) {
          const error = new Error('product existed, please use other wmsPid');
          error.status = 400;
          client.close();
          return next(error);
        }
        req.body.createTime = new Date().toString();
        dbcollection.insert(req.body, (error, result2)=>{
          if (error) return next(error);
          res.send(result2)
          client.close();
          res.end();
        })
      })
    //client.db(dbName).collection("products").insertOne()
  });
})
