// redirects to remove www.
exports.fix_www = function(req, res, next) {
  if (req.headers.host.match(/^www\./) !== null) {
    res.redirect('http://' + req.headers.host.slice(4) + req.url, 301);
  } else {
    next();
  }
};

exports.index = function(req, res) {
  res.render('index', { title: 'Welcome', user: req.user });
};

exports.auth_failed = function(req, res) {
  res.render('error', { message: 'Steam auth failed' });
};
