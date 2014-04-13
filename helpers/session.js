var mongoose = require('mongoose');
var session = require('express-session');
var mongo_session = require('connect-mongo')(session);

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
};
