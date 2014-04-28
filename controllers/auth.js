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

/** Redirects user to Passport then returns to current page. */
exports.login = function(req, res) {
  req.session.returnTo = req.protocol + '://' + req.get('host') +
      url.parse(req.url, true).query.return;

  res.redirect('/auth');
};

/** Logs the user out and redirects them back to the homepage. */
exports.logout = function(req, res) {
  req.logout();

  req.flash('success', 'You have been logged out.');
  res.redirect(req.protocol + '://' + req.get('host') +
      url.parse(req.url, true).query.return);
};

/** Generic error route for when Passport fails. */
exports.authFailed = function(req, res) {
  res.render('error', {
    title: 'Steam authentication failed'
  });
};

/**
 * Updates the Steam data for a user. If no user is specified then a new user
 *   will be created.
 *
 * @param  {Number}   steamid   64 bit Steam ID.
 * @param  {Model}    user      Existing user, null otherwise.
 * @param  {Function} callback  Takes two parameters: an error or null and the
 *                              updated user.
 */
var updateSteamData = function(steamid, user, callback) {
  new steam({
    apiKey: process.env.JOUST_STEAM_KEY,
    format: 'json'
  }).getPlayerSummaries({
    steamids: [steamid],
    callback: function(err, result) {
      if (err) {
        return callback(err, user);
      }

      var profile = result.response.players[0];

      if (!user) {
        return User.createWithSteamData(profile, function(err, user) {
          callback(err, user);
        });
      }

      user.refreshSteamData(profile, function(err, user) {
        callback(err, user);
      });
    }
  });
};
module.exports.updateSteamData = updateSteamData;

/** Initialise Passport for Express. */
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
      returnURL: process.env.SITE_URL + '/auth',
      realm: process.env.SITE_URL,
      providerURL: 'http://steamcommunity.com/openid',
      profile: true,
      stateless: true
    },
    function(identifier, done) {
      process.nextTick(function() {
        /**
         * http://steamcommunity.com/openid/id/12345678912345678 ->
         *   12345678912345678
         */
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
