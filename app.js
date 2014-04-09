var express = require('express');
/*var path = require('path');
var url = require('url');
var cookie_parser = require('cookie-parser');
var session = require('express-session');

var steam_web = require('steam-web');
var openid = require('openid');
var relying_party = new openid.RelyingParty(
  process.env.AUTH_RETURN_URL || 'http://localhost:8111/auth/steam/callback',
  process.env.AUTH_REALM || 'http://localhost:8111',
  true,
  false,
  []
);

var stylus = require('stylus');
var nib = require('nib');
var mongoose = require('mongoose');
var User = require('./db/users.js');

var routes = require('./routes');

var app = express();

var util = require('util');

// get environment
var env = process.env.NODE_ENV || 'development';

// connect to db
mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/joust');

// load environment variables in development
if (env === 'development') {
  require('./.env.dev.js');
}

// general configuration
// setup views to use jade
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cookie_parser());

// setup routes
app.get('/', session, routes.index);

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

function update_session(req, res, steamid) {
  if (req.session.auth) {
    var error = new Error('already authed?');
    next(error);
  } else {
    req.session.auth = steamid;
    console.log('saving session');
  }
    res.redirect('/'); // authentication success
}

// this really needs some love
app.get('/auth/steam/callback', session, function(req, res, next) {
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
          if (err) {
            var error = new Error('steam web api failed');
            next(error);
          } else {
            console.log(data.response.players[0]);

            var player = data.response.players[0];
            if (!player) {
              var error_web = new Error('unable to get steam player');
              next(error_web);
            } else {
              console.log('checking db for user...');
              User.findOne({ steamid: player.steamid }, function(err, user) {
                if (err) {
                  console.log(err);
                }

                if (!err && user !== null) {
                  console.log('user exists');
                  update_session(req, res, player.steamid);
                } else {
                  var new_user = new User({
                    steamid: player.steamid,
                    created: Date.now()
                  });

                  new_user.save(function(err) {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log('saved user');
                      update_session(req, res, player.steamid);
                    }
                  });
                }
              });
            }
          }
        }
      });
    }
  });
});

// 404 route
app.use(function(req, res, next) {
  var err = new Error('not found');
  err.status = 404;
  next(err);
});

// development configuration
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

  // display full error messages in development
  app.use(function(err, req, res, next) {
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

if (env === 'production') {
  // hide error messages in production
  app.use(function(err, req, res, next) {
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}

// setup static assets
app.use(express.static(path.join(__dirname, 'public')));
*/

module.exports = app;
