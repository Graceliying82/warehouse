const jwt = require('jsonwebtoken')

function jwtSignUser (payload) {
  return jwt.sign(payload,'warehousemanagement'
  // { expiresIn: 7d } 
  )
}

/* GET home page. */
module.exports = {
  async post (req, res, next) {
      const dbcollection = req.db.collection("user");
      try {
        var result = await dbcollection.findOne ({'email': req.body.email})
        if (result == null) {
          const error = new Error('Failed to authenticate');
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
            const error = new Error('Failed to authenticate');
            error.status = 401;
            return next(error);
          }
        };
        res.end();
      } catch (error) {
        console.log("login/get error: " + error)
        if (error.message === null) {
          error.message = 'Fail to access database! Try again'
        };
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
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error)
    }
  }
}