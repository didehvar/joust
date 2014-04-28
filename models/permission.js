/**
 * Database schema for permissions.
 *
 * @author  James Didehvar <justaelf@gmail.com>
 * @version 0.0.1
 */

var mongoose = require('mongoose');

/**
 * Stores a list of all possible permissions. Permissions are assigned to
 *   users through the UserPermissions schema.
 *
 * @field _id         Numerical permission identifier.
 * @field description Explanation of the permission.
 */
var permission_schema = mongoose.Schema({
  _id: {
    type: Number,
    unique: true,
    required: true
  },
  description: String
});

module.exports = mongoose.model('Permission', permission_schema);
