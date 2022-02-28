const isValidFeeConfiguration = require('./isValidFeeConfiguration');

/**
 * Convert FCS configuration to an array of objects
 * @example 
 * fcsToArray("LNPY1221 NGN * *(*) : APPLY PERC 1.4")
 * [
 *  {
      "id": "LNPY1221",
      "currency": "NGN",
      "locale": "*",
      "entity": "*",
      "entity_prop": "*",
      "fee_type": "PERC",
      "flat_value": null,
      "perc_value": "1.4"
      "specificity": 1
    }
  ]
 * @param {*} fcsString The FCS configuration string
 */
function parseFCS(fcsString) {
  let lines = fcsString.split('\n');
  let feesConfiguration = [];

  for (let line of lines) {
    if (!isValidFeeConfiguration(line)) {
      throw new Error(`Invalid fee configuration spec: (${line})`);
    }
    const [id, currency, locale, entity] = line.substring(0, line.indexOf(' : ')).split(' ');
    const [fee_type, value] = line.substring(line.indexOf('APPLY') + 6).split(' ');

    let flat_value = null;
    let perc_value = null;

    switch (fee_type) {
      case 'FLAT':
        flat_value = value;
        break;
      case 'PERC':
        perc_value = value;
        break;
      default:
        [flat_value, perc_value] = value.split(':');
    }

    let entity_prop = entity.substring(entity.indexOf('(') + 1, entity.indexOf(')'));

    feesConfiguration.push({
      id,
      currency,
      locale,
      entity: entity.substring(0, entity.indexOf('(')),
      entity_prop,
      fee_type,
      flat_value,
      perc_value,
    });
  }

  return feesConfiguration;
}

module.exports = parseFCS;
