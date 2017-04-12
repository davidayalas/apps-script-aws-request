/* exported getCanonicalQueryString_ */

/**
 * Returns canonical query string
 * @param {object} query Query key-value object
 * @returns {string} Canonical query string
 */
function getCanonicalQueryString_(query) {
  var key;
  var queryParts = [];

  for (key in query) {
    if (!query.hasOwnProperty(key)) continue;
    queryParts.push([key, query[key]]);
  }

  return queryParts
    .map(function (part) {
      var value = part[1] != null ? part[1] : '';
      return encodeURIComponent(part[0].trim()) + '=' + encodeURIComponent(value);
    })
    .sort(function (a, b) {
      if (a === b) return 0;
      return (a > b) ? 1 : -1;
    })
    .join('&');
}
