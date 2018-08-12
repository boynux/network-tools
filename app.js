var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mustache = require('mustache');

var indexRouter = require('./routes/index');

var app = express();

// config
app.engine('.html', require('consolidate').mustache);
app.set('view engine', 'html');

app.use(require('./utils/view'));
app.use(require('./utils/config'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

module.exports = app;
