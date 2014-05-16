
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
