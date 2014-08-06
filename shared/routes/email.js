// Require all logged in users to set emails before using the site.
Router.onBeforeAction(function(pause) {
  if (!Meteor.user() || Meteor.user().emails) {
    return;
  }

  this.render('addEmail');
  return pause();
});

Router.map(function() {
  this.route('addEmail', { path: '/email/new' });
});
