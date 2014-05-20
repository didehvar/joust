var checkAdmin = function(pause) {
  console.log(Meteor.userId());
  var isInRole = Roles.userIsInRole(Meteor.userId(), 'admin');
  console.log(isInRole);

  if (Meteor.userId() && isInRole) {
    return;
  }

  alert.danger('Please login');

  this.render('home');
  pause();
};

Router.onBeforeAction(checkAdmin, { only: [ 'admin' ] });

Router.map(function() {
  this.route('admin', {  path: '/admin' });
});
