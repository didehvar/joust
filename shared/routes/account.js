Router.map(function() {
	this.route('verifyEmail', {
		path: '/verify-email/:token',

		action: function() {
			Accounts.verifyEmail(this.params.token, function() {
				Router.go('/');
			});
		}
	});
});
