/**
 * Manages asset compilation.
 *
 * @author  James Didehvar <justaelf@gmail.com>
 * @version 0.0.1
 */

var lessMiddleware = require('less-middleware');
var path = require('path');

module.exports = function(app) {
  app.use(lessMiddleware(path.join(__dirname, '..', 'assets', 'less'), {
    dest: path.join(__dirname, '..', 'public'),
    force: process.env.NODE_ENV === 'development' ? true : false,
    preprocess: {
      path: function(pathname, req) {
        return pathname.replace('\\css', '');
      }
    }
  }, {
    paths: [
    path.join(path.join(__dirname, '..', 'public', 'bower_components',
      'bootstrap', 'less')),
    path.join(path.join(__dirname, '..', 'public', 'bower_components',
      'fontawesome', 'less'))
    ]
  }, {
    compress: true
  }));
};
