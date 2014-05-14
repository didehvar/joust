// Discourse single sign on endpoint.

// Handles return from ssoValidate server method. Will redirect the client if
// the server reports no errors.
var ssoReturn = function(error, result) {
  if (error) {
    return alert.sendDanger(error.reason);
  }

  window.location.replace(Meteor.settings.sso.url + '/session/sso_login?' +
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
        Deps.autorun(function(c) {
          if (!Meteor.userId()) {
            alert.sendWarning('Please sign in');
            return;
          }

          c.stop();
          Meteor.call('ssoValidate', this.params.sso, this.params.sig, ssoReturn);
        });
      }
    }
  });
});
