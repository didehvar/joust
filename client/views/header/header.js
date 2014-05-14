Template.header.events({
  'click #login-change-password': function() {
    Session.set('changingPassword', true);
  }
});
