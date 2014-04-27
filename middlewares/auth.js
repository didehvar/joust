/**
 * Provides route access functions.
 *
 * author: @didehvar
 * version: 0.0.1
 */

// forces user to login before continuing
module.exports.authenticated = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    req.flash('error', 'Please login.');
    res.redirect('/');
  }
};

module.exports.passport = require('passport').authenticate('openid', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/auth/steam/failed',
  failureFlash: true,
  successFlash: 'You have successfully signed in through Steam.'
});
