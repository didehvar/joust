var router = require('express').Router();

router.use(function(req, res) {
  res.render('index', { title: 'Welcome', user: req.user });
});

module.exports.index = router;
