var mongoose = require('mongoose');

var user_schema = mongoose.Schema({
  steamid: Number,
  created: Date
});

module.exports = mongoose.model('User', user_schema);
