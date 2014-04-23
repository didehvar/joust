var App = require('./app');

App.Router.map(function() {
  /*this.resource("users", { path: '/users' }, function() {
    console.log("Inside users");
    this.route("new", { path: "/new" });
    this.route("edit", { path: "/:user_id" });
  });*/
  
  this.route("users");

  this.route('catchall', { path: '/*wildcard' });
});

App.Router.reopen({
  location: 'history'
});
