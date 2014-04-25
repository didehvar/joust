/**
 * Database schema for permissions.
 * 
 * author: @didehvar
 * version: 0.0.1
 */

var mongoose = require('mongoose');

/**
 * Stores a list of all possible permissions. Permissions are assigned to users
 * through the UserPermissions schema.
 * 
 * @field _id Numerical permission identifier
 * @field description An explanation of the permission for a user.
 */
var permission_schema = mongoose.Schema({
  _id: Number,
  description: String
});

module.exports = mongoose.model('Permission', permission_schema);
