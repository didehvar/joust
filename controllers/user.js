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
  res.redirect('/');
};

// displays the profile page for the specified user.
exports.profile = function(req, res, next) {
  var id = req.params.id;

  var find_user = function(field) {
    var arr = {};
    arr[field] = id;

    User.findOne(arr, function(err, user) {
      if (err || user === null) {
        return next();
      }

      res.render('user/profile', { profile: user });
    });
  }

  if (require('../helpers/utility').number(id)) {
    find_user('steamid');
   } else {
     find_user('display_name');
   }
};
