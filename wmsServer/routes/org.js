var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');



router.post('/', function(req, res, next) {

  MongoClient.connect(req.dburl, function(err, client){
    assert.equal(null, err);
    console.log("connected successfully to mongo server");
    const dbcollection = client.db(req.dbName).collection("org");
    dbcollection.find({'orgName':req.body.orgName}).toArray((error, result)=>{
      if (err) next(err);
      if (result.length>0) {
        const error = new Error('Org existed, please use other orgName');
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
  })
});

router.get('/', function(req, res, next) {
  MongoClient.connect(req.dburl, function(err, client){
    assert.equal(null, err);
    console.log("connected successfully to mongo server");
    client.db(req.dbName).collection("org").find().toArray((error, result)=>{
      if (error) return next(error);
      res.send(result)
    })
    client.close();
  })
});

router.get('/:name', function(req, res, next){
  MongoClient.connect(req.dburl, function(err, client){
    assert.equal(null, err);
    console.log("connected successfully to mongo server");
    console.log(req.params.name);
    client.db(req.dbName).collection("org").find({'orgName':req.params.name}).toArray((error, result)=>{
      console.log('result ' + result);
      if (error) return next(error);
      res.send(result)
    })
    client.close();
  })
});



module.exports = router;
