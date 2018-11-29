const jwt = require('jsonwebtoken')
const passport = require('passport')
const passportSetup = require('../config/passport-setup')

function jwtSignUser (user) {
  return jwt.sign(user,'warehousemanagement', {
    expiresIn: '7d'
  })
}

/* GET home page. */
module.exports = {
  async post (req, res, next) {
      const dbcollection = req.db.collection("user");
      try {
        var result = await dbcollection.findOne ({'email': req.body.email})
        if (result == null) {
          const error = new Error('failed to authenticate');
          error.status = 401;
          return next(error);
        } else {
          if (result.pswd === req.body.pswd) {
            token = jwtSignUser(result);
            res.send({
              'email': result.email,
              'userName': result.usrNm,
              'isSupervisor': result.isSup,
              'isWmsUser': result.isWms,
              'isBuyer': result.isB,
              'isSeller': result.isS,
              'orgName': result.orgNm,
              'token': token
            })
          } else {
            const error = new Error('failed to authenticate');
            error.status = 401;
            return next(error);
          }
        };
        res.end();
      } catch (error) {
        console.log("login/get error: " + error)
        next(error)
      }
  },

  // Check the email address and see whether it is existed
  async checkEmail (req, res, next) {
    const dbcollection = req.db.collection("user");
    try {
      var result = await dbcollection.findOne ({'email': req.body.email})
      if (result == null) {
        res.send({
          'emailExisted': false
        })
      } else {
        res.send({
          'emailExisted': true
        })

      };
      res.end()
    } catch (error) {
      console.log("login/get error: " + error)
      next(error)
    }
  }
}