const Login = require('./routes/login')
const passport = require('passport')
const passportSetup = require('./config/passport-setup')

module.exports = (app, database) => {
  app.post('/login', Login.post)
  app.post('/login/checkEmail', Login.checkEmail)

  //auth with google
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
  }));

  //callback route for google to redirect to
  app.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
    res.send('you reached the callback URI')
  })
}