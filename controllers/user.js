var url = require('url');

exports.login = function(req, res) {
  req.session.returnTo = url.parse(req.url, true).query.return;
  res.redirect('/auth/steam');
};

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};
