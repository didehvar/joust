var UsersController = Ember.ArrayController.extend({
  contentBinding: 'storage.cache.user'
});

module.exports = UsersController;
