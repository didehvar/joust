require('../../bower_components/jquery/dist/jquery');

require('../../bower_components/handlebars/handlebars');
require('../../bower_components/ember/ember');
require('../../bower_components/ember-data/ember-data');

require('../../bower_components/ember-addons.bs_for_ember/dist/js/bs-core.max');
require('../../bower_components/ember-addons.bs_for_ember/dist/js/bs-alert.max');

var App = Ember.Application.create();
App.Store = require('./store'); // delete if you don't want ember-data

module.exports = App;

