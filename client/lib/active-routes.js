// Helper classes to determine the currently active route.
// For example: used by navigation to determine which page to add the 'active'
// class to.

// Called using {{activeRoute 'route'}}
UI.registerHelper('activeRoute', function(route) {
  var current = Router.current();
  return (current && current.route.name === route) ? 'active' : '';
});
