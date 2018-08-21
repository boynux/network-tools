var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mustache = require('mustache');

const indexRouter = require('./routes/index');

var app = express();

app.locals.config = require('config');

app.engine('.html', require('consolidate').mustache);
app.set('view engine', 'html');
app.use(require('./utils/view'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

if(app.locals.config.oauth.client_id) {
  const OAuth = require('./utils/oauth');
  const oauth = OAuth(app.locals.config.oauth.discovery,
    app.locals.config.oauth.client_id,
    app.locals.config.oauth.client_secret);

  app.use('/$', oauth.authenticate('http://localhost:3000/callback'), indexRouter);
  app.get('/callback', oauth.callback('http://localhost:3000/callback'), (req, res, next) => {
    res.redirect('/');
  });
} else {
  app.use('/$', indexRouter);
}

module.exports = app;
