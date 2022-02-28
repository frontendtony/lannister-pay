const { Sequelize } = require('sequelize');
require('dotenv').config();

const client = new Sequelize(process.env.DATABASE_CONNECTION_STRING, { dialect: 'postgres' });

exports.client = client;
