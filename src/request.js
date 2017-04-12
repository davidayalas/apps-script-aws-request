/* global getCanonicalFullDate_, getCanonicalShortDate_, getCanonicalQueryString_,
          calculateSignature_, getCanonicalRequestHash_, UrlFetchApp */

/* exported request */

/**
 * AWS hash algorithm name
 */
var HASH_ALGORITHM_ = 'AWS4-HMAC-SHA256';

var AWS_SINGLE_ENDPOINT_ = {
  'cloudfront': 'cloudfront.amazonaws.com',
  'health': 'health.us-east-1.amazonaws.com',
  'iam': 'iam.amazonaws.com',
  'importexport': 'importexport.amazonaws.com',
  'shield': 'shield.us-east-1.amazonaws.com',
  'waf': 'waf.amazonaws.com'
};

var getCurrentDate_ = function () {
  return new Date();
};

/**
 * Authenticates and sends the given parameters for an AWS api request.
 * @param {{
     accessKey: string,
     secretKey: string,
     service: string,
     region: string,
     path: string,
     query: object,
     method: string,
     headers: object,
     payload: (string|object),
   }} params **The AWS service request parameters**
   - `accessKey` - AWS access key
   - `secretKey` - AWS secret key key
   - `service` - the aws service to connect to (e.g. 'ec2', 'iam', 'codecommit')
   - `region` - (optional) the aws region your command will go to. Defaults to 'us-east-1'.
   - `path` - (optional) the path to api function (without query). Defaults to '/'.
   - `query` - (optional) the query string parameters
   - `method` - (optional) the http method (e.g. 'GET', 'POST'). Defaults to GET.
   - `headers` - (optional) the headers to attach to the request. Host and X-Amz-Date are premade
   for you.
   - `payload` - (optional) the payload to send. Defaults to ''.
 * @returns {HTTPResponse} HTTPResponse object
 */
function request(params) {
  var temp;

  if (params.accessKey == null) {
    throw new Error('Access key undefined');
  } else if (params.secretKey == null) {
    throw new Error('Secret key undefined');
  } else if (params.service == null) {
    throw new Error('Service undefined');
  }

  var accessKey = params.accessKey;
  var secretKey = params.secretKey;
  var service = params.service.toLowerCase();
  var region = params.region ? params.region.toLowerCase() : 'us-east-1';
  var path = params.path || '/';
  var query = params.query || {};
  var method = (params.method || 'GET').toUpperCase();
  var headers = params.headers || {};
  var payload = params.payload || '';

  var host = AWS_SINGLE_ENDPOINT_[service]
    ? AWS_SINGLE_ENDPOINT_[service]
    : service + '.' + region + '.amazonaws.com';

  if (path.substring(0, 1) !== '/') {
    path = '/' + path;
  }

  var payloadString = '';
  if (typeof payload !== 'string') {
    payloadString = JSON.stringify(payload);
  }

  var curDate = getCurrentDate_();
  var dateStringFull = getCanonicalFullDate_(curDate); // 20150830T123600Z
  var dateStringShort = getCanonicalShortDate_(curDate); // 20150830
  var queryString = getCanonicalQueryString_(query);

  headers['Host'] = host;
  headers['X-Amz-Date'] = dateStringFull;

  // Task 1: Create a Canonical Request for Signature
  // http://docs.aws.amazon.com/general/latest/gr/sigv4-create-canonical-request.html

  temp = getCanonicalRequestHash_(method, path, headers, queryString, payloadString);
  var hashedCanonicalRequest = temp.hashedCanonicalRequest;
  var signedHeaders = temp.signedHeaders;

  // Task 2: Create a String to Sign for Signature
  // http://docs.aws.amazon.com/general/latest/gr/sigv4-create-string-to-sign.html

  var credentialScope = dateStringShort + '/' + region + '/' + service + '/aws4_request';

  var stringToSign = [
    HASH_ALGORITHM_,
    dateStringFull,
    credentialScope,
    hashedCanonicalRequest
  ].join('\n');

  // Task 3: Calculate the Signature
  // http://docs.aws.amazon.com/general/latest/gr/sigv4-calculate-signature.html

  var signature = calculateSignature_(secretKey, dateStringShort, region, service, stringToSign);

  // Task 4: Add the Signing Information to the Request
  // http://docs.aws.amazon.com/general/latest/gr/sigv4-add-signature-to-request.html

  headers['Authorization'] = [
    HASH_ALGORITHM_ + ' Credential=' + accessKey + '/' + credentialScope,
    'SignedHeaders=' + signedHeaders,
    'Signature=' + signature
  ].join(', ');

  // Sending request

  delete headers['Host'];  // fetch will add Host header
  var fetchOptions = {
    method: method,
    headers: headers,
    muteHttpExceptions: true,
    payload: payloadString
  };

  var uri = 'https://' + host + path + (queryString ? '?' + queryString : '');

  return UrlFetchApp.fetch(uri, fetchOptions);
}

