Accounts.onCreateUser(function(options, user) {
  // Is elf!
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

  return user;
});
