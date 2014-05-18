capitalize = function(str) {
  var temp = str == null ? '' : String(str);
  return str.charAt(0).toUpperCase() + str.slice(1);
}

validateEmail = function(email) {
  var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regex.test(email)) {
    return false;
  }

  return true;
}

trim = function(str) {
  return str.replace(/^\s*|\s*$/g, '');
}
