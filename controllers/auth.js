/**
 * Manages all authentication functions, including anything related to
 *   passport.
 *
 * @author  James Didehvar <justaelf@gmail.com>
 * @version 0.0.1
 */

var passport = require('passport');
var strategy = require('passport-openid').Strategy;
var steam = require('steam-web');
var url = require('url');
var User = require('../models/user');

/**
 * Updates the Steam data for a user. If no user is specified then a new user
 *   will be created.
 *
 * @param  {Number}   steamid   64 bit Steam ID
 * @param  {Model}    user      Existing user, null otherwise
 * @param  {Function} callback  Takes error and user as parameters
 */
function updateSteamData(steamid, user, callback) {
  new steam({
    apiKey: process.env.JOUST_STEAM_KEY,
    format: 'json'
  }).getPlayerSummaries({
    steamids: [steamid],
    callback: function(err, result) {
      if (err) {
        return callback(err, user);
      }

      // response returns array, no two players should have the steam id, so there (hopefully) will only ever be one player!
      var profile = result.response.players[0];

      if (!user) {
        User.createWithSteamData(profile, function(err, user) {
          return callback(err, user);
        });
      } else {
        user.refreshSteamData(profile, function(err, user) {
          return callback(err, user);
        });
      }
    }
  });
}

/**
 * Initialise Passport for Express.
 *
 * @param {express} app
 */
module.exports.passport = function(app) {
  /** Serialize the users Steam ID into the session. */
  passport.serializeUser(function(user, done) {
    done(null, user.steamid);
  });

  /** Destroys the session for a user. */
  passport.deserializeUser(function(steamid, done) {
    User.findOne({
      steamid: steamid
    }, function(err, user) {
      done(err, user);
    });
  });

  /**
   * Sets up the Passport strategy. Will create a database entry for the new
   *   user and request user data from the Steam API.
   */
  passport.use(new strategy({
      returnURL: process.env.SITE_URL + '/auth/steam',
      realm: process.env.SITE_URL,
      providerURL: 'http://steamcommunity.com/openid',
      profile: true,
      stateless: true
    },
    function(identifier, done) {
      process.nextTick(function() {
        // http://steamcommunity.com/openid/id/12345678912345678 ->
        // 12345678912345678
        var steamid = url.parse(identifier).pathname.split('/').pop();

        User.findOne({
          steamid: steamid
        }, function(err, user) {
          if (err) {
            return done(err);
          }

          updateSteamData(steamid, user, function(err, user) {
            return done(err, user);
          });
        });
      });
    }
  ));

  app.use(passport.initialize());
  app.use(passport.session());
};

module.exports.steam = function() {};
