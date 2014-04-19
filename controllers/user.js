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

  User.findOne({ steamid: id }, function(err, user) {
    if (err || user === null) {
      return next();
    }

    res.render('user/profile', { profile: user });
  })
};
