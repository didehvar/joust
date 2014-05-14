if (Meteor.isClient) {
  Router.configure({
    layoutTemplate: 'layout'
  });

  Router.map(function() {
    this.route('hello', { path: '/' });
  });

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
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
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
