var createError = require('http-errors');
var express = require('express');
var path = require('path');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
const cors = require('cors')
const jwt = require('jsonwebtoken')

// Connection URL
const dburl = 'mongodb://192.168.1.100:27017';
// Database Name
const dbName = 'wms';


var logger = require('morgan');

var loginRouter = require('./routes/login');
var orgRouter = require('./routes/org');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//set db info TODO not sure why it does not work

app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(cors())

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  req.dburl = dburl;
  req.dbName =dbName;
  next();
});

app.use(function(req, res, next){
  let baseUrl = req.baseUrl;
  if (baseUrl === '/login'){
    next();
  } else {
    //todo validate jwt token
    next();
    try {
      token = req.cookies.aToken;
      console.log('jwt token is ' + token);
      //TODO temporary private key
      var decoded = jwt.verify(token, 'warehousemanagement');
      console.log('jwt token value is ' + decoded.email);
      //put the informatio in the requests, do we ned clean it after the process? YES?
      req.user = decoded.email;
    } catch(err) {
      // err
    }
  }
})

//app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/org', orgRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
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
