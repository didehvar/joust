/**
 * Index and helper routes.
 *
 * @author  James Didehvar <justaelf@gmail.com>
 * @version 0.0.1
 */

/** Removes www. from the URL if set. */
exports.fix_www = function(req, res, next) {
  if (req.headers.host.match(/^www\./) !== null) {
    res.redirect('http://' + req.headers.host.slice(4) + req.url, 301);
  } else {
    next();
  }
};

/** Main site page. */
exports.index = function(req, res) {
  res.render('index', {
    title: 'Home'
  });
};
