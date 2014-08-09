Meteor.startup(function() {
  process.env.MAIL_URL = Meteor.settings.smtpMailUrl;
});

Meteor.methods({
  addEmailToUser: function(email) {
    if (!this.userId) {
      throw new Meteor.Error(401, 'Must be logged in');
    }

    if (Meteor.user().emails.length >= Meteor.settings.public.accountMaxEmails) {
      throw new Meteor.Error(500, 'Maximum emails for account exceeded');
    }

    if (Meteor.users.find({ 'emails.address': email }).count() > 0) {
      throw new Meteor.Error(500, 'Email is already in use');
    }

    Meteor.users.update(this.userId, {
      $addToSet: {
        "emails": {
          address: email,
          verified: false
        }
      }
    }, {}, function(error, results) {
      if (error) {
        throw new Meteor.Error(error.error || 500, error.reason || 'Unknown error');
      }

      Accounts.sendVerificationEmail(Meteor.user()._id, email);

      return true;
    });
  },

  confirmUniEmail: function() {
    if (!this.userId) {
      throw new Meteor.Error(401, 'Please login');
    }

    var user = Meteor.user();

    _.each(user.emails, function(element) {
      if (element.address.substr(element.address.length - 6) === '.ac.uk') {
        return true
      }
    });

    return false;
  },

  sendVerificationEmail: function(email) {
    if (!this.userId) {
      throw new Meteor.Error(401, 'Please login');
    }

    var user = Meteor.user();

    if (!_.findWhere(user.emails, { address: email })) {
      throw new Meteor.Error(500, 'Email not attached to this account');
    }

    Accounts.sendVerificationEmail(user._id, email);
    return true;
  }
});
