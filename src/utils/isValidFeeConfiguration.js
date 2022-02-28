const { FEE_CONFIG_REGEX } = require('./constants');

function isValidFeeConfiguration(fee) {
  return FEE_CONFIG_REGEX.test(fee);
}

module.exports = isValidFeeConfiguration;
