// Discourse single sign on endpoint.

var ssoReturn = function(error, result) {
  if (error) {
    var errors = Session.get('errors');
    errors.push(error.reason + '.');
    Session.set('errors', errors);

    return;
  }

  window.location.replace('http://discuss.ukgl.org/session/sso_login?' + result);
};

// Checks the URL for a SSO route complete with payload and signature.
var match = window.location.hash.match(/^#\/sso\?sso=(.*)$/);
if (match) {
  var queryParams = match[1].split('&sig=');

  // Only a length check, if they're empty then the auth will just fail.
  if (queryParams.length === 2) {
    Meteor.call('ssoValidate', queryParams[0], queryParams[1], ssoReturn);

    // If the user is logged in then the first call will redirect, otherwise
    // this will check for login and redirect when complete.
    Deps.autorun(function() {
      if (Meteor.userId()) {
        Meteor.call('ssoValidate', queryParams[0], queryParams[1], ssoReturn);
      }
    });
  }
}
