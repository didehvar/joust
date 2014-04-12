var router = require('express').Router();
var passport = require('passport');

router.get('/auth/steam',
  passport.authenticate('steam'),
  function(req, res, next) {
    // function not called
  }
);

router.get('/auth/steam/callback',
  passport.authenticate('steam', { failureRedirect: '/login' }),
  function(req, res, next) {
    res.redirect('/');
  }
);

module.exports.steam_auth = router;
