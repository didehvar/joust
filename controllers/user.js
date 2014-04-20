/**
 * All routes to do with user actions and pages.
 * 
 * author: @didehvar
 * version: 0.0.1
 */

var url = require('url');
var User = require('../models/user');

// passes a user to the login route after setting the return url.
exports.login = function(req, res) {
  req.session.returnTo = url.parse(req.url, true).query.return;
  res.redirect('/auth/steam');
};

// logs the user out and redirects them back to the homepage.
exports.logout = function(req, res) {
  req.logout();
  req.flash('success', 'You have been logged out.');
  
  res.redirect(url.parse(req.url, true).query.return);
};

// list all users
exports.index = function(req, res, next) {
  var per_page = 10;
  var page = parseInt(url.parse(req.url, true).query.page, 10) || 1;

  // makes url make more sense
  if (page < 1) {
    page = 1;
  }

  var query = User.find({});
  require('async').parallel([
    function(callback) {
      query.count(function(err, count) {
        if (err || count === null) {
          return callback(new Error("Couldn't count User collection rows."));
        }

        callback(null, count);
      });
    },
    function(callback) {
      query.skip((page - 1) * per_page).limit(per_page).exec('find', function(err, users) {
        if (err || users === null) {
          return callback(new Error("Couldn't find anything from User collection"));
        }

        callback(null, users);
      });
    }
  ], function(err, results) {
    if (err) {
      return next(err);
    }

    res.render('user/index', { users: results[1], page: page, total_pages: Math.ceil(results[0] / per_page) });
  });
};

// displays the profile page for the specified user.
exports.profile = function(req, res, next) {
  var id = req.params.id;

  User.findOne({ profile_id: id }, function(err, user) {
    if (err || user === null) {
      return next();
    }

    res.render('user/profile', { profile: user });
  });
};
