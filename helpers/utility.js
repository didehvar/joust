// returns true if obj is a number
exports.number = function(obj) {
  // praise be to the holy stack overflow lords
  // http://stackoverflow.com/questions/1303646/check-whether-variable-is-number-or-string-in-javascript
  return !isNaN(obj - 0) && obj !== null && obj.replace(/^\s\s*/, '') !== '' && obj !== false;
};
