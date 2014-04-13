var express = require('express');
var app = express();
var passport = require('passport');

// general utility modules
var path = require('path');

// database shtuff
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/joust');

// set environment
var env = process.env.NODE_ENV || 'development';

// use jade for views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// session setup
require('./helpers/session')(app);

// passport setup
require('./helpers/auth')(app);

// app routes
var routes = [
  ['/*', 'index#fix_www'],
  ['/', 'index#index'],
  ['/auth/steam/failed', 'index#auth_failed']
];

require('express-path')(app, routes);

module.exports = app;
