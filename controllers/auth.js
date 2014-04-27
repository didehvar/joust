/**
 * Manages all auth functions, including anything related to passport.
 * 
 * author: @didehvar
 * version: 0.0.1
 */

var passport = require('passport');
var steam_web = require('steam-web');
var openid_strategy = require('passport-openid').Strategy;
var User = require('../models/user');
var url = require('url');

// fetches users steam data based on steamid
// user can be null
function update_steam_data(steamid, user, callback) {
  var steam = new steam_web({
    apiKey: process.env.JOUST_STEAM_KEY,
    format: 'json'
  });

  steam.getPlayerSummaries({
    steamids: [steamid],
    callback: function(err, result) {
      if (err) {
        return callback(err, user);
      }

      var profile = result.response.players[0];

      if (!user) {
        User.create_with_steam(profile, function(err, user) {
          return callback(err, user);
        });
      } else {
        user.refresh_steam(profile, function(err, user) {
          return callback(err, user);
        });
      }
    }
  });
}

// sets up passport
module.exports.passport = function(app) {
  passport.serializeUser(function(user, done) {
    done(null, user.steamid);
  });

  passport.deserializeUser(function(steamid, done) {
    User.findOne({ steamid: steamid }, function (err, user) {
      done(err, user);
    });
  });

  passport.use(new openid_strategy({
      returnURL: process.env.AUTH_RETURN_URL,
      realm: process.env.SITE_URL,
      providerURL: 'http://steamcommunity.com/openid',
      profile: true,
      stateless: true
    },
    function(identifier, done) {
      process.nextTick(function() {
        // the returned identifier is a url to the steam user, e.g.
        // http://steamcommunity.com/openid/id/12345678912345678
        var steamid = url.parse(identifier).pathname.split('/').pop();

        User.findOne({ steamid: steamid }, function(err, user) {
          if (err) {
            return done(err);
          }

          update_steam_data(steamid, user, function(err, user) {
            return done(err, user);
          });
        });
      });
    }
  ));

  app.use(passport.initialize());
  app.use(passport.session());
};

module.exports.routes = function(app) {
  // cannot use paspport.authenticate with express-path (?)
  app.get('/auth/steam',
    passport.authenticate('openid'),
    function(req, res, next) {
      // function not called
    }
  );

  app.get('/auth/steam/callback',
    passport.authenticate('openid', {
      successReturnToOrRedirect: '/',
      failureRedirect: '/auth/steam/failed',
      failureFlash: true,
      successFlash: 'You have successfully signed in with Steam.'
    }),
    function(req, res, next) {
      res.redirect('/');
    }
  );
};
