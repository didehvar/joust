/**
 * Creates and manages permissions.
 *
 * @author  James Didehvar <justaelf@gmail.com>
 * @version 0.0.1
 */

var debug = require('debug')('joust');
var permissions = require('../config').permissions;
var Permission = require('../models/permission');

/**
 * Create a permission.
 *
 * @param {Number} count ID to use for the permission.
 * @param {String} desc  Description for the permission.
 */
var createPermission = function(count, desc) {
  new Permission({
    _id: count,
    description: desc
  }).save(function(err, perm) {
    if (err) {
      return console.log(new Error('Failed to add permission: ' + err));
    }

    debug('Created permission: (' + count + ') ' + desc);
  });
};

/**
 * Load a permission.
 *
 * @param {Object} obj      Permission object.
 * @param {Object} location obj's index.
 *
 * @return {[type]} [description]
 */
var loadPermission = function(obj, location) {
  Permission.findOne({ description: obj[location] }, function(err, perm) {
    if (err) {
      return console.log(err);
    }

    if (!perm) {
      return console.log(new Error('Permission not found.'));
    }

    obj[location] = perm._id;
  });
};

/**
 * Loop through all nested objects within an object, creating a permission
 *   for each one.
 *
 * @param {Object} obj Object to loop through.
 * @param {Object} create Will create a permission if set, will load a
 *                        permission otherwise.
 */
var count = 0;
var recurse = function(obj, create) {
  for (var a in obj) {
    if (typeof obj[a] === 'object') {
      recurse(obj[a], create);
    } else {
      var desc = obj[a];

      if (create) {
        var temp = count++;
        createPermission(temp, desc);
        obj[a] = temp;
      } else {
        loadPermission(obj, a);
      }
    }
  }
};

/** Create permissions (insert them into the database) and then load them. */
module.exports.create = function() {
  count = 0;
  recurse(permissions, true);
};

/** Load permissions that already exist in the database. */
module.exports.load = function() {
  count = 0;
  recurse(permissions, false);
};
