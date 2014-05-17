// Clear all alerts when a route changes.
Router.onBeforeAction(function() {
  alert.clearAll();
});
