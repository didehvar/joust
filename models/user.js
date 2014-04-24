/**
 * Database schema for users.
 * 
 * author: @didehvar
 * version: 0.0.1
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

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
 * @field permissions Array of permissions that this user has
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
  permissions: [{ type: ObjectId, ref: 'Permission' }],
  created: { type: Date, default: Date.now(), required: true }
});

// checks whether a user has a permission
user_schema.methods.has_permission = function(permission) {
  for (var i = 0; i < this.permissions.length; i++) {
    if (this.permissions[i].name === permission) {
      return true;
    }
  }

  return false;
};

/*
  res.locals.has_permission = function(user_id, permission_name) {
    if (!user_id || !permission_name) {
      return false;
    }

    console.log('Attempting to find user with id: ' + user_id + ' and permission: ' + permission_name);

    // this should be moved somewhere else
    require('./models/user')
      .findOne({ _id: user_id })
      .populate({
        path: 'permissions',
        match: { name: permission_name },
        select: 'name'
      })
      .exec(function(err, user) {
        if (err) {
          return next(new Error("Couldn't select permission for user: " + err));
        }

        if (!user || typeof user.permissions === 'undefined' || user.permissions.length <= 0) {
          return false;
        }

        console.log('Found user: ' + user);
        console.log('Found user permissions: ' + typeof user.permissions);
      });
  };
*/

module.exports = mongoose.model('User', user_schema);
