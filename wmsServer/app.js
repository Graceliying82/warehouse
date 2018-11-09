var createError = require('http-errors');
var express = require('express');
var path = require('path');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
const cors = require('cors')
const jwt = require('jsonwebtoken')
const initDatabase = require('./models/db')

var logger = require('morgan');
var app = express();


app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(cors())

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    let connection =  initDatabase();
    connection.then(db=>{
      app.db = db;
      next();
    })
})

require('./routes')(app)

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log('error msg ' + err.message);
  // render the error page
  //res.status(err.status || 500).send(err.messages);
  res.status(err.status || 500).send({error:err.message});
  res.end();
  //res.render('error');
});

module.exports = app;
