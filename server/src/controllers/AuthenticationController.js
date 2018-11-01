// const user = require('../models/User')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

function jwtSignUser (user) {
  const ONE_WEEK = 60 * 6 * 24 * 7
  return jwt.sign(user, config.authentication.jwtSecret, {
    expiresIn: ONE_WEEK
  })
}

module.exports = {
  login (req, res) {
  // This is a dummy login function. Will be replaced by real function
    console.log(req.body)
    const user = req.body
    if (user.email === 'wrong@gmail.com') {
      return res.status(403).send({
        error: 'Login error!'
      })
    } else if (user.email === 'wms@gmail.com') {
      res.send({
        email: 'wms@gmail.com',
        token: jwtSignUser(user),
        userName: 'Jialin Li',
        isSupervisor: false,
        isWmsUser: true
      })
    } else {
      res.send({
        email: 'abc@gmail.com',
        token: jwtSignUser(user),
        userName: 'Grace Li',
        isSupervisor: true,
        isWmsUser: false
      })
    }
  }
}
