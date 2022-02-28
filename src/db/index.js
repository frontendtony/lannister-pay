const { Sequelize } = require('sequelize');
require('dotenv').config();

const client = new Sequelize(process.env.DATABASE_URL, { dialect: 'postgres', ssl: true });

exports.client = client;
