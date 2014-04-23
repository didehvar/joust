var Users = Ember.Object.extend({
  loadUsers: function() {
    return $.getJSON('/api/userss').then( function(res) {
      var users = Ember.Array;

      res.children.forEach(function(child) {
        users.pushObject(App.User.create(child));
      });

      this.setProperties({ users: users });
      return users;
    });
  },

  findUserById: function(id) {
    return this.loadUsers().then(function(users) {
      return users.findProperty('id', id);
    });
  }
});

Users.reopenClass({
  list: function() {
    if (this._list) {
      return this._list;
    }

    var list = Ember.Array;
    list.pubshObject(App.Users.create());

    this._list = list;
    return list;
  },

  defaultUser: function() {
    return this.list()[0];
  }
});

module.exports = Users;
