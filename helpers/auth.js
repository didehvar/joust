var passport = require('passport');
var steam_strategy = require('passport-steam').Strategy;
var User = require('../models/users');
var url = require('url');

module.exports = function(app) {
  passport.serializeUser(function(user, done) {
    done(null, user.steamid);
  });

  passport.deserializeUser(function(steamid, done) {
    User.findOne({ steamid: steamid }, function (err, user) {
      done(err, user);
    });
  });

  passport.use(new steam_strategy({
      returnURL: process.env.AUTH_RETURN_URL || 'http://localhost:8111/auth/steam/callback',
      realm: process.env.AUTH_REALM || 'http://localhost:8111',
      apiKey: process.env.JOUST_STEAM_KEY
    },
    function(identifier, profile, done) {
      process.nextTick(function() {
        var steamid = url.parse(identifier).pathname.split('/').pop();
        User.findOne({ steamid: steamid }, function(err, user) {
          if (err) {
            return done(err);
          }

          if (user) {
            return done(err, user);
          } else {
            var new_user = new User();

            new_user.steamid = steamid;
            new_user.created = Date.now();

            new_user.save(function(err) {
              if (err) {
                throw err;
              }

              return done(null, new_user);
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
    passport.authenticate('steam'),
    function(req, res, next) {
      // function not called
    }
  );

  app.get('/auth/steam/callback',
    passport.authenticate('steam', { successRedirect: '/', failureRedirect: '/auth/steam/failed' }),
    function(req, res, next) {
      res.redirect('/');
    }
  );
};
