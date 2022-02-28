const { client } = require('.');
const { QueryTypes } = require('sequelize');

exports.getFees = async function (transaction) {
  try {
    const result = await client.query(
      `SELECT * FROM fees
         WHERE currency IN ('*', $1)
         AND locale IN ('*', $2)
         AND entity IN ('*', $3)
         AND (entity_prop IN ('*', $4) OR entity_prop IN ('*', $5) OR entity_prop IN ('*', $6) OR entity_prop IN ('*', $7) OR entity_prop IN ('*', $8))`,
      {
        bind: [
          transaction.Currency,
          transaction.CurrencyCountry === transaction.PaymentEntity.Country ? 'LOCL' : 'INTL',
          transaction.PaymentEntity.Type,
          transaction.PaymentEntity.ID,
          transaction.PaymentEntity.Issuer,
          transaction.PaymentEntity.Brand,
          transaction.PaymentEntity.Number,
          transaction.PaymentEntity.SixID,
        ],
        type: QueryTypes.SELECT,
      }
    );

    return result;
  } catch (e) {
    throw new Error();
  }
};

exports.insertFees = async function (fees) {
  function createPlaceholders(rowCount, columnCount) {
    var index = 1;
    return Array(rowCount)
      .fill(0)
      .map(
        (v) =>
          `(${Array(columnCount)
            .fill(0)
            .map((v) => `$${index++}`)
            .join(', ')})`
      )
      .join(', ');
  }

  const values = fees.map((f) => Object.values(f)).flat();

  await client.query(
    `INSERT INTO fees (id, currency, locale, entity, entity_prop, fee_type, flat_value, perc_value) VALUES ${createPlaceholders(
      fees.length,
      8
    )}`,
    {
      bind: values,
      type: QueryTypes.SELECT,
    }
  );
};
