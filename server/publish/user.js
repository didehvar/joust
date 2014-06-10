Meteor.publish('avatar', function(username) {
	return Meteor.users.find({ username: username }, { fields: { 'avatar': 1 }});
});

Meteor.publish('username', function(username) {
	return Meteor.users.find({ username: username }, { fields: { 'username': 1 }});
});
