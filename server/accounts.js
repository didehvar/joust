// Ensure that when an account is created an email is set and prompt for one
// if missing.
/*Accounts.onCreateUser(function(options, user) {
  console.log(options);

  // Check for steam login.
  if (user.services && user.services.steam) {
    if (!user.hasOwnProperty('username')) {
      user.username = user.services.steam.username;
    }
  }

  // Handle default meteor profile.
  if (options.profile) {
    user.profile = options.profile;
  }

  if (!options.hasOwnProperty('email')) {
    console.log('no email!!');
    Session.set('promptForEmail', true);
  }

  console.log(user);
  return user;
});*/
