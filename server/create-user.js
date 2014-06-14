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
    console.log('START USERNAME');
    var username = options.profile.name;
    console.log(username);
    var inc = 1;

    while (Meteor.users.find({ username: username }).count() > 0) {
      username = username + inc++;
    }

    // No users exist with this username, give it to this user.
    user.username = username;
    console.log(user.username);
    console.log('FINISH USERNAME');
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
      // Default placeholder avatars.
      avatar.large = 'http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/b5/b599127509772f2125568318a38f24e64881de61_full.jpg';
      avatar.medium = 'http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/b5/b599127509772f2125568318a38f24e64881de61_medium.jpg';
      avatar.small = 'http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/b5/b599127509772f2125568318a38f24e64881de61.jpg';
    }

    user.avatar = avatar;
  }

  console.log(user);
  return user;
});
