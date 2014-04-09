var index = require('express').Router();

index.use(function(req, res) {
  // check if logged in
  //console.log(req);

  res.render('index', { title: 'Welcome' });
});

module.exports.index = index;
