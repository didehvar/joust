var express = require('express');
var path = require('path');
var cookie_parser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var SteamStrategy = require('passport-steam').Strategy;
var stylus = require('stylus');
var nib = require('nib');

var routes = require('./routes');

var app = express();

// setup passport
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new SteamStrategy({
    returnURL: process.env.AUTH_RETURN_URL || 'http://localhost:8111/auth/steam/callback',
    realm: process.env.AUTH_REALM || 'http://localhost:8111',
    apiKey: process.env.JOUST_STEAM_KEY
  },
  function(identifier, profile, done) {
    process.nextTick(function() {
      profile.identifier = identifier;
      return done(null, profile);
    });
  })
);

// general configuration
app.configure(function() {
  // setup views to use jade
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  // enable cookie parser and sessions
  app.use(cookie_parser());
  app.use(session({ secret: process.env.JOUST_SESSION_KEY, cookie: { secure: true } }));

  // setup passport authentication
  app.use(passport.initialize());
  app.use(passport.session());

  // enable router
  app.use(app.router);

  // setup static assets
  app.use(express.static(path.join(__dirname, 'public')));

  // setup routes
  app.get('/', routes.index);

  app.get('/auth/steam',
    passport.authenticate('steam'),
    function(req, res) {
      // request redirected to Steam
    }
  );

  app.get('/auth/steam/callback',
    passport.authenticate('steam', { failureRedirect: '/login' } ),
    function(req, res) {
      // auth successful
      res.redirect('/');
    }
  );

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
