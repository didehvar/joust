var express = require('express');
var app = express();

// general utility modules
var path = require('path');
var url = require('url');

// database shtuff
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/joust');

// improve css modules
var stylus = require('stylus');
var nib = require('nib');

// set environment
var env = process.env.NODE_ENV || 'development';

// use jade for views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// session setup
app.use(require('cookie-parser')());

var session = require('express-session');
var mongo_session = require('connect-mongo')(session);

app.use(session({
  store: new mongo_session({
    mongoose_connection: mongoose.connections[0]
  }),
  secret: process.env.JOUST_SESSION_KEY || 'keyboard cat',
  cookie: {
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 // one day
  }
}));

// passport setup
var passport = require('./helpers/auth.js');
app.use(passport.initialize());
app.use(passport.session());

// app routes
var routes = [
  ['/*', 'index#fix_www'],
  ['/', 'index#index'],
  ['/auth-failed', 'index#auth_failed']
];

require('express-path')(app, routes);

// cannot use paspport.authenticate with express-path (?)
app.get('/auth/steam',
  passport.authenticate('steam'),
  function(req, res, next) {
    // function not called
  }
);

app.get('/auth/steam/callback',
  passport.authenticate('steam', { successRedirect: '/', failureRedirect: '/auth-failed' }),
  function(req, res, next) {
    res.redirect('/');
  }
);

// development only configuration
if (env === 'development') {
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
}

module.exports = app;
