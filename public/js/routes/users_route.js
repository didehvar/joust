var UsersRoute = Ember.Route.extend({
  activate: function() {
    $(document).attr('title', 'Users');
  },

  model: function() {
    return App.User.findAll();
  }
});

module.exports = UsersRoute;
