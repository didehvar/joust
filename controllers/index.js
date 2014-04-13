exports.index = function(req, res) {
  res.render('index', { title: 'Welcome', user: req.user });
};

exports.auth_failed = function(req, res) {
  res.render('error', { message: 'Steam auth failed' });
};
