const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const Config = require('../config/config')
const jwt = require('jsonwebtoken')

function jwtSignUser (user) {
  return jwt.sign(user,'warehousemanagement', {
    expiresIn: '7d'
  })
}

/* GET home page. */
module.exports = {
  async post (req, res, next) {
      let client = await MongoClient.connect(Config.dburl,  { useNewUrlParser: true });
      const dbcollection = client.db(Config.dbname).collection("user");
      try {
        var result = await dbcollection.findOne ({'email': req.body.email})
        if (result == null) {
          const error = new Error('failed to authenticate');
          error.status = 401;
          client.close();
          return next(error);

        } else {
          token = jwtSignUser(result);
          res.send({
            'email': result.email,
            'userName': result.userName,
            'isSupervisor': result.isSupervisor,
            'isWmsUser': result.isWmsUser,
            'isBuyer': result.isBuyer,
            'isSeller': result.isSeller,
            'orgName': result.orgName,
            'token': token
          })
        };
        client.close()
        next()
      } catch (error) {
        console.log("login/get error: " + error)
        client.close()
        next(error)
      }
  },

  // Check the email address and see whether it is existed
  async checkEmail (req, res, next) {
    let client = await MongoClient.connect(Config.dburl,  { useNewUrlParser: true });
    const dbcollection = client.db(Config.dbname).collection("user");
    try {
      var result = await dbcollection.findOne ({'email': req.body.email})
      if (result == null) {
        res.send({
          'emailExisted': false
        })
        client.close();
        return next();
      } else {
        res.send({
          'emailExisted': true
        })
        client.close();
        return next();
      };
      client.close()
      next()
    } catch (error) {
      console.log("login/get error: " + error)
      client.close()
      next(error)
    }
  }
}