/* global CryptoJs_ */
/* exported getCanonicalRequestHash_ */

/**
 * Returns hashed canonical request
 * @param {string} method HTTP method
 * @param {string} path Request path
 * @param {object} headers Request headers
 * @param {string} queryString Request query string
 * @param {string} payloadString Request payload as string
 * @returns {{
     hashedCanonicalRequest: string,
     signedHeaders: string
   }} hashed canonical request and signed headers
 */
function getCanonicalRequestHash_(method, path, headers, queryString, payloadString) {
  var canonicalHeaders = [];
  var signedHeaders = [];
  Object.keys(headers)
    .map(function (key) { return [key, headers[key]]; })
    .map(function (header) {
      return [header[0].trim().toLowerCase(), header[1].trim().replace(/\s{2,}/g, ' ')];
    })
    .sort(function (a, b) {
      if (a[0] === b[0]) return 0;
      else return (a[0] > b[0]) ? 1 : -1;
    })
    .forEach(function (header) {
      canonicalHeaders.push(header[0] + ':' + header[1] + '\n');
      signedHeaders.push(header[0]);
    });

  var canonicalHeadersStr = canonicalHeaders.join('');
  var signedHeadersStr = signedHeaders.join(';');

  var canonicalRequest = [
    method,
    path.toLowerCase(),
    queryString,
    canonicalHeadersStr,
    signedHeadersStr,
    CryptoJs_.SHA256(payloadString)
  ].join('\n');

  return {
    hashedCanonicalRequest: CryptoJs_.SHA256(canonicalRequest),
    signedHeaders: signedHeadersStr
  };
}
