/**
 * User profile actions.
 * 
 * author: @didehvar
 * version: 0.0.1
 */

var User = require('../../models/user');

// displays the profile page for the specified user.
exports.index = function(req, res, next) {
  var id = req.params.id;

  User.findOne({ profile_id: id }, function(err, user) {
    if (err || user === null) {
      return next(err);
    }

    res.render('user/profile', { 
      title: user.profile_id,
      profile: user
    });
  });
};

// deletes a user
exports.delete = function(req, res, next) {
  var id = req.params.id;

  User.findOneAndRemove({ profile_id: id }, function(err, user) {
    if (err || user === null) {
      return next(err);
    }

    req.flash('success', 'Account deleted.');
    res.redirect('/');
  })
}