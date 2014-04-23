var User = Ember.Object.extend({
  steamid: null,
  level: 0,
  displayName: null,
  profileid: null,
  avatar: 'http://media.steampowered.com/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg',
  avatarMedium: 'http://media.steampowered.com/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg',
  avatarFull: 'http://media.steampowered.com/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
  created: null
});

User.reopenClass({
  findAll: function() {
    return App.ajax('/api/users').then(function(result) {
      var users = Ember.A();

      result.forEach(function(userData) {
        var user = App.User.create(userData);
        users.pushObject(user);
      });

      return users;
    });
  }
});

module.exports = User;
