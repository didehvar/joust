/**
 * Initialises sessions and middleware that uses sessions.
 * 
 * author: @didehvar
 * version: 0.0.1
 */

var mongoose = require('mongoose');
var session = require('express-session');
var mongo_session = require('connect-mongo')(session);
var flash = require('connect-flash');

module.exports = function(app) {
  app.use(require('cookie-parser')());

  app.use(session({
    store: new mongo_session({
      mongoose_connection: mongoose.connections[0]
    }),
    secret: process.env.JOUST_SESSION_KEY || 'keyboard cat',
    cookie: {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 // one day
    }
  }));

  app.use(flash());
};
