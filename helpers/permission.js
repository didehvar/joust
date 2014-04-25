var Permission = require('../models/permission');
var count = 0;

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

var permissions_obj = {};

var save_permission = function(err, perm) {
  if (err) {
    console.log('Failed to add permission: ' + err);
  } else {
    console.log('Added permission: ' + perm);
  }
};

var add_permission = function(obj, path) {
  var new_path = path;
  if (path) {
    new_path += '.';
  }

  for (var p in obj) {
    if (typeof obj[p] === 'object') {
      add_permission(obj[p], new_path + p);
    } else {
      new Permission({
        _id: count++,
        path: new_path + p,
        description: obj[p]
      }).save(save_permission);
    }
  }
};

module.exports.permissions = function() {
  console.log(permissions_obj);
  return permissions_obj;
};

module.exports.load = function() {
  add_permission(permission_descriptions, '');
};

module.exports.load_existing = function() {
  Permission.find({}, function(err, permissions) {
    if (err) {
      console.log(err);
    } else {
      for (var i = 0; i < permissions.length; i++) {
        console.log('Adding permission ' + permissions[i].path + ' with id: ' + permissions[i]._id);
        permissions_obj[permissions[i].path] = permissions[i]._id;
      }
    }
  });
};
