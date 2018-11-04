var createError = require('http-errors');
var express = require('express');
var path = require('path');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
const cors = require('cors')


// Connection URL
const dburl = 'mongodb://127.0.0.1:27017';
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
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
