Accounts.onCreateUser(function(options, user) {
  var usingSteam = user && user.services && user.services.steam;

  // Makes a user with a specific steam id an admin.
  Meteor.setTimeout(function() {
    if (usingSteam && user.services.steam.id === '76561197997330921') {
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

    while (Meteor.users.find({ username: username }).count() > 0) {
      username = username + inc++;
    }

    // No users exist with this username, give it to this user.
    user.username = username;
  }

  // Set a default avatar if one doesn't exist.
  if (!user.avatar) {
    var avatar = {};

    if (usingSteam && user.services.steam.avatar) {
      if (user.services.steam.avatar.full) {
        avatar.large = user.services.steam.avatar.full;
      }

      if (user.services.steam.avatar.medium) {
        avatar.medium = user.services.steam.avatar.medium;
      }

      if (user.services.steam.avatar.small) {
        avatar.small = user.services.steam.avatar.medium;
      }
    } else {
      if (user.emails && user.emails.length > 0) {
        // Fetch gravatar avatars (if an email is set).
        var email = user.emails[0].address.trim().toLowerCase();
        var md5 = Npm.require('crypto').
            createHash('md5').update(email).digest('hex');

        email = 'https://secure.gravatar.com/avatar/' + md5 + '?d=identicon';

        avatar.large = email + '&s=184';
        avatar.medium = email + '&s=64';
        avatar.small = email + '&s=32';
      } else {
        avatar.large = '';
        avatar.medium = '';
        avatar.small = '';
      }
    }

    user.avatar = avatar;
  }

  return user;
});
