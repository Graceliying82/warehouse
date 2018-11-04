var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// Connection URL
//const dburl = 'mongodb://localhost:32768';
// Database Name
//const dbName = 'wms';

/* GET users listing. */
router.get('/', function(req, res, next) {
  MongoClient.connect(req.dburl, function(err, client){
    assert.equal(null, err);
    console.log("connected successfully to mongo server");
    client.db(req.dbName).collection("user").find().toArray((error, result)=>{
      if (error) return next(error);
      res.send(result)
    })
    client.close();
  })
});



/* Post to create user */
router.post('/',function(req, res, next){
  MongoClient.connect(req.dburl, function(err, client){
    assert.equal(null, err);
    console.log("connected successfully to mongo server");
    const dbcollection = client.db(req.dbName).collection("user");
    dbcollection.find({'email':req.body.email}).toArray((error, result)=>{
      if (err) next(err);
      if (result.length>0) {
        const error = new Error('user existed, please use other email');
        error.status = 400;
        error.message = 'user existed, please use other email';
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
  })

});
module.exports = router;
