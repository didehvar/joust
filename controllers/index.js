/**
 * Index and helper routes.
 *
 * @author  James Didehvar <justaelf@gmail.com>
 * @version 0.0.1
 */

/** http://www.hello.com -> http://hello.com. */
exports.fix_www = function(req, res, next) {
  if (req.headers.host.match(/^www\./)) {
    return res.redirect(req.protocol + '://' + req.headers.host.slice(4) +
      req.url, 301);
  }

  next();
};

/** Main site page. */
exports.index = function(req, res) {
  res.render('index', {
    title: 'Home'
  });
};
