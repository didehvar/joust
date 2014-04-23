var ApplicationRoute = Ember.Route.extend({
  actions: {
    error: function() {
      this.transitionTo('catchall', 'error');
    }
  }
});

module.exports = ApplicationRoute;
