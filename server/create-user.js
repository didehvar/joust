Accounts.onCreateUser(function(options, user) {
  // Makes a user with a specific steam id an admin.
  Meteor.setTimeout(function() {
    if (user && user.services && user.services.steam &&
        user.services.steam.id === '76561197997330921') {
    	console.log('setting role: ' + user._id);
    	Roles.addUsersToRoles(user._id, 'admin');
  	}
  }, 3000);

  if (options.profile) {
    user.profile = options.profile;
  }

  // Convert a steam name into a username.
  if (options.profile && options.profile.name) {
    var username = options.profile.name;
    var inc = 1;

    while (Meteor.users.find({ 'username': username }).count() > 0) {
      username = username + inc++;
    }

    // No users exist with this username, give it to this user.
    user.username = username;
  }

  console.log(user);
  return user;
});
