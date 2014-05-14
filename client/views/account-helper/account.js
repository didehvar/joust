Template.accountHelper.changingPassword = function() {
  return Session.get('changingPassword');
};

Template.accountHelperChangePassword.fields = function() {
  return [
    {
      fieldName: 'old-password',
      fieldLabel: 'Current Password',
      inputType: 'password'
    },
    {
      fieldName: 'new-password',
      fieldLabel: 'New Password',
      inputType: 'password'
    },
    {
      fieldName: 'confirm-password',
      fieldLabel: 'Confirm New Password',
      inputType: 'password'
    }
  ];
};
