var Ajax = Ember.Mixin.create({
  ajax: function() {
    url = arguments[0];
    args = {};

    if (arguments.length === 2) {
      args = arguments[1];
    }

    return Ember.Deferred.promise(function(promise) {
      args.success = function(xhr) {
        Ember.run(promise, promise.resolve, xhr);
      };

      args.error = function(xhr) {
        Ember.run(promise, promise.reject, xhr);
      };

      if (!args.type) {
        args.type = 'GET';
      }

      if (!args.dataType && args.type.toUpperCase() === 'GET') {
        args.dataType = 'json';
      }

      $.ajax(url, args);
    });
  }
});

module.exports = Ajax;
