var express = require('express');
var path = require('path');
var stylus = require('stylus');
var nib = require('nib');

var routes = require('./routes');

var app = express();

// setup views to use jade
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// compile stylus files in development
app.configure('development', function() {
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
});

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

// catch and display errors
app.configure('development', function() {
  app.use(function(err, req, res, next) {
    res.render('error', {
      message: err.message,
      error: err
    });
  });
});

app.configure('production', function() {
  app.use(function(err, req, res, next) {
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
});

module.exports = app;
