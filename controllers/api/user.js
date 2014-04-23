/**
 * User profile actions.
 * 
 * author: @didehvar
 * version: 0.0.1
 */

var User = require('../../models/user');

exports.create = function(req, res, next) {
  var user = new User(req.body);

  user.save(function(err) {
    if (err) {
      return res.send({ error: "Couldn't create user: " + err });
    }

    res.send(user);
  });
};

exports.find = function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      return res.send({ error: "Couldn't find user: " + err });
    }

    res.send(user);
  });
};

exports.find_all = function(req, res, next) {
  User.find(function(err, users) {
    if (err) {
      return res.send({ error: "Couldn't get any users: " + err });
    }

    res.send(users);
  });
};

exports.update = function(req, res, next) {
  User.findByIdAndUpdate(req.params.id, req.body, function(err, user) {
    if (err) {
      return res.send({ error: "Couldn't update user: " + err });
    }

    res.send(user);
  });
};

exports.delete = function(req, res, next) {
  User.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      return res.send({ error: "Couldn't remove user: " + err });
    }

    res.send('User deleted.');
  });
};
