#!/usr/bin/env node
if (!process.env.NODE_ENV) {
  process.env = require('./config');
}

if (!process.env.JOUST_STEAM_KEY) {
  throw new Error('Steam API key must be set');
}

var debug = require('debug')('joust');
var app = require('./app');

app.set('port', process.env.PORT || 8111);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
