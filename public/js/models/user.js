var User = Ember.Object.extend({
  steamid: null,
  level: 0,
  display_name: null,
  profile_id: null,
  avatar: 'http://media.steampowered.com/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg',
  avatar_medium: 'http://media.steampowered.com/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg',
  avatar_full: 'http://media.steampowered.com/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
  created: null
});

User.reopenClass({
  getAllUsers: function() {
    return Ember.Deferred.promise(function (p) {
      p.resolve($.getJSON('/api/users').then(function(response) {
        var users = Ember.A();

        response.forEach(function(user_data) {
          var user = App.User.create(user_data);
          users.pushObject(user);
        });

        return users;
      }));
    });
  }
});

module.exports = User;
