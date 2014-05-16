Template.alerts.helpers({
  alerts: function() {
    return alerts.find({ identifier: 'general' }).fetch();
  }
});
