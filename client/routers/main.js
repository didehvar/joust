// Configuration for the router and some main routes.

Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function() {
  this.route('home', { path: '/' });
});
