var url = require('url');
var User = require('../models/user');

exports.login = function(req, res) {
  req.session.returnTo = url.parse(req.url, true).query.return;
  res.redirect('/auth/steam');
};

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

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
