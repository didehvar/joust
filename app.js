var express = require('express');
var app = express();

// general utility modules
var path = require('path');
var url = require('url');

// sessions
var cookie_parser = require('cookie-parser');
var session = require('express-session');

// database shtuff
var User = require('./db/users.js');
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/joust');

// improve css modules
var stylus = require('stylus');
var nib = require('nib');

// set environment
var env = process.env.NODE_ENV || 'development';

// auth module
var passport = require('passport');

passport.serializeUser(function(user, done) {
  done(null, user.steamid);
});

passport.deserializeUser(function(steamid, done) {
  User.findOne({ steamid: steamid }, function (err, user) {
    done(err, user);
  });
});

var steam_strategy = require('passport-steam').Strategy;
passport.use(new steam_strategy({
    returnURL: process.env.AUTH_RETURN_URL || 'http://localhost:8111/auth/steam/callback',
    realm: process.env.AUTH_REALM || 'http://localhost:8111',
    apiKey: '1707CBE26A45706A2035BAE0384A18AA'
  },
  function(identifier, profile, done) {
    User.findOne({ steamid: url.parse(identifier).pathname.split('/').pop() }, function(err, user) {
      return done(err, user);
    });
  }
));

// use jade for views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// session setup
app.use(cookie_parser());
app.use(session({ secret: 'keyboard cat' }));

// passport setup
app.use(passport.initialize());
app.use(passport.session());

// THIS IS REAL UGLY AND NEEDS SOME ATTENTION
// app routes
var routes = require('./routes/index.js');
app.get('/', routes.index);

/*var steam_routes = require('./routes/steam_auth.js');
app.get('/auth/steam', steam_routes.steam_auth);
app.get('/auth/steam/callback', steam_routes.steam_auth);*/
app.get('/auth/steam',
  passport.authenticate('steam'),
  function(req, res, next) {
    // function not called
  }
);

app.get('/auth/steam/callback',
  passport.authenticate('steam', { failureRedirect: '/login' }),
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
