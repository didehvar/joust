var mongoose = require('mongoose');

var User = mongoose.model('User', {
  steamid: Number,
  created: Date
});

module.exports = User;
