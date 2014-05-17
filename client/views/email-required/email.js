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

  var email = trimmedElementValueById('email-required');
  if (!validateEmail(email)) {
    return alert.danger('Please enter a valid email', 'email-required');
  }

  // Check if email exists.
  Meteor.call('addEmailToUser', email, function(error, result) {
    if (error) {
      console.log(error);
      return alert.danger(error.reason || 'Unknown error', 'email-required');
    }

    alert.success('Email added to your account', {}, { close: true });
  });
};

Template.emailRequired.events({
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

Template.emailRequired.fields = function() {
  return [
    {
      fieldName: 'email-required',
      fieldLabel: 'Email',
      inputType: 'email'
    }
  ];
};
