/**
 * Provides route access functions.
 * 
 * author: @didehvar
 * version: 0.0.1
 */

// forces user to login before continuing
exports.authenticated = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    req.flash('error', 'Please login.');
    res.redirect('/');
  }
};