var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
var fs = require('fs');
var dburl = 'mongodb://localhost/dkhome';

//load model
var models_path = path.join(__dirname, 'app/models');
fs.readdirSync(models_path)
  .forEach(function(file) {
    if(~file.indexOf('.js')) {
      require(path.join(models_path, file));
    }
  });

var routes = require('./routes/index');

var app = express();
// connect to mongodb
mongoose.connect(dburl);
// options
var session_opt = {
  secret: 'dk cat',
/*  resave: false,
  saveUninitialized: false,*/
  store: new mongoStore({
    url: dburl,
    collection: "sessions",
  }),
  //cookie: {secure: true}  
};
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('trust proxy', 1);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(session_opt));

// app.use('/', routes);
// app.use('/admin', admin);

routes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
