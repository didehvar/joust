var Permission = require('../models/permission');

/**
 * Just an object full of permission descriptions!
 * The path used (to check for permissions) is that specified by the route taken to the final object,
 * for example:
 * 
 *  {
 *    user: {
 *      create: 'Create a new user',
 *      update: 'Update a user',
 *  }
 *
 * Would correspond to the permissions user.create and user.update.
 * Feel free to embedd permissions within each other until your heart's content (e.g. admin.modify.user.delete).
 */
var permission_descriptions = {
  user: {
    create: 'Create a new user',
    update: 'Update a user',
    delete: 'Permanently delete a user',
    admin: {
      destroy: 'Destruction',
      nuke: 'Cold war',
      domination: {
        country: 'Remove president',
        world: 'Communism is a go',
      }
    }
  },
};

var save = function(err, permission) {
  if (err) {
    console.log(new Error('Failed to add permission: ' + err));
  }
};

var count = 0;
var recurse = function(obj) {
  for (var a in obj) {
    if (typeof obj[a] === 'object') {
      recurse(obj[a]);
    } else {
      var temp = count++;
      var desc = obj[a];
      obj[a] = temp;

      new Permission({
        _id: temp,
        description: desc
      }).save(save);
    }
  }
};

// create permissions collection
module.exports.load = function() {
  recurse(permission_descriptions);
};

module.exports.permissions = permission_descriptions;
