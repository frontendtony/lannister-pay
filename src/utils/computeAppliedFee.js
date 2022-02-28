const getTransactionFeeValue = require('./getTransactionFeeValue');

module.exports = function computeAppliedFee(transaction, fees) {
  let matchedFee;
  let currentHighestSpecificity = 0;

  for (let fee of fees) {
    let specificity = getSpecificity(transaction, fee);
    if (specificity > currentHighestSpecificity) {
      currentHighestSpecificity = specificity;
      matchedFee = fee;
    }
  }

  let AppliedFeeValue = getTransactionFeeValue(transaction.Amount, matchedFee);
  let ChargeAmount = transaction.Customer.BearsFee
    ? AppliedFeeValue + transaction.Amount
    : transaction.Amount;

  return {
    AppliedFeeID: matchedFee.id,
    AppliedFeeValue,
    ChargeAmount,
    SettlementAmount: ChargeAmount - AppliedFeeValue,
  };
};

function getSpecificity(transaction, fee) {
  let specificity = 0;

  if (transaction.Currency === fee.currency) specificity++;
  if (
    (transaction.CurrencyCountry === transaction.PaymentEntity.Country ? 'LOCL' : 'INTL') ===
    fee.locale
  )
    specificity += 2;
  if (transaction.PaymentEntity.Type === fee.entity) specificity++;
  if (transaction.PaymentEntity.Brand === fee.entity_prop) specificity += 3;
  if (transaction.PaymentEntity.Issuer === fee.entity_prop) specificity += 4;
  if (transaction.PaymentEntity.SixID === fee.entity_prop) specificity += 5;
  if (transaction.PaymentEntity.Number === fee.entity_prop) specificity += 6;
  if (transaction.PaymentEntity.ID === fee.entity_prop) specificity += 7;

  return specificity;
}
