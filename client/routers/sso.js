// Discourse single sign on endpoint.

var ssoReturn = function(error, result) {
  if (error) {
    return alert.sendDanger(error.reason);
  }

  window.location.replace(Meteor.settings.sso.url + '/session/sso_login?' + result);
};

// Checks the URL for a SSO route.
var match = window.location.hash.match(/^#\/sso\?sso=(.*)$/);
if (match) {
  var queryParams = match[1].split('&sig=');

  // Only a length check, if they're empty then the auth will just fail.
  if (queryParams.length === 2) {
    Deps.autorun(function(c) {
      if (!Meteor.userId()) {
        alert.sendWarning('Please sign in');
        return;
      }

      c.stop();
      Meteor.call('ssoValidate', queryParams[0], queryParams[1], ssoReturn);
    });
  }
}
