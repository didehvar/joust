if (Meteor.isClient) {
  Meteor.startup(function() {
    Session.set('errors', []);
  });

  Template.hello.greeting = function () {
    return "Welcome to joust.";
  };

  Template.hello.events({
    'click input': function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

  Template.error.helpers({
    errors: function() {
      return Session.get('errors');
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
