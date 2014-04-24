/**
 * All routes to do with user actions and pages.
 * 
 * author: @didehvar
 * version: 0.0.1
 */

var url = require('url');
var User = require('../models/user');
var utility = require('../helpers/utility');

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

// generic error route for authentication failure
exports.auth_failed = function(req, res) {
  res.render('error', { title: 'Steam auth failed' });
};

exports.create = function(req, res, next) {
  var user = new User(req.body);

  user.save(function(err) {
    if (err) {
      return next(new Error("Couldn't create user: " + err));
    }

    res.render('user/index', { user: user });
  });
};

exports.find = function(req, res, next) {
  var render = function(err, user) {
    if (err) {
      return next(new Error("Couldn't find user: " + err));
    }

    res.render('user/profile', { profile: user });
  };

  if (utility.number(req.params.id)) {
    User.findById(req.params.id, function(err, user) {
      render(err, user);
    });
  } else {
    User.findOne({ profile_id: req.params.id }, function(err, user) {
      render(err, user);
    });
  }
};

exports.find_all = function(req, res, next) {
  User.find(function(err, users) {
    if (err) {
      return next(new Error("Couldn't get any users: " + err));
    }

    res.render('user/index', { users: users });
  });
};

exports.update = function(req, res, next) {
  User.findByIdAndUpdate(req.params.id, req.body, function(err, user) {
    if (err) {
      return next(new Error("Couldn't update user: " + err));
    }

    res.render('user/index', { user: user });
  });
};

exports.delete = function(req, res, next) {
  User.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      return next(new Error("Couldn't remove user: " + err));
    }

    req.flash('success', 'User deleted.');
    res.render('user/index');
  });
};
