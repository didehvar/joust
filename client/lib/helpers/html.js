// Find a HTML elements value by an id.
elementValueById = function(id) {
  var element = document.getElementById(id);
  if (!element) {
    return null;
  }

  return element.value;
};

// Find and trim a HTML elements value by an id.
trimmedElementValueById = function(id) {
  var element = document.getElementById(id);
  if (!element) {
    return null;
  }

  return element.value.replace(/^\s*|\s*$/g, '');
};
