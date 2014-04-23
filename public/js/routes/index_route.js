var IndexRoute = Ember.Route.extend({
  activate: function() {
    $(document).attr('title', 'Index');
  }
});

module.exports = IndexRoute;
