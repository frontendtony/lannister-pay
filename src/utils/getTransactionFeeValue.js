function getTransactionFeeValue(amount, fee) {
  let transactionFeeValue;

  switch (fee.fee_type) {
    case 'PERC': {
      transactionFeeValue = amount * (Number(fee.perc_value) / 100);
      break;
    }
    case 'FLAT_PERC': {
      transactionFeeValue = Number(fee.flat_value) + Number(fee.perc_value / 100) * amount;
      break;
    }
    default: {
      transactionFeeValue = Number(fee.flat_value);
    }
  }

  return +Number(transactionFeeValue).toFixed(2);
}

module.exports = getTransactionFeeValue;
