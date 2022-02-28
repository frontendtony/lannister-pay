const { Sequelize } = require('sequelize');
require('dotenv').config();

const useSSL = ['production', 'staging'].includes(
  (process.env.NODE_ENV || 'development').toLowerCase()
);

const client = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: useSSL
      ? {
          require: true,
          rejectUnauthorized: false,
        }
      : false,
  },
});

exports.client = client;
