exports.number = function(num) {
  // praise be to the holy stack overflow lords
  // http://stackoverflow.com/questions/1303646/check-whether-variable-is-number-or-string-in-javascript
  return !isNaN(num - 0) && num !== null && num.replace(/^\s\s*/, '') !== '' && num !== false;
}