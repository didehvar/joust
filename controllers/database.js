/**
 * Creates and helps manages the database connection.
 *
 * @author  James Didehvar <justaelf@gmail.com>
 * @version 0.0.1
 */

var mongoose = require('mongoose');
var permission = require('../controllers/permission');

module.exports = function() {
  mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/joust');

  mongoose.connection.on('open', function() {
    mongoose.connection.db.collectionNames('permissions', function(err, names) {
      if (err) {
        return console.log(new Error('Failed to find permissions: ' + err));
      }

      if (names.length < 1) {
        return permission.create();
      }

      permission.load();
    });
  });
};
