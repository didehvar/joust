// Configuration for the router and some main routes.

Router.configure({
  layoutTemplate: 'layout',
  after: function() {
    document.title = 'joust';
    $('head').append('<meta charset="utf-8">');
    $('head').append('<meta http-equiv="X-UA-Compatible" content="IE=edge">');
    $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1">');
  }
});

Router.map(function() {
  this.route('home', { path: '/' });
});
