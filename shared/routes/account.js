Router.map(function() {
	this.route('accountVerifyEmail', {
		path: '/account/verify-email/:token',

		action: function() {
			Accounts.verifyEmail(this.params.token, function() {
				Router.go('/');
			});
		}
	});

	this.route('accountResetPassword', {
		path: '/account/reset-password/:token',
		template: 'news',

		onBeforeAction: function() {
			Session.set('accountDropdownVisible', true);
			Session.set('accountNewPassword', true);
		},

		onStop: function() {
			if (!Session.get('accountNewPasswordValue')) {
				return;
			}

			Accounts.resetPassword(this.params.token, Session.get('accountNewPasswordValue'), function() {
				alert.success('Password changed', 'account', { close: true });
			});
		}
	});
});
