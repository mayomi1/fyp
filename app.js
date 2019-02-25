const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const session = require('express-session');
const mongoose = require('mongoose');
const handerbars = require('hbs');
const flash = require('connect-flash');
const config = require('./config');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const fs = require('fs');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));



mongoose.Promise = require('bluebird');
mongoose.connect(config.database, {useNewUrlParser: true})
	.then(res=> console.info('db connected'))
	.catch(err => console.error(err));

app.use(cookieParser());
app.use(session({
	secret: 'ihheabhejaeae',
	cookie: {
		maxAge: 10 * 60 * 1000
	},
	resave: true,
	saveUninitialized: true,
	rolling: true
}));
app.use(flash());
app.use('/', indexRouter);
app.use('/users', usersRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

const nav_menu = handerbars.compile(fs.readFileSync(__dirname + '/views/partials/nav_menu.hbs').toString('utf-8'));
handerbars.registerPartial('nav_menu', nav_menu);

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
