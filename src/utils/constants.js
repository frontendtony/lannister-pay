FEE_CONFIG_REGEX =
  /^LNPY([0-9]){4}\s(NGN)\s(LOCL|INTL|\*)\s(CREDIT-CARD|DEBIT-CARD|BANK-ACCOUNT|USSD|WALLET-ID|\*)\((\*|.+)\)\s:\sAPPLY\s(PERC|FLAT|FLAT_PERC)\s((\d*):{0,1}\d+(\.\d+)?)$/;

module.exports = {
  FEE_CONFIG_REGEX,
};
