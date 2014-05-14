// Dynamically load stylesheets from CDNs.

var head = document.getElementsByTagName('head')[0];

var loadCss = function(filename) {
  var style = document.createElement('link');
  style.rel = 'stylesheet';
  style.type = 'text/css';
  style.href = filename;

  head.appendChild(style);
}

loadCss('//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css');
