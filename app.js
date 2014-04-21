var express = require('express');
var app = express();

// general utility modules
var path = require('path');

// database shtuff
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/joust');

// set environment
var env = process.env.NODE_ENV || 'development';

// compile less files
app.use(require('less-middleware')(path.join(__dirname, 'assets', 'less'), {
  dest: path.join(__dirname, 'public'),
  force: env === 'development' ? true : false,
  preprocess: {
    path: function(pathname, req) {
      return pathname.replace('/css', '');
    }
  }
}, {
  paths: [
    path.join(path.join(__dirname, 'public', 'bower_components', 'bootstrap', 'less')),
    path.join(path.join(__dirname, 'public', 'bower_components', 'fontawesome', 'less'))
  ]
}, {
  compress: true
}));

// use static public directory
app.use(express.static(path.join(__dirname, 'public')));

// use jade for views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// session setup
require('./helpers/session')(app);

// passport setup
require('./helpers/auth')(app);

// needed to parse post requests
app.use(require('body-parser')());

// helper functions available in templates
app.locals.basedir = path.join(__dirname, 'views');
app.locals.inflection = require('inflection');

// variables accessible in views
app.use(function(req, res, next) {
  res.locals.url = req.url;
  res.locals.user = req.user;
  res.locals.flash = req.flash();
  next();
});

// app routes
require('express-path')(app, [
  ['/*', 'index#fix_www'],
  ['/', 'index#index'],

  /* authentication */
  ['/auth/steam/failed', 'index#auth_failed'],
  ['/login', 'user#login'],
  ['/logout', 'user#logout'],

  /* user management */
  ['/users', 'api/user#find_all', 'get'],
  ['/users', 'api/user#create', 'post'],
  ['/users/:id', 'api/user#find', 'get'],
  ['/users/:id', 'api/user#update', 'put'],
  ['/users/:id', 'api/user#delete', 'delete']
]);

// 404 handler
app.use(function(req, res, next) {
  res.status(404);

  res.format({
    text: function() {
      res.type('txt').send('Not found');
    },

    html: function() {
      res.render('error', { message: 'Page not found', url: req.url });
    },

    json: function() {
      res.send({ error: 'Not found!' });
    }
  });
});

// error handler
app.use(function(err, req, res, next) {
  res.status(500);

  res.format({
    text: function() {
      res.type('txt').send(err);
    },

    html: function() {
      res.render('error', { error: err });
    },

    json: function() {
      res.send({ error: err });
    }
  });
});

module.exports = app;
