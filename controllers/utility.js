/**
 * Helper functions.
 *
 * @author  James Didehvar <justaelf@gmail.com>
 * @version 0.0.1
 */

/**
 * Determine whether an object is numeric.
 *
 * @param {Object} obj Any object.
 *
 * @return {Boolean} True if input is numeric, false otherwise.
 */
exports.isNumber = function(obj) {
  /** Praise be to the holy stack overflow overlords:
      http://stackoverflow.com/a/1303650 **/
  return !isNaN(obj - 0) && obj !== null && obj.replace(/^\s\s*/, '') !== '' &&
      obj !== false;
};
