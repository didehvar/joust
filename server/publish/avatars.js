Meteor.publish('avatars', function(username) {
	return Meteor.users.find({ username: username }, { fields: { 'services.steam.avatar': 1 }});
});
