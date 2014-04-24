var express = require('express');
var app = express();

// general utility modules
var path = require('path');

// database shtuff
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/joust');

// set environment
var env = process.env.NODE_ENV || 'development';

// generates test data
if (env === 'development') {
  require('./test_data')();
}

// compile less files
app.use(require('less-middleware')(path.join(__dirname, 'assets', 'less'), {
  dest: path.join(__dirname, 'public'),
  force: env === 'development' ? true : false,
  preprocess: {
    path: function(pathname, req) {
      return pathname.replace('/css', '');
    }
  }
}, {
  paths: [
    path.join(path.join(__dirname, 'public', 'bower_components', 'bootstrap', 'less')),
    path.join(path.join(__dirname, 'public', 'bower_components', 'fontawesome', 'less'))
  ]
}, {
  compress: true
}));

// use static public directory
app.use(express.static(path.join(__dirname, 'public')));

// use jade for views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// session setup
require('./helpers/session')(app);

// passport setup
require('./helpers/auth')(app);

// needed to parse post requests
app.use(require('body-parser')());

// helper functions available in templates
app.locals.basedir = path.join(__dirname, 'views');
app.locals.inflection = require('inflection');

// variables accessible in views
app.use(function(req, res, next) {
  res.locals.url = req.url;
  res.locals.flash = req.flash();

  res.locals.user = req.user;
  res.locals.has_permission = function(user_id, permission_name) {
    if (!user_id || !permission_name) {
      return false;
    }

    require('./models/user_permission')
      .findOne({ user: user_id })
      .exec(function(err, user) {
        if (err) {
          return next(new Error("Couldn't select permission for user: " + err));
        }

        console.log('abc');

        if (!user) {
          return false;
        }

        console.log('Found user: ' + user);
        //console.log('Found user permission: ' + user.permissions);
      });
  };

  next();
});
      /*.populate({
        path: 'permissions',
        match: { name: permission_name },
        select: ''
      })*/

// app routes
require('express-path')(app, [
  ['/*', 'index#fix_www'],
  ['/', 'index#index'],

  /* authentication */
  ['/auth/steam/failed', 'user#auth_failed'],
  ['/login', 'user#login'],
  ['/logout', 'user#logout'],

  /* user management */
  ['/users', 'user#find_all', 'get'],
  ['/users', 'user#create', 'post'],
  ['/users/:id', 'user#find', 'get'],
  ['/users/:id', 'user#update', 'put'],
  ['/users/:id', 'user#delete', 'delete']
]);

// 404 handler
app.use(function(req, res, next) {
  res.status(404);

  if (req.accepts('html')) {
    res.render('error', { message: 'Page not found', url: req.url });
    return;
  }

  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  res.type('txt').send('Not found');
});

// error handler
app.use(function(err, req, res, next) {
  res.status(500);

  console.log('Throwing error: ' + err);

  if (req.accepts('html')) {
    res.render('error', { error: err });
    return;
  }

  if (req.accepts('json')) {
    res.send({ error: err });
    return;
  }

  res.type('txt').send(err);
});

module.exports = app;
