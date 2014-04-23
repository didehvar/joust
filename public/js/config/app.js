var App = {};

// not sure if this is right - probably isn't!
App.Ajax = require('../mixins/ajax');

App = Ember.Application.createWithMixins(App.Ajax, {
  LOG_ACTIVE_GENERATION: true,
  LOG_VIEW_LOOKUPS: true
});

module.exports = App;
