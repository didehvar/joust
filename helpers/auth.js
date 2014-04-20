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
function update_steam_data(steamid, user, done) {
  var steam = new steam_web({
    apiKey: process.env.JOUST_STEAM_KEY,
    format: 'json'
  });

  steam.getPlayerSummaries({
    steamids: [steamid],
    callback: function(err, result) {
      if (err) {
        return done(err, user);
      }

      var profile = result.response.players[0];

      // user has been created by this point, proceed to update their steam info
      user.display_name = profile.personaname;

      var extract_id = url.parse(profile.profileurl).pathname.split('/');
      user.profile_id = extract_id[extract_id.length - 2];

      user.avatar = profile.avatar;
      user.avatar_medium = profile.avatarmedium;
      user.avatar_full = profile.avatarfull;

      user.save(function(err) {
        return done(err, user);
      });
    }
  });
}

// sets up passport
module.exports = function(app) {
  passport.serializeUser(function(user, done) {
    done(null, user.steamid);
  });

  passport.deserializeUser(function(steamid, done) {
    User.findOne({ steamid: steamid }, function (err, user) {
      done(err, user);
    });
  });

  passport.use(new openid_strategy({
      returnURL: process.env.AUTH_RETURN_URL || 'http://localhost:8111/auth/steam/callback',
      realm: process.env.SITE_URL || 'http://localhost:8111',
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

          if (user) {
            update_steam_data(steamid, user, done);
          } else {
            var new_user = new User();

            new_user.steamid = steamid;
            new_user.created = Date.now();

            new_user.save(function(err) {
              if (err) {
                throw err;
              }

              update_steam_data(steamid, new_user, done);
            });
          }
        });
      });
    }
  ));

  app.use(passport.initialize());
  app.use(passport.session());

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
