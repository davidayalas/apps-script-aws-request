/* global require, exports, CryptoJs_, DATE_VALUES_REGEX_, HASH_ALGORITHM_, calculateSignature_,
          getCanonicalFullDate_, getCanonicalShortDate_, getCanonicalQueryString_,
          getCanonicalRequestHash_, getCurrentDate_, request */

var sinon = require('sinon');

var UrlFetchApp = {
  fetch: sinon.spy(function () { return 'ok'; })
};

/* eslint no-global-assign: 0 */
getCurrentDate_ = function () {
  return new Date('2015-08-30T12:36:00Z');
};

exports.CryptoJs_ = CryptoJs_;
exports.DATE_VALUES_REGEX_ = DATE_VALUES_REGEX_;
exports.HASH_ALGORITHM_ = HASH_ALGORITHM_;
exports.calculateSignature_ = calculateSignature_;
exports.getCanonicalFullDate_ = getCanonicalFullDate_;
exports.getCanonicalShortDate_ = getCanonicalShortDate_;
exports.calculateSignature_ = calculateSignature_;
exports.getCanonicalQueryString_ = getCanonicalQueryString_;
exports.getCanonicalRequestHash_ = getCanonicalRequestHash_;
exports.getCurrentDate_ = getCurrentDate_;
exports.request = request;
exports.UrlFetchApp = UrlFetchApp;


