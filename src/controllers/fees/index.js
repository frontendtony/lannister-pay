const parseFCS = require('../../utils/parseFCS');
const { getFees, insertFees } = require('../../db/fees');
const computeAppliedFee = require('../../utils/computeAppliedFee');

exports.feesController = async function (req, res) {
  if (!req.body.FeeConfigurationSpec) {
    return res.status(400).json({ Error: 'No fee configuration found' });
  }
  try {
    let fees;
    fees = parseFCS(req.body.FeeConfigurationSpec);
    await insertFees(fees);
    res.json({ Status: 'OK' });
  } catch (e) {
    return res.status(422).json({ Error: e.message });
  }
};

exports.computeTransactionFeeController = async function (req, res) {
  try {
    let transaction = req.body;
    if (!Object.keys(transaction).length) {
      return res.status(400).json({ Error: 'No transaction details provided' });
    }

    let fees = await getFees(transaction);
    if (!fees?.length) {
      return res.status(404).json({ Error: 'No fee configuration matches this transaction' });
    }

    res.json(computeAppliedFee(transaction, fees));
  } catch (error) {
    res.status(500).json({ Error: 'Internal server error' });
  }
};
