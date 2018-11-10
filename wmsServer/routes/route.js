const passport = require('passport')
const passportSetup = require('../config/passport-setup')
const Login = require('./login')
const Org = require('./org')
const User = require('./user')
const Product = require('./product')

module.exports = (app) => {
  // from Login
  app.post('/login', Login.post) 
  app.post('/login/checkEmail', Login.checkEmail)

  // from org
  app.post('/orgs', Org.post)
  app.get('/orgs', Org.get)
  app.get('/orgs/:name', Org.getByName)

  // from user
  app.post('/users', User.post)
  app.get('/users', User.get)

  // from product
  app.post('/products', Product.post)
  app.get('/products', Product.get)

  //auth with google
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
  }));

  //callback route for google to redirect to
  app.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
    res.send('you reached the callback URI')
  })
}