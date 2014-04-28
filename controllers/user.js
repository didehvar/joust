/**
 * All routes to do with user actions and pages.
 *
 * @author  James Didehvar <justaelf@gmail.com>
 * @version 0.0.1
 */

var auth = require('./auth');
var utility = require('../helpers/utility');
var url = require('url');
var User = require('../models/user');

/** Based on a profile id, returns a user within the profile variable. */
exports.find = function(req, res, next) {
  User
    .findOne({
      profileid: req.params.id
    })
    .populate('permissions')
    .exec(function(err, user) {
      if (err) {
        return next(new Error("Couldn't find user: " + err));
      }

      res.render('user/profile', {
        profile: user
      });
  });
};

/** Returns all users to the users variable. */
exports.findAll = function(req, res, next) {
  User.find(function(err, users) {
    if (err) {
      return next(new Error("Couldn't get any users: " + err));
    }

    res.render('user/index', {
      users: users
    });
  });
};

/** Returns updated user in the user variable. */
exports.update = function(req, res, next) {
  User.findOneAndUpdate({
    profile_id: req.params.id
  }, req.body, function(err, user) {
    if (err) {
      return next(new Error("Couldn't update user: " + err));
    }

    res.render('user/index', {
      user: user
    });
  });
};

/** Redirects to the main user index after a user is deleted. */
exports.delete = function(req, res, next) {
  console.log('attempting to delete');
  User.findOneAndRemove({
    profile_id: req.params.id
  }, function(err) {
    if (err) {
      return next(new Error("Couldn't remove user: " + err));
    }

    req.flash('success', 'User deleted.');
    res.redirect('/users');
  });
};
