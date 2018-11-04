var express = require('express');
var router = express.Router();
var app = require('../app').default;

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// Connection URL
//const dburl = app.get('dburl');
// Database Name
//const dbName = app.get('wms');

const jwt = require('jsonwebtoken')

function jwtSignUser (user) {
  return jwt.sign(user,'warehousemanagement', {
    expiresIn: '7d'
  })
}


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
        token = jwtSignUser(result);
        //make it session cookie with expires 0, close browser tap it will be cleaned
        res.cookie('aToken',token, {expires:0});
        res.send({
          'email': result.email,
          'userName': result.userName,
          'isSupervisor': result.isSupervisor,
          'isWmsUser': result.isWmsUser,
          'isBuyer': result.isBuyer,
          'isSeller': result.isSeller,
          'orgName': result.orgName,
          'token': token
        });
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

