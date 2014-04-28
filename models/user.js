/**
 * Database schema for users.
 *
 * @author  James Didehvar <justaelf@gmail.com>
 * @version 0.0.1
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var url = require('url');

/**
 * The following fields are updated every time the users signs in:
 *   displayName, profileid, avatar, avatarMedium, avatarLarge
 *
 * @field steamid       64 bit Steam ID.
 * @field level         Compared when trying to modify another user.
 * @field displayName   Steam display name (size >= 2 & <= 32).
 * @field profileid     Full URL to Steam profile.
 * @field avatar        32x32.
 * @field avatarMedium  64x64.
 * @field avatarLarge   184x184.
 * @field permissions   Active permissions.
 * @field created       Initial account creation date.
 */
var userSchema = mongoose.Schema({
  steamid: {
    type: Number,
    unique: true,
    required: true
  },
  level: {
    type: Number,
    default: 0,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  profileid: {
    type: String,
    unique: true,
    required: true
  },
  avatar: {
    type: String,
    default: 'http://media.steampowered.com/steamcommunity/public/images/' +
        'avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg',
    required: true
  },
  avatarMedium: {
    type: String,
    default: 'http://media.steampowered.com/steamcommunity/public/images/' +
        'avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg',
    required: true
  },
  avatarLarge: {
    type: String,
    default: 'http://media.steampowered.com/steamcommunity/public/images/' +
        'avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
    required: true
  },
  permissions: [{
    type: Number,
    ref: 'Permission'
  }],
  created: {
    type: Date,
    default: Date.now(),
    required: true
  }
});

/**
 * Creates a new user using the Steam data specified. Callback returns two
 *   parameters: an error (or null) and the newly created user.
 *
 * @param {Object}    steamData Object containing the following data: steamid,
 *                              personaname, profileurl, avatar, avatarmedium,
 *                              avatarfull.
 * @param {Function}  callback  Takes two parameters: an error or null and the
 *                              newly created user.
 */
userSchema.statics.createWithSteamData = function(steamData, callback) {
  new this({
    steamid: steamData.steamid
  }).refreshSteamData(steamData, function(err, user) {
    return callback(err, user);
  });
};

/**
 * Fetches new data from the Steam API for the user.
 *
 * @param {Object}   steamData  Object containing the following data: steamid,
 *                              personaname, profileurl, avatar, avatarmedium,
 *                              avatarfull.
 * @param {Function} callback   Takes two parameters: an error or null and the
 *                              newly created user.
 */
userSchema.methods.refreshSteamData = function(steamData, callback) {
  this.displayName = steamData.personaname;

  var extract_id = url.parse(steamData.profileurl).pathname.split('/');
  this.profileid = extract_id[extract_id.length - 2];

  this.avatar = steamData.avatar;
  this.avatarMedium = steamData.avatarmedium;
  this.avatarLarge = steamData.avatarfull;

  this.save(function(err, user) {
    callback(err, user);
  });
};

/**
 * Checks if this user has a permission, or permissions.
 *
 * @param {Array} permissions Array containing all permissions to check for.
 *
 * @return {Boolean}          Whether the user has all of the permissions.
 */
userSchema.methods.hasPermission = function(permissions) {
  // Can't possibly have all the permissions!
  if (permissions.length > this.permissions.length) {
    return false;
  }

  var existingPermissions = this.permissions;

  // Loop through all required permissions and check they exist in the users
  // existing permissions.
  return permissions.every(function(element) {
    var result = existingPermissions.indexOf(element) >= 0;
    console.log(result);
    return result;
  })
};

module.exports = mongoose.model('User', userSchema);
