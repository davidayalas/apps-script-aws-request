/* global CryptoJs_ */
/* exported calculateSignature_ */

/**
 * Returns signature for request
 * http://docs.aws.amazon.com/general/latest/gr/signature-v4-examples.html
 * @param {string} key Your secret access key
 * @param {string} dateStamp Date in YYYYMMDD format
 * @param {string} regionName AWS region (e.g. 'us-east-1')
 * @param {string} serviceName AWS service name (e.g. 'ec2', 'iam', 'codecommit')
 * @param {string} stringToSign String to sign
 * @returns {string} Signed string
 */
function calculateSignature_ (key, dateStamp, regionName, serviceName, stringToSign) {
  var HMAC = CryptoJs_.HMAC;
  var SHA256 = CryptoJs_.SHA256;

  var kDate = HMAC(SHA256, dateStamp, 'AWS4' + key, { asBytes: true });
  var kRegion = HMAC(SHA256, regionName, kDate, { asBytes: true });
  var kService = HMAC(SHA256, serviceName, kRegion, { asBytes: true });
  var kSigning = HMAC(SHA256, 'aws4_request', kService, { asBytes: true });

  return HMAC(SHA256, stringToSign, kSigning, { asBytes: false });
}
