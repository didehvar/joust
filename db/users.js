var mongoose = require('mongoose');

var User = mongoose.model('User', {
  steam_id: Number
});

module.exports = User;
