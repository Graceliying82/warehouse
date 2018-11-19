var createError = require('http-errors');
var express = require('express');
var path = require('path');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
const cors = require('cors')
const initDatabase = require('./models/db')

var logger = require('morgan');
var app = express();

initDatabase().then(db => {
  app.db = db;
})

app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(cors())
app.use(function (req, res, next) {
  let allowedOrigins = ['*'];  // list of url-s
  let origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
      res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Expose-Headers', 'Content-Disposition');
  next();
});

app.use(express.static(path.join(__dirname, '../client/dist')));

app.use(function(req, res, next) {
    // initDatabase().then(db => {
      req.db = app.db;
      next()
    // })
})

require('./routes/route')(app)

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log('error msg ' + err.message);
  res.status(err.status || 500).send({error:err.message});
  res.end();
});

module.exports = app;
9102805213683062522920
