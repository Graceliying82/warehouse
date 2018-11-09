const Login = require('./routes/login')
const Org = require('./routes/')
const passport = require('passport')
const passportSetup = require('./config/passport-setup')

module.exports = (app) => {
  app.get('/org', (req, res) => {
    db = app.db;
    db.collection("org").find({}).toArray((err, docs) => {
      if (err) {
        console.log(err)
        res.error(err)
      } else {
        res.json(docs)
      }
    })
  }) 
}