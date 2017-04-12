/* exported getCanonicalFullDate_,  getCanonicalShortDate_ */

/**
 * Extract number values from ISO date string (https://regex101.com/r/5Ysvdf/1)
 */
var DATE_VALUES_REGEX_ = new RegExp(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);

/**
 * Return date and time string
 * @param {Date} date Date
 * @returns {string} Date formated to YYYYMMDDTHHmmssZ
 */
function getCanonicalFullDate_(date) {
  var match = DATE_VALUES_REGEX_.exec(date.toISOString());
  return match[1] + match[2] + match[3] + 'T' + match[4] + match[5] + match[6] + 'Z';
}

/**
 * Return date string
 * @param {Date} date Date
 * @returns {string} Date formated to YYYYMMDD
 */
function getCanonicalShortDate_(date) {
  var match = DATE_VALUES_REGEX_.exec(date.toISOString());
  return match[1] + match[2] + match[3];
}
