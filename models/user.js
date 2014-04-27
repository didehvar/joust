/**
 * Database schema for users.
 *
 * author: @didehvar
 * version: 0.0.1
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var url = require('url');

/**
 * The following fields are updated every time the users signs in:
 *  displayName, profileid, avatar, avatarMedium, avatarLarge
 *
 * @field steamid 64 bit Steam ID.
 * @field level Used when trying to use permissions: you can only use your
 *              permissions on users who have a lower level than you.
 * @field displayName Steam display name (size >= 2 & <= 32).
 * @field profileid Full URL to Steam profile.
 * @field avatar 32x32 Steam avatar.
 * @field avatarMedium 64x64 Steam avatar.
 * @field avatarLarge 184x184 Steam avatar.
 * @field permissions Array of permissions that this user has
 * @field created Date of initial account creation.
 */
var userSchema = mongoose.Schema({
  steamid: { type: Number, unique: true, required: true },
  level: { type: Number, default: 0, required: true },
  displayName: { type: String, required: true },
  profileid: { type: String, unique: true, required: true },
  avatar: {
    type: String,
    default: 'http://media.steampowered.com/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg',
    required: true
  },
  avatarMedium: {
    type: String,
    default: 'http://media.steampowered.com/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg',
    required: true
  },
  avatarLarge: {
    type: String,
    default: 'http://media.steampowered.com/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
    required: true
  },
  permissions: [{ type: Number, ref: 'Permission' }],
  created: { type: Date, default: Date.now(), required: true }
});

// callback takes two args: error & user
userSchema.statics.createWithSteamData = function(steam_data, callback) {
  user = new User({
    steamid: steam_data.steamid
  });

  user.refresh_steam(function(err, user) {
    return callback(err, user);
  });
};


// callback takes two args: error & user
userSchema.methods.refreshSteamData = function(steam_data, callback) {
  this.displayName = steam_data.personaname;

  var extract_id = url.parse(steam_data.profileurl).pathname.split('/');
  this.profileid = extract_id[extract_id.length - 2];

  this.avatar = steam_data.avatar;
  this.avatarMedium = steam_data.avatarmedium;
  this.avatarLarge = steam_data.avatarfull;

  this.save(function(err, user) {
    callback(err, user);
  });
};

// checks whether a user has a permission
userSchema.methods.hasPermission = function(permission) {
  for (var i = 0; i < this.permissions.length; i++) {
    if (this.permissions[i]._id === permission) {
      return true;
    }
  }

  return false;
};

module.exports = mongoose.model('User', userSchema);
