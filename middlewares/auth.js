/**
 * Provides route access functions.
 *
 * @author  James Didehvar <justaelf@gmail.com>
 * @version 0.0.1
 */

/** Ensures user is logged in; redirects if not. */
module.exports.authenticated = function(req, res, next) {
  if (req.user) {
    return next();
  }

  req.flash('error', 'Please login.');
  res.redirect('/');
};

/** Passport middleware, authenticates a user through Steam. */
module.exports.passportReturn = require('passport').authenticate('openid', {
  successRedirect: '/auth/done',
  failureRedirect: '/auth/failed',
  failureFlash: true,
  successFlash: 'You have successfully signed in through Steam.'
});
