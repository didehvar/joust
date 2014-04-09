var express = require('express');
var path = require('path');
var url = require('url');
var cookie_parser = require('cookie-parser');
var session = require('express-session');
var steam_web = require('steam-web');
var openid = require('openid');
var relying_party = new openid.RelyingParty(
  process.env.AUTH_RETURN_URL || 'http://localhost:8111/auth/steam/callback',
  process.env.AUTH_REALM || 'http://localhost:8111',
  true,
  true,
  []
);

var stylus = require('stylus');
var nib = require('nib');
var mongoose = require('mongoose');
var User = require('./db/users.js');

var routes = require('./routes');

var app = express();

var util = require('util');

// connect to db
mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/joust');

// load environment variables in development
app.configure('development', function() {
  require('./.env.dev.js');
});

// general configuration
app.configure(function() {
  // setup views to use jade
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  // enable cookie parser and sessions
  app.use(cookie_parser());
  app.use(session({ secret: process.env.JOUST_SESSION_KEY || 'joust', cookie: { secure: true } }));

  // enable router
  app.use(app.router);

  // setup static assets
  app.use(express.static(path.join(__dirname, 'public')));

  // setup routes
  app.get('/', routes.index);

  app.get('/auth/steam', function(req, res, next) {
    relying_party.authenticate('http://steamcommunity.com/openid', false, function(error, auth_url) {
      if (error) {
        var err = new Error('authentication failed: ' + error.message);
        next(err);
      } else if (!auth_url) {
        var auth_err = new Error('authentication failed');
        next(auth_err);
      } else {
        res.redirect(auth_url);
      }
    });
  });

  app.get('/auth/steam/callback', function(req, res, next) {
    relying_party.verifyAssertion(req, function(error, result) {
      if (error || !result.authenticated) {
        var err = new Error('authentication failed' + error.message);
        next(err);
      } else {
        console.log(util.inspect(result, false, null));
        var steam = new steam_web({ apiKey: process.env.JOUST_STEAM_KEY, format: 'json' });
        steam.getPlayerSummaries({
          steamids: [ result.claimedIdentifier ],
          callback: function(err, data) {
            console.log(data.response.players[0]);
          }
        });
        res.redirect('/'); // authentication success
      }
    });
  });

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
