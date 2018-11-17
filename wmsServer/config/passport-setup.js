const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./key')

passport.use(
  new GoogleStrategy({
    // options for the google strategy
    callbackURL: '/auth/google/redirect',
    clientID : keys.google.clientID,
    clientSecret: keys.google.clientSecret
  }, (accessToken, refreshToken, profile, done) => {
    // passport callback function
    console.log('passport callback function fired')
    console.log('From passport setup: ' + profile.emails[0].value)
    return done(null, profile.emails[0].value);
  })
)