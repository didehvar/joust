var UsersRoute = Ember.Route.extend({
  model: function() {
    return App.Users.list();
  }
});

module.exports = UsersRoute;
