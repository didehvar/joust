// Copy alerts.
Template.__copy__('emailRequiredAlerts', 'alerts');
Template.emailRequiredAlerts.alerts = function() {
  return alerts.find({ identifier: 'email-required' }).fetch();
}

var addEmail = function() {
  alert.clearAll('email-required');

  if (!Meteor.user()) {
    return alert.danger('Must be logged in to add an email', 'email-required');
  }

  if (Meteor.user().emails.length >= Meteor.settings.public.accountMaxEmails) {
    return alert.danger('An account can only be assigned a maximum of three emails', 'email-required');
  }

  var email = trimmedElementValueById('email-required');
  if (!validateEmail(email)) {
    return alert.danger('Please enter a valid email', 'email-required');
  }

  // Check that this is a university email if we're trying to add a university
  // email.
  if (Session.get('addUniEmail') && email.substr(email.length - 6) !== '.ac.uk') {
    return alert.danger('A university email must end in .ac.uk', 'email-required');
  }

  // Check if email exists.
  Meteor.call('addEmailToUser', email, function(error, result) {
    if (error) {
      console.log(error);
      return alert.danger(error.reason || 'Unknown error', 'email-required');
    }

    Session.set('uniEmailConfirmed', true);
    Router.go('news');
    alert.success('Email added to your account');
  });
};

Template.addEmail.rendered = function() {
  $('#email-required').focus();
}

Template.addEmail.events({
  'click #email-required-do': function(event) {
    event.stopPropagation();

    addEmail();
    return false;
  },

  'keypress #email-required': function(event) {
    event.stopPropagation();

    if (event.keyCode === 13) {
      addEmail();
      return false;
    }
  }
});

Template.addEmail.fields = function() {
  return [
    {
      fieldName: 'email-required',
      fieldLabel: 'Email',
      inputType: 'email'
    }
  ];
};

Template.addEmail.addEmailDescription = function() {
  return Session.get('addEmailDescription');
}
