/**
 * Database schema for user prmissions.
 * 
 * author: @didehvar
 * version: 0.0.1
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * Registers permissions to users.
 * 
 * @field user User the permission is being assigned to.
 * @field permission Permission that is being assigned to the user.
 */
var user_permission_schema = mongoose.Schema({
  user: { type: ObjectId, ref: 'User' },
  permission: { type: ObjectId, ref: 'Permission' }
});

module.exports = mongoose.model('UserPermission', user_permission_schema);
