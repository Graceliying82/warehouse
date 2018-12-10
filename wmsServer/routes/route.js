const passport = require('passport')
const passportSetup = require('../config/passport-setup')
const Login = require('./login')
const Org = require('./org')
const User = require('./user')
const Product = require('./product')
const Inventory = require('./inventory')

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

  app.post('/receiveUpdate', Product.updateProduct)
  app.post('/receiveDelete', Product.deleteProduct)

  // from inventory
  app.post('/inventory', Inventory.post)
  app.get('/inventory', Inventory.get)

  //auth with google
  // app.get('/auth/google', (req, res, next) => {
  //   passport.authenticate('google', {scope: ['profile']})
  //   console.log(res);
  //   res.set('obj',res.get("Location"));
  //   if (res.status === 302) {
  //     res.status(200);
  //   }
  //   res.end();
  // })

  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
    })
  )

  //callback route for google to redirect to
  app.get('/auth/google/redirect', passport.authenticate('google', { session: false}), (req, res) => {
    console.log(req.user);
    //todo, response put jwt token
    //todo viewa load method to handle jwt
    res.set("data", req.user);
    res.redirect("http://localhost:8080/#/login?token=" +  req.user);
    res.end()
  })
}