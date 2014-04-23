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
 * @field level Used when trying to use permissions: you can only use your 
 *              permissions on users who have a lower level than you.
 * @field display_name Steam display name (size >= 2 & <= 32).
 * @field profile_id Full URL to Steam profile.
 * @field avatar 32x32 Steam avatar.
 * @field avatar_medium 64x64 Steam avatar.
 * @field avatar_full 184x184 Steam avatar.
 * @field created Date of initial account creation.
 */
var user_schema = mongoose.Schema({
  steamid: { type: Number, unique: true, required: true },
  level: { type: Number, default: 0, required: true },
  display_name: { type: String, required: true },
  profile_id: { type: String, unique: true, required: true },
  avatar: { 
    type: String,
    default: 'http://media.steampowered.com/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg',
    required: true
  },
  avatar_medium: { 
    type: String,
    default: 'http://media.steampowered.com/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg',
    required: true
  },
  avatar_full: { 
    type: String,
    default: 'http://media.steampowered.com/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
    required: true
  },
  created: { type: Date, default: Date.now(), required: true }
});

module.exports = mongoose.model('User', user_schema);
