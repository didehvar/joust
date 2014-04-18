exports.authenticated = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    req.flash('error', 'Please login.');
    res.redirect('/');
  }
};