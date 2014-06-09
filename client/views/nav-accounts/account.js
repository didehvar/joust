// Clear all session values - reset the dropdown.
var clearAccountSessions = function() {
  Session.set('accountChangingPassword', false);
  Session.set('accountSigningUp', false);
  Session.set('accountForgotPassword', false);
  Session.set('accountChangingPassword', false);
};

// --- Alerts for dropdown --- //
// --------------------------- //

// Copy the alerts helper and change which alerts it displays.
Template.__copy__('navAccountsAlerts', 'alerts');
Template.navAccountsAlerts.helpers({
  alerts: function() {
    return alerts.find({ identifier: /account.*/i }).fetch();
  }
});

// --- Main account dropdown --- //
// ----------------------------- //

Template.navAccounts.rendered = function() {
  // We don't want the dropdown to close unless we tell it to!
  $('#account-dropdown').on('hide.bs.dropdown', function(event) {
    Session.set('accountDropdownVisible', false);
    return true;
  });
};

Template.navAccounts.events({
  // Show dropdown on click.
  'click #nav-accounts-dropdown': function(event) {
    // Toggling woggling.
    var visible = Session.get('accountDropdownVisible') || false;
    Session.set('accountDropdownVisible', !visible);

    // Clear anything that was set on close.
    if (!visible) {
      clearAccountSessions();
    }
  },

  // Prevent dropdown from closing when clicking elements.
  'click input, click .dropdown-menu, click button': function(event) {
    event.stopPropagation();
  },

  // Visit email menu.
  'click #nav-accounts-change-email': function() {
    Session.set('accountChangingEmail', true);
  },

  // Visit change password menu on click.
  'click #nav-accounts-change-password': function() {
    Session.set('accountChangingPassword', true);
  },

  // Sign out on click.
  'click #nav-accounts-sign-out': function() {
    Meteor.logout(function() {
      Session.set('accountDropdownVisible', false);
      clearAccountSessions();
    });
  }
});

Template.navAccounts.dropdownOpen = function() {
  return Session.get('accountDropdownVisible') || false;
}

Template.navAccounts.dropdownOpenClass = function() {
  return Session.get('accountDropdownVisible') ? 'open' : '';
}

Template.navAccounts.changingPassword = function() {
  return Session.get('accountChangingPassword');
};

Template.navAccounts.changingEmail = function() {
  return Session.get('accountChangingEmail');
}

Template.navAccounts.hasPassword = function() {
  // A bit hacky, but as far as I'm aware services don't set the username
  // property.
  return Meteor.user().hasOwnProperty('username');
}

// --- Change password --- //
// ----------------------- //

var changePassword = function() {
  // Clear all previous alerts.
  alert.clearAll('account-change-password');

  var oldPassword = elementValueById('change-password-old-password');

  var password = elementValueById('change-password-new-password');
  if (password.length === 0) {
    return alert.danger('Please enter a new password', 'account-change-password');
  }

  var confirmPassword = elementValueById('change-password-confirm-password');
  if (!confirmPassword || confirmPassword !== password) {
    return alert.danger("Passwords don't match", 'account-change-password');
  }

  Accounts.changePassword(oldPassword, password, function(error) {
    if (error) {
      // This error was really vague to me, so I made it better.
      if (error.reason === 'Match failed') {
        return alert.danger('Incorrect current password', 'account-change-password');
      }

      return alert.danger(error.reason || 'Unknown error', 'account-change-password');
    }

    Session.set('accountChangingPassword', false);
    alert.success('Password changed', 'account-change-password');

    // Wait and then remove all password change messages.
    Meteor.setTimeout(function() {
      alert.clearAll('account-change-password');
    }, 3000);
  });
};

// Attempts to change password if enter key is detected.
var enterChangePassword = function(event) {
  if (event.keyCode === 13) {
    changePassword();
  }
}

Template.navAccountsChangePassword.events({
  // Support for closing the change password form.
  'click #nav-accounts-change-password-close': function(event) {
    alert.clearAll('account-change-password');
    Session.set('accountChangingPassword', false);
  },

  // Change password on enter keypress.
  // These fields must reflect 'change-password-' fieldName.
  'keypress #change-password-old-password': enterChangePassword,
  'keypress #change-password-new-password': enterChangePassword,
  'keypress #change-password-confirm-password': enterChangePassword,

  // Support for submit click.
  'click #nav-accounts-change-password-do': function(event) {
    changePassword();
  }
});

Template.navAccountsChangePassword.fields = function() {
  return [
    {
      fieldName: 'change-password-old-password',
      fieldLabel: 'Current password',
      inputType: 'password'
    },
    {
      fieldName: 'change-password-new-password',
      fieldLabel: 'New password',
      inputType: 'password'
    },
    {
      fieldName: 'change-password-confirm-password',
      fieldLabel: 'Confirm new password',
      inputType: 'password'
    }
  ];
};

// --- Sign in services --- //
// ------------------------ //

var accountServices = function() {
  var services = Package['accounts-oauth'] ? Accounts.oauth.serviceNames() : [];
  services.sort();

  if (!!Package['accounts-password']) {
    services.push('password');
  }

  return _.map(services, function(name) {
    return { name: name };
  });
};

var signUp = function() {
  alert.clearAll('account-sign-up');

  var username = trimmedElementValueById('login-create-username');
  if (!username || username.length < 3) {
    return alert.danger('Username must be at least three characters long', 'account-sign-up');
  }

  var email = trimmedElementValueById('login-create-email');
  if (!email || !validateEmail(email)) {
    return alert.danger('Please enter a valid email', 'account-sign-up');
  }

  var password = elementValueById('login-password');
  if (password.length === 0) {
    return alert.danger('Please enter a password', 'account-sign-up');
  }

  var confirmPassword = elementValueById('login-create-confirm');
  if (confirmPassword !== password) {
    return alert.danger("Passwords don't match", 'account-sign-up');
  }

  var options = {};
  options.username = username;
  options.email = email;
  options.password = password;

  Accounts.createUser(options, function(error) {
    if (error) {
      return alert.danger(error.reason || 'Unknown error', 'account-sign-up');
    }

    Session.set('accountSigningUp', false);

    alert.success('Account created', 'account-sign-up');

    // Wait and then remove all related alerts.
    Meteor.setTimeout(function() {
      alert.clearAll('account-sign-up');
    }, 3000);
  })
};

var login = function() {
  // Clear all previous alerts.
  alert.clearAll('account-login');

  var usernameOrEmail = trimmedElementValueById('login-username-or-email');
  if (usernameOrEmail.length === 0) {
    return alert.danger('Please enter your username or email', 'account-login')
  }

  var password = elementValueById('login-password');
  if (password.length === 0) {
    return alert.danger('Please enter your password', 'account-login');
  }

  Meteor.loginWithPassword(usernameOrEmail, password, function(error) {
    if (error) {
      return alert.danger(error.reason || 'Unknown error', 'account-login');
    }

    alert.success('Sign in successful', 'account-login');

    // Wait and then remove all related alerts.
    Meteor.setTimeout(function() {
      alert.clearAll('account-login');
    }, 3000);
  });
};

var loginOrSignUp = function() {
  if (Session.get('accountSigningUp')) {
    return signUp();
  }

  login();
};

var enterLoginOrSignUp = function(event) {
  if (event.keyCode === 13) {
    loginOrSignUp();
  }
};

Template.navAccountsServicesPassword.events({
  'click #nav-accounts-login-do': function() {
    loginOrSignUp();
  },

  'click #nav-accounts-login-forgot': function() {
    alert.clearAll('account-login');
    Session.set('accountForgotPassword', true);
  },

  'click #nav-accounts-login-create': function() {
    Session.set('accountSigningUp', true);
  },

  'click #nav-accounts-create-close': function() {
    Session.set('accountSigningUp', false);
  },

  'keypress #login-username-or-email': enterLoginOrSignUp,
  'keypress #login-password': enterLoginOrSignUp,
  'keypress #login-create-username': enterLoginOrSignUp,
  'keypress #login-create-email': enterLoginOrSignUp,
  'keypress #login-create-confirm': enterLoginOrSignUp
});

Template.navAccountsServicesPassword.forgottenPassword = function() {
  return Session.get('accountForgotPassword');
};

Template.navAccountsServicesPassword.fields = function() {
  return [
  ];
};

Template.navAccountsServicesPassword.signInFields = function() {
  return [
    {
      fieldName: 'login-username-or-email',
      fieldLabel: 'Username or Email',
      inputType: 'text'
    },
    {
      fieldName: 'login-password',
      fieldLabel: 'Password',
      inputType: 'password'
    }
  ];
};

Template.navAccountsServicesPassword.signUpFields = function() {
  return [
    {
      fieldName: 'login-create-username',
      fieldLabel: 'Username',
      inputType: 'text'
    },
    {
      fieldName: 'login-create-email',
      fieldLabel: 'Email',
      inputType: 'email'
    },
    {
      fieldName: 'login-password',
      fieldLabel: 'Password',
      inputType: 'password'
    },
    {
      fieldName: 'login-create-confirm',
      fieldLabel: 'Confirm password',
      inputType: 'password'
    }
  ];
};

Template.navAccountsServicesPassword.signingUp = function() {
  return Session.get('accountSigningUp');
}

// --- Forgot password --- //
// ----------------------- //

var forgotPassword = function() {
  alert.clearAll('account-forgot');

  var email = trimmedElementValueById('forgot-password-email');
  if (email.indexOf('@') === -1) {
    return alert.danger('Invalid email', 'account-forgot');
  }

  Accounts.forgotPassword({ email: email }, function(error) {
    if (error) {
      return alert.danger(error.reason || 'Unknown error', 'account-forgot');
    }

    Session.set('accountForgotPassword', false);
    alert.success('Password reset email sent', 'account-forgot');

    // Wait and then remove all related alerts.
    Meteor.setTimeout(function() {
      alert.clearAll('account-forgot');
    }, 3000);
  })
};

Template.navAccountsForgotPassword.events({
  'click #nav-accounts-forgot-do': function() {
    forgotPassword();
  },

  'keypress #forgot-password-email': function(event) {
    if (event.keyCode === 13) {
      forgotPassword();
    }
  },

  'click #nav-accounts-forgot-close': function() {
    alert.clearAll('account-forgot');
    Session.set('accountForgotPassword', false);
  }
});

Template.navAccountsForgotPassword.fields = function() {
  return [
    {
      fieldName: 'forgot-password-email',
      fieldLabel: 'Email',
      inputType: 'text'
    }
  ];
};

// --- Services --- //
// ---------------- //

var configureService = function(name) {
  Session.set('accountServiceDialogVisible', true);
  Session.set('accountServiceDialogName', name);

  Meteor.setTimeout(function() {
    $('#nav-dialogs-configure-service').modal('show');
  }, 250);
};

Template.navAccountsServices.services = function() {
  return accountServices();
};

Template.navAccountsServices.passwordService = function() {
  return this.name === 'password';
};

Template.navAccountsServices.otherServices = function() {
  return accountServices().length > 1;
};

Template.navAccountsServicesOther.events({
  'click .nav-accounts-service': function() {
    alert.clearAll('account-service');
    var service = this.name;

    Meteor['loginWith' + capitalize(service)](
      {},
      function(error) {
        if (error instanceof Accounts.LoginCancelledError) {
          return;
        }

        if (error instanceof Accounts.ConfigError) {
          return configureService(service);
        }

        if (error) {
          return alert.danger(error.reason || 'Unknown error', 'account-service');
        }

        Session.set('accountDropdownVisible', false);
      }
    );
  }
});

Template.navAccountsServicesOther.configured = function() {
  return !!Accounts.loginServiceConfiguration.findOne({ service: this.name });
}

Template.navAccountsServicesOther.capitalizedName = function() {
  return capitalize(this.name);
}

Template.navAccountsServicesOther.isSteam = function() {
  return this.name === 'steam';
}
