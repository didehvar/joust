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
exports.get = function(req, res, next) {
  User.find(function(err, users) {
    if (err) {
      return next(new Error("Couldn't get any users."));
    }

    res.send(users);
  });
};

exports.post = function(req, res, next) {
  var user = new User({
    steamid: req.body.steamid,
    display_name: req.body.display_name,
    profile_id: req.body.profile_id
  });

  user.save(function(err) {
    if (err) {
      return next(new Error("Couldn't create user."));
    }
  });

  res.send(user);
};
