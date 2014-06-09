Router.map(function() {
	this.route('userProfile', {
		path: '/user/:username',

		waitOn: function() {
			return Meteor.subscribe('avatars', this.params.username);
		},

		data: function() {
			return Meteor.users.findOne({ username: this.params.username });
		}
	});
});
