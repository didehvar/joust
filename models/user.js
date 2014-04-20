/**
 * Database schema for users.
 * 
 * author: @didehvar
 * version: 0.0.1
 */

var mongoose = require('mongoose');

/**
 * The following fields are updated every time the users signs in:
 *  display_name, profile_id, avatar, avatar_medium, avatar_full
 * 
 * @field steamid 64 bit Steam ID.
 * @field display_name Steam display name (size >= 2 & <= 32).
 * @field profile_id Full URL to Steam profile.
 * @field avatar 32x32 Steam avatar.
 * @field avatar_medium 64x64 Steam avatar.
 * @field avatar_full 184x184 Steam avatar.
 * @field created Date of initial account creation.
 */
var user_schema = mongoose.Schema({
  steamid: Number,
  display_name: String,
  profile_id: String,
  avatar: String,
  avatar_medium: String,
  avatar_full: String,
  created: Date
});

module.exports = mongoose.model('User', user_schema);
