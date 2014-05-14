// User helpers, such as to display the current users username.

UI.registerHelper('currentUsername', function() {
  var user = Meteor.user();
  if (user.username) {
    return user.username;
  }

  if (user.profile && user.profile.name) {
    return user.profile.name;
  }

  if (user.emails && user.emails[0]) {
    return user.emails[0].address;
  }

  // Fallback, the user should definitely have a username, name or email!
  return 'User';
});
