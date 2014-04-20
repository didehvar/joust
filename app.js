var express = require('express');
var app = express();

// general utility modules
var path = require('path');

// database shtuff
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/joust');

// set environment
var env = process.env.NODE_ENV || 'development';

// use static public directory
app.use(express.static(path.join(__dirname, 'public')));

// use jade for views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// session setup
require('./helpers/session')(app);

// passport setup
require('./helpers/auth')(app);

// helper functions available in templates
app.locals.basedir = path.join(__dirname, 'views');
app.locals.inflection = require('inflection');

app.use(function(req, res, next) {
  res.locals.user = req.user;
  res.locals.flash = req.flash();
  next();
});

// app routes
var routes = [
  ['/*', 'index#fix_www'],
  ['/', 'index#index'],

  /* authentication */
  ['/auth/steam/failed', 'index#auth_failed'],
  ['/login', 'user#login'],
  ['/logout', 'user#logout'],

  /* user management */
  ['/user/:id', 'user#profile']
];

require('express-path')(app, routes);

// 404 handler
app.use(function(req, res, next) {
  res.status(404);

  if (req.accepts('html')) {
    res.render('error', { message: 'Page not found', url: req.url });
    return;
  }

  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  res.type('txt').send('Not found');
});

module.exports = app;
