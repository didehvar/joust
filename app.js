/**
 * Joust is a tournament management website.
 *
 * @author  James Didehvar <justaelf@gmail.com>
 * @version 0.0.1
 */

var express = require('express');
var path = require('path');

var app = express();

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}
var env = process.env.NODE_ENV;

// Initialise the database connection.
require('./controllers/database')();

// Compile less files from assets/less/ to public/css.
require('./controllers/asset')(app);

if (env === 'development') {
  // Wait for other operations before generating test data.
  setTimeout(function() {
    require('./test_data')();
  }, 2000);
}

app.use(express.static(path.join(__dirname, 'public')));

// Use Jade for views.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

require('./helpers/session')(app);
require('./controllers/auth').passport(app);

// Allows use of POST requests.
app.use(require('body-parser')());

// Pass data to views.
app.locals.basedir = path.join(__dirname, 'views');
app.locals.inflection = require('inflection');

app.use(function(req, res, next) {
  res.locals.url = req.url;
  res.locals.flash = req.flash();
  res.locals.user = req.user;
  res.locals.Permission = require('./helpers/permission').permissions;

  next();
});

// Set up routes.
require('express-path')(app, [
  ['/*',  'index#www'   ],
  ['/',   'index#index' ],

  /* authentication */
  ['/auth',         'index#empty',      'auth#passportReturn',  'get' ],
  ['/auth/failed',  'auth#authFailed',                          'get' ],
  ['/login',        'auth#login'                                      ],
  ['/logout',       'auth#logout'                                     ],

  /* user management */
  ['/users',      'user#findAll',   'get'     ],
  ['/users/:id',  'user#find',      'get'     ],
  ['/users/:id',  'user#update',    'put'     ],
  ['/users/:id',  'user#delete',    'delete'  ]
]);

// Handle 404s.
app.use(function(req, res, next) {
  res.status(404);

  if (req.accepts('html')) {
    return res.render('error', {
      message: 'Page not found',
      url: req.url
    });
  }

  if (req.accepts('json')) {
    return res.send({
      error: 'Not found'
    });
  }

  res.type('txt').send('Not found');
});

// Handle errors.
app.use(function(err, req, res, next) {
  res.status(500);

  console.log('Throwing error: ' + err);

  if (req.accepts('html')) {
    return res.render('error', {
      error: err
    });
  }

  if (req.accepts('json')) {
    return res.send({
      error: err
    });
  }

  res.type('txt').send(err);
});

module.exports = app;
