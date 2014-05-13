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
  }
}

Template.alerts.helpers({
  alerts: function() {
    return alerts.find().fetch();
  }
});
