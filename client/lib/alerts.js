// Setup alert helpers. Used to display alerts to a user. They will appear
// just below the navigation but above all content.

alerts = new Meteor.Collection(null);

var sendAlert = function(message, style) {
  alerts.insert({ message: message + '.', style: style, seen: false });
}

alert = {
  sendSuccess: function(message) {
    sendAlert(message, 'alert-success');
  },
  sendInfo: function(message) {
    sendAlert(message, 'alert-info');
  },
  sendWarning: function(message) {
    sendAlert(message, 'alert-warning');
  },
  sendDanger: function(message) {
    sendAlert(message, 'alert-danger');
  },

  clearAll: function() {
    alerts.remove({});
  }
}
