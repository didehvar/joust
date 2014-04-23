/**
 * Generic helper/default routes that aren't worthy of their own file.
 * Please extract as you see fit.
 * 
 * author: @didehvar
 * version: 0.0.1
 */

// redirects to remove www.
exports.fix_www = function(req, res, next) {
  if (req.headers.host.match(/^www\./) !== null) {
    res.redirect('http://' + req.headers.host.slice(4) + req.url, 301);
  } else {
    next();
  }
};

exports.ember = function(req, res) {
  res.sendfile('./public/index.html');
};

// generic error route for authentication failure
exports.auth_failed = function(req, res) {
  res.render('error', { title: 'Steam auth failed' });
};
