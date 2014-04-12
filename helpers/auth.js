var passport = require('passport');
var User = require('../db/users.js');
var url = require('url');

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
    apiKey: process.env.JOUST_STEAM_KEY
  },
  function(identifier, profile, done) {
    User.findOne({ steamid: url.parse(identifier).pathname.split('/').pop() }, function(err, user) {
      return done(err, user);
    });
  }
));

module.exports = passport;
