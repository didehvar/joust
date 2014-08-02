Router.map(function() {
	this.route('userProfile', {
		path: '/user/:username',

		waitOn: function() {
			return [
				Meteor.subscribe('avatar', this.params.username),
				Meteor.subscribe('username', this.params.username)
			];
		},

		data: function() {
			return Meteor.users.findOne({ username: this.params.username });
		}
	});
});
