const request = require('supertest');
const app = require('../src/app');
const dbClient = require('../src/db').client;

const invalidFCS = 'LNPY1221 NGN * *(*) : APPLY PERC';
const validFCS =
  'LNPY1221 NGN * *(*) : APPLY PERC 1.4\nLNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0';

beforeEach(async () => {
  await dbClient.query('TRUNCATE TABLE fees');
});

afterAll(async () => {
  await dbClient.close();
});

describe('App', () => {
  it('It should return 404 for invalid routes', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(404);
  });
});

describe('Save fee configuration spec', () => {
  it('should return an error if no configuration was provided', async () => {
    const response = await request(app).post('/fees');
    expect(response.statusCode).toBe(400);
  });

  it('should return an error if an invalid configuration was provided', async () => {
    const response = await request(app).post('/fees').send({ FeeConfigurationSpec: invalidFCS });
    expect(response.statusCode).toBe(422);
  });

  it('should return ok if a valid configuration was provided', async () => {
    const response = await request(app).post('/fees').send({
      FeeConfigurationSpec: validFCS,
    });
    expect(response.statusCode).toBe(200);
  });
});

describe('Generate fee for a transaction', () => {
  const transaction = {
    ID: 91204,
    Amount: 3500,
    Currency: 'NGN',
    CurrencyCountry: 'NG',
    Customer: {
      ID: 4211232,
      EmailAddress: 'anonimized292200@anon.io',
      FullName: 'Wenthorth Scoffield',
      BearsFee: false,
    },
    PaymentEntity: {
      ID: 2203454,
      Issuer: 'AIRTEL',
      Brand: '',
      Number: '080234******2903',
      SixID: '080234',
      Type: 'USSD',
      Country: 'NG',
    },
  };

  it('should return an error if no transaction was sent', async () => {
    const response = await request(app).post('/compute-transaction-fee');
    expect(response.statusCode).toBe(400);
  });

  it('should return an error if no fee exists', async () => {
    const response = await request(app).post('/compute-transaction-fee').send(transaction);
    expect(response.statusCode).toBe(404);
  });

  it('should return an error if no fee matches the transaction', async () => {
    await request(app)
      .post('/fees')
      .send({ FeeConfigurationSpec: 'LNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0' });
    const response = await request(app).post('/compute-transaction-fee').send(transaction);
    expect(response.statusCode).toBe(404);
  });

  it('should return the computed fee that matches the transaction', async () => {
    await request(app).post('/fees').send({ FeeConfigurationSpec: validFCS });
    const response = await request(app).post('/compute-transaction-fee').send(transaction);

    const expectedFeeValue = +Number(transaction.Amount * (1.4 / 100)).toFixed(2);

    expect(response.statusCode).toBe(200);
    expect(response.body['AppliedFeeID']).toBe('LNPY1221');
    expect(response.body['AppliedFeeValue']).toBe(expectedFeeValue);
    expect(response.body['ChargeAmount']).toBe(transaction.Amount);
    expect(response.body['SettlementAmount']).toBe(transaction.Amount - expectedFeeValue);
  });
});
