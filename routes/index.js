var express = require("express");
var index = express.Router();

index.use(function(req, res) {
  // check if logged in
  console.log(req.session);
  res.render('index', { title: 'Welcome' });
});

module.exports.index = index;
