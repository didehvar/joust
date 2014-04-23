var IndexRoute = Ember.Route.extend({
  beforeModel: function(transition) {
    this.transitionTo('users');
  }
});

module.exports = IndexRoute;
