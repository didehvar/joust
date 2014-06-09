// Setup alert helpers. Used to display alerts to a user. They will appear
// just below the navigation but above all content.

alerts = new Meteor.Collection(null);

var sendAlert = function(message, style, identifier, options) {
  var msg = message;

  // Add full stop to end of message if not present.
  if (msg.indexOf('.', msg.length - 1) === -1) {
    msg = msg + '.';
  }

  if (alerts.find({ message: msg }).count() === 0) {
    alerts.insert({
      // Alert body.
      message: msg,

      // Added to alert class.
      style: style,

      // Used for fetching different types of alerts.
      identifier: identifier || 'general',

      // General options:
      //   'spinner': true  - adds a fontawesome spinner before message.
      //   'close': true    - adds close icon.
      //   'warning': true  - adds a fontawesome warning icon.
      options: options || {},
    });
  }
}

alert = {
  success: function(message, identifier, options) {
    sendAlert(message, 'alert-success', identifier, options);
  },
  info: function(message, identifier, options) {
    sendAlert(message, 'alert-info', identifier, options);
  },
  warning: function(message, identifier, options) {
    sendAlert(message, 'alert-warning', identifier, options);
  },
  danger: function(message, identifier, options) {
    sendAlert(message, 'alert-danger', identifier, options);
  },

  clear: function(message) {
    alerts.remove({ message: message + '.' });
  },

  // Remove all alerts with a matching identifier.
  // Specify no identifier to clear all alerts.
  clearAll: function(identifier) {
    if (identifier) {
      alerts.remove({ identifier: identifier });
      return;
    }

    alerts.remove({});
  }
}
