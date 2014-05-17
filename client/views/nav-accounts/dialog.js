
// --- Alerts --- //
// -------------- //

Template.navDialogsAlerts.helpers({
  alerts: function() {
    return alerts.find({ identifier: /account-dialog.*/i }).fetch();
  }
});

// --- Forgot password reset token --- //
// ----------------------------------- //

if (Accounts._resetPasswordToken) {
  Session.set('accountResetPasswordToken', Accounts._resetPasswordToken);
}

Template.navDialogsResetPassword.resettingPassword = function() {
  return Session.get('accountResetPasswordToken');
}

Template.navDialogsResetPassword.rendered = function() {
  var $modal = $(this.find('#nav-dialogs-reset-password'));
  $modal.modal();
}

Template.navDialogsResetPassword.events({
  'click #reset-password-do': function() {
    resetPassword();
  },

  'keypress #reset-password-new-password': function(event) {
    if (event.keyCode === 13) {
      resetPassword();
    }
  },

  'click #reset-password-close': function() {
    Session.set('accountResetPasswordToken', null);
    Accounts._enableAutoLogin();
    $('#nav-dialogs-reset-password').modal('hide');
  }
});

var resetPassword = function() {
  alert.clearAll('account-dialog-reset-password');

  var password = elementValueById('reset-password-new-password');
  if (password.length === 0) {
    return alert.danger('Please enter a password', 'account-dialog-reeset-password');
  }

  Accounts.resetPassword(
    Session.get('accountResetPasswordToken'),
    password,
    function(error) {
      if (error) {
        return alert.danger(error.reason || 'Unknown error', 'account-dialog-reeset-password');
      }

      Session.set('accountResetPasswordToken', null);
      alert.success('Your password has been changed', 'general', { close: true });

      Accounts._enableAutoLogin();
      $('#nav-dialogs-reset-password').modal('hide');

      // Remove success alert after waiting.
      Meteor.setTimeout(function() {
        alert.clear('Your password has been changed');
      }, 3000);
    }
  )
}

// --- Service configuration --- //
// ----------------------------- //

var configureLoginServiceDialogTemplateForService = function() {
  var service = Session.get('accountServiceDialogName');
  return Template['configureLoginServiceDialogFor' + capitalize(service)];
};

var configurationFields = function() {
  var template = configureLoginServiceDialogTemplateForService();
  return template.fields();
};

Template.navDialogsConfigureService.events({
  'click #configure-service-close': function() {
    Session.set('accountServiceDialogVisible', false);
  },

  'click #configure-service-do': function() {
    if (!Session.get('accountServiceDialogVisible')) {
      return;
    }

    var service = Session.get('accountServiceDialogName');
    var configuration = {
      service: service
    };

    _.each(configurationFields(), function(field) {
      configuration[field.property] = trimmedElementValueById('configure-service-' + field.property);
    });

    Meteor.call('configureLoginService', configuration, function(error, result) {
      if (error) {
        return Meteor._debug('Error configuring login service ' + service, error);
      }

      Session.set('accountServiceDialogVisible', false);
      $('#nav-dialogs-configure-service').modal('hide');
    });
  }
});

Template.navDialogsConfigureService.configurationFields = function() {
  return configurationFields();
}

Template.navDialogsConfigureService.visible = function() {
  return Session.get('accountServiceDialogVisible');
}

Template.navDialogsConfigureService.configurationSteps = function() {
  return configureLoginServiceDialogTemplateForService();
}
