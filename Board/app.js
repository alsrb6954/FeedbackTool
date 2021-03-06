var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var methodOverride = require('method-override');
var passport = require('passport');

var configAuth = require('./config/auth');
var index = require('./routes/index');
var users = require('./routes/users');
var notice = require('./routes/notice');
var training = require('./routes/training');
var feedbacks = require('./routes/feedbacks');
var question = require('./routes/question');
var routeAuth = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// mongodb connect
mongoose.connect('mongodb://localhost:27017/board');
mongoose.connection.on('error', console.log);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/user', express.static('tmp')); // 내가 저장한 파일을 보기위해서 설정
app.use(flash());
app.use(methodOverride('_method', {methods: ['POST', 'GET']}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(path.join(__dirname, '/bower_components')));

// Session Setting
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'long-long-long-secret-string-1313513tefgwdsvbjkvasd'
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.flashMessages = req.flash();
  next();
});

configAuth(passport); 

app.use('/', index);
app.use('/users', users);
app.use('/notice', notice);
app.use('/training', training);
app.use('/question', question);
app.use('/feedbacks', feedbacks);
routeAuth(app, passport);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
