// Require all logged in users to set emails before using the site.
Router.onBeforeAction(function(pause) {
  if (!Meteor.user() || Meteor.user().emails) {
    return;
  }

  this.render('emailRequired');
  return pause();
});
