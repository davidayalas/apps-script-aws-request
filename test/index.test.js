/* global require */
/* eslint no-global-assign: 0 */

var test = require('tape');
var lib = require('../_temp-test/aws-request');

test('CryptoJs', function (t) {
  var CryptoJs = lib.CryptoJs_;
  t.ok(CryptoJs.HMAC, 'should have HMAC method');
  t.ok(CryptoJs.SHA256, 'should have SHA256 method');

  var result;

  result = CryptoJs.HMAC(CryptoJs.SHA256, 'foo-value', 'foo-key');
  t.equal(result, '6b2de18301bda95140a9fea76a89cf8c48bed77751c588ea8e5019faeb0d50ee',
    'should calculate HmacSHA256');

  result = CryptoJs.SHA256('foo-value', 'foo-key');
  t.equal(result, 'c77164b59bd03483ccf7dd119a04707cb47ca6c49884b3be9ae85eb39c0c735b',
    'should calculate SHA256');

  t.end();
});

test('getCanonicalDate functions', function (t) {
  var getCanonicalFullDate = lib.getCanonicalFullDate_;
  var getCanonicalShortDate = lib.getCanonicalShortDate_;

  t.ok(lib.DATE_VALUES_REGEX_, 'should have DATE_VALUES_REGEX_ constant');
  t.equal(typeof getCanonicalFullDate, 'function', 'should have getCanonicalFullDate_ function');
  t.equal(typeof getCanonicalShortDate, 'function', 'should have getCanonicalShortDate_ function');

  var date = new Date('2017-03-15T07:03:15.356Z');

  t.equal(getCanonicalFullDate(date), '20170315T070315Z', 'should return full date');
  t.equal(getCanonicalShortDate(date), '20170315', 'should return short date');

  t.end();
});

test('getCanonicalQueryString function', function (t) {
  var getCanonicalQueryString = lib.getCanonicalQueryString_;

  t.equal(typeof getCanonicalQueryString, 'function',
    'should be function');

  var result;

  result = getCanonicalQueryString({
    'foo1': 'value1',
    ' baz ': ' bar "baz" qux=1 ',
    'bar': 10,
    ' Foo 2': void 0
  });

  t.equal(result,
    'Foo%202=&bar=10&baz=%20bar%20%22baz%22%20qux%3D1%20&foo1=value1',
    'should return canonical query string');

  t.end();
});

test('calculateSignature function', function (t) {
  var calculateSignature = lib.calculateSignature_;

  t.equal(typeof calculateSignature, 'function', 'should have calculateSignature_ function');
  t.equal(
    calculateSignature('aws_key', '20170105', 'eu-west-1', 'lambda', 'stringToSign'),
    '339189553fd488688adb3b972b57974633c966b379d74cc736ca6e23b7295508');

  t.end();
});

test('getCanonicalRequestHash function', function (t) {
  var getCanonicalRequestHash = lib.getCanonicalRequestHash_;

  t.equal(typeof getCanonicalRequestHash, 'function',
    'should have getCanonicalRequestHash_ function');

  var result = getCanonicalRequestHash(
    'GET',
    '/',
    {
      'Host': 'iam.amazonaws.com',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      'X-Amz-Date': '20150830T123600Z'
    },
    'Action=ListUsers&Version=2010-05-08',
    '');

  t.deepEqual(result, {
    hashedCanonicalRequest: 'f536975d06c0309214f805bb90ccff089219ecd68b2577efef23edd43b7e1a59',
    signedHeaders: 'content-type;host;x-amz-date'
  });

  t.end();
});

test('request', function (t) {
  var request = lib.request;

  t.ok(lib.HASH_ALGORITHM_, 'should have HASH_ALGORITHM_ constant');
  t.equal(typeof request, 'function', 'should have request function');

  t.end();
});

test('request #1', function (t) {
  var request = lib.request;
  var UrlFetchApp = lib.UrlFetchApp;

  // setup env
  UrlFetchApp.fetch.reset();
  lib.testCurrentDate = '2015-08-30T12:36:00Z';

  var params = {
    accessKey: 'AKIDEXAMPLE',
    secretKey: 'wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY',
    service: 'iam',
    query: {
      Action: 'ListUsers',
      Version: '2010-05-08'
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    }
  };

  var result = request(params);
  t.equal(result, 'ok');

  t.ok(UrlFetchApp.fetch.calledOnce, 'should called once');

  t.equal(UrlFetchApp.fetch.firstCall.args[0],
    'https://iam.amazonaws.com/?Action=ListUsers&Version=2010-05-08',
    'should request uri');

  t.deepEqual(UrlFetchApp.fetch.firstCall.args[1], {
    headers: {
      'Authorization': 'AWS4-HMAC-SHA256 ' +
        'Credential=AKIDEXAMPLE/20150830/us-east-1/iam/aws4_request, ' +
        'SignedHeaders=content-type;host;x-amz-date, ' +
        'Signature=5d672d79c15b13162d9279b0855cfba6789a8edb4c82c400e06b5924a6f2b5d7',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      'X-Amz-Date': '20150830T123600Z'
    },
    method: 'GET',
    muteHttpExceptions: true,
    payload: ''
  }, 'should request with params');

  t.end();
});

test('request #2', function (t) {
  var request = lib.request;
  var UrlFetchApp = lib.UrlFetchApp;

  // setup env
  UrlFetchApp.fetch.reset();
  lib.testCurrentDate = '2017-04-12T17:57:24Z'; //

  var name = 'arn:aws:lambda:eu-west-1:913984845600:function:vensi_warehouse';
  var event = {
    type: 'productSlots/append',
    payload: {
      code: '1555',
      slots: ['M1010', 'M1011']
    }
  };

  var params = {
    accessKey: 'AKIDEXAMPLE',
    secretKey: 'wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY',
    service: 'lambda',
    region: 'eu-west-1',
    path: '/2015-03-31/functions/' + encodeURI(name) + '/invocations',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    payload: event
  };

  var result = request(params);
  t.equal(result, 'ok');

  t.ok(UrlFetchApp.fetch.calledOnce, 'should called once');

  t.equal(UrlFetchApp.fetch.firstCall.args[0],
    'https://lambda.eu-west-1.amazonaws.com/2015-03-31/functions' +
      '/arn:aws:lambda:eu-west-1:913984845600:function:vensi_warehouse/invocations',
    'should request uri');

  t.deepEqual(UrlFetchApp.fetch.firstCall.args[1], {
    headers: {
      'Authorization': 'AWS4-HMAC-SHA256 ' +
        'Credential=AKIDEXAMPLE/20170412/eu-west-1/lambda/aws4_request, ' +
        'SignedHeaders=content-type;host;x-amz-date, ' +
        'Signature=54923843a90f47be0fd1331ba8c814bfb7fa5f082927395955cb8e29549c574a',
      'Content-Type': 'application/json; charset=utf-8', 'X-Amz-Date': '20170412T175724Z'
    },
    method: 'POST',
    muteHttpExceptions: true,
    payload: '{"type":"productSlots/append","payload":{"code":"1555","slots":["M1010","M1011"]}}'
  }, 'should request with params');

  t.end();
});
