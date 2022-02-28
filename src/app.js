const express = require('express');
const { feesController, computeTransactionFeeController } = require('./controllers/fees');
const { client } = require('./db');

client.authenticate();

const app = express();

app.use(express.json());

app.post('/fees', feesController);

app.post('/compute-transaction-fee', computeTransactionFeeController);

app.get('*', (_, res) => {
  res.status(404).json({ Error: 'Not found' });
});

module.exports = app;
