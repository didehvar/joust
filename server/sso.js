// Method to validate a Discourse single sign on request and return
// an updated payload with the logged in users details.

Meteor.methods({
  // Takes a payload and a signature from Discourse SSO, validates them
  // and returns a query string in the form: sso=___&sig=___
  ssoValidate: function(payload, signature) {
    // Fail if user not logged in.
    if (!this.userId) {
      throw new Meteor.Error(401, 'Please login');
    }

    var crypto = Npm.require('crypto');
    var querystring = Npm.require('querystring');

    payload = querystring.unescape(payload);

    var hmac = crypto.createHmac('sha256', 'KA7HCMf0ugMs8T4&A9qs#xJx9');
    hmac.update(payload);

    if (hmac.digest('hex') !== signature) {
      console.log('hex not matching');
      throw new Meteor.Error(500, 'Payload not valid');
    }

    var decodedPayload = (new Buffer(payload, 'base64').toString('utf8')).
      split('nonce=');

    if (decodedPayload.length != 2) {
      console.log('no nonce');
      throw new Meteor.Error(500, 'Nonce not found')
    }

    var newPayload = new Buffer(querystring.stringify({
      'nonce': decodedPayload[1],
      'external_id': '0',
      'email': 'test@test.com',
      'username': 'ausername',
      'name': 'a real name'
    }), 'utf8').toString('base64');

    // Without recreating causes an error.
    var hmac = crypto.createHmac('sha256', 'KA7HCMf0ugMs8T4&A9qs#xJx9');
    hmac.update(newPayload);

    return querystring.stringify({
      'sso': newPayload,
      'sig': hmac.digest('hex')
    });
  }
});
