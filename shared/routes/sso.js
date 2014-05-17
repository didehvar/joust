// Discourse single sign on endpoint.

// Handles return from ssoValidate server method. Will redirect the client if
// the server reports no errors.
var ssoReturn = function(error, result) {
  if (error) {
    return alert.danger(error.reason);
  }

  window.location.replace(Meteor.settings.public.ssoUrl + '/session/sso_login?' +
    result);
};

// Checks the URL for a SSO route.
//var match = window.location.hash.match(/^#\/sso\?sso=(.*)$/);
//if (match) {
Router.map(function() {
  this.route('sso', {
    path: '/sso',
    action: function() {
      // Only a length check, if they're empty then the auth will just fail.
      if (!this.params.sso || !this.params.sig) {
        return;
      }

      // Can't use this. in deps.autorun ;)
      var sso = this.params.sso;
      var sig = this.params.sig;

      Deps.autorun(function(c) {
        if (!Meteor.userId()) {
          alert.warning('Please sign in');
          return;
        }

        c.stop();
        Meteor.call('ssoValidate', sso, sig, ssoReturn);
      });
    }
  });
});
