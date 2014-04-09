var express = require('express');
var path = require('path');
var url = require('url');
var cookie_parser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var SteamStrategy = require('passport-steam').Strategy;
var stylus = require('stylus');
var nib = require('nib');
var mongoose = require('mongoose');
var User = require('./db/users.js');

var routes = require('./routes');

var app = express();

var util = require('util');

// setup mongodb
/*MongoClient.connect(process.env.MONGOHQ_URL, function(err, db) {
  var collection = db.collection('test');

  // clear collection
  collection.remove(function(err, result) {
    if (err) {
      return console.error(err);
    }
    console.log('collection cleared!');

    // add some test documents
    console.log('inserting test documents');
    collection.insert([{ name: 'tester' }, { name: 'coder' }], function(err, docs) {
      if (err) {
        return console.error(err);
      }

      console.log('inserted ', docs.length, ' new documents');
      collection.find({}).toArray(function(err, docs) {
        if (err) {
          return console.error(err);
        }

        docs.forEach(function(doc) {
          console.log('found document: ', doc);
        });
      });
    });
  });
});*/

mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/joust');

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
    apiKey: process.env.JOUST_STEAM_KEY || '1707CBE26A45706A2035BAE0384A18AA'
  },
  function(identifier, profile, done) {
    // convert identifier url to id
    var identifier_id = url.parse(identifier).pathname.split('/').pop();

    console.log(util.inspect(identifier, false, null));
    console.log(util.inspect(identifier_id, false, null));

    User.findOne({ steamID: identifier_id }, function(err, user) {
      if (err) { console.log(err); }
      if (!err && user !== null) {
        done(null, user);
      } else {
        var new_user = new User({
          steamID: identifier_id
        });
        new_user.save(function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("saving user");
            done(null, new_user);
          }
        });
      }
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
  app.use(session({ secret: process.env.JOUST_SESSION_KEY || 'joust', cookie: { secure: true } }));

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
