var express = require('express');
var router = express.Router();
var app = require('../app').default;

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// Connection URL
//const dburl = app.get('dburl');
// Database Name
//const dbName = app.get('wms');



/* GET home page. */
router.post('/', function (req, res, next) {
  const dburl = req.dburl;
  const dbName = req.dbName;
  MongoClient.connect(dburl, function (err, client) {
    assert.equal(null, err);
    console.log("connected successfully to mongo server");
    const dbcollection = client.db(dbName).collection("user");
    dbcollection.findOne({ 'email': req.body.email }, ((error, result) => {
      if (error)  {
        client.close();
        return next(error);
      }
      if (result == null) {
        const error = new Error('failed to authenticate');
        error.status = 401;
        client.close();
        return next(error);
      } else if (result.password == req.body.password) { //todo check password with hash
        res.send(result);
        client.close();
        res.end();
      } else {
        const error = new Error('failed to authenticate');
        error.status = 401;
        client.close();
        return next(error);
      }
      

    }))

  })
});

module.exports = router;
