var express = require('express');
var path = require('path');
var stylus = require('stylus');
var nib = require('nib');

var routes = require('./routes');

var app = express();

// general configuration
app.configure(function() {
  // setup views to use jade
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  // enable router
  app.use(app.router);

  // setup static assets
  app.use(express.static(path.join(__dirname, 'public')));

  // setup routes
  app.get('/', routes.index);

  // 404 route
  app.use(function(req, res, next) {
    var err = new Error('not found');
    err.status = 404;
    next(err);
  });
});

// development configuration
app.configure('development', function() {
  // configure stylus compilation from assets to public
  app.use(stylus.middleware({
    src: path.join(__dirname, 'assets'),
    dest: path.join(__dirname, 'public'),
    force: true,
    compress: true,
    compile: function(str, path) {
      return stylus(str)
        .set('filename', path)
        .set('compress', true)
        .use(nib())
        .import('nib');
    }
  }));

  // display full error messages in development
  app.use(function(err, req, res, next) {
    res.render('error', {
      message: err.message,
      error: err
    });
  });
});

app.configure('production', function() {
  // hide error messages in production
  app.use(function(err, req, res, next) {
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
});

module.exports = app;
