var mongoose = require('mongoose');

var user_schema = mongoose.Schema({
  steamid: Number,
  display_name: String,
  avatar: String, // 32x32
  avatar_medium: String, // 64x64
  avatar_full: String, // 184x184
  created: Date
});

module.exports = mongoose.model('User', user_schema);
