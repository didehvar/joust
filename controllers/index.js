/**
 * Index and helper routes.
 *
 * @author  James Didehvar <justaelf@gmail.com>
 * @version 0.0.1
 */

/** http://www.hello.com -> http://hello.com. */
exports.www = function(req, res, next) {
  if (req.headers.host.match(/^www\./)) {
    return res.redirect(req.protocol + '://' + req.get('host') +
        req.originalUrl, 301);
  }

  next();
};

/** Main site page. */
exports.index = function(req, res) {
  res.render('index', {
    title: 'Home'
  });
};

/** Used for routes that don't execute, for example when using middle-ware. */
exports.empty = function() {};
