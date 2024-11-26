/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
require('dotenv').config();

const sllOptions = {
  sll: {
    sslmode: 'require',
    rejectUnauthorized: false,
  },
};

module.exports = {
  url: process.env.DATABASE_URL,
  dialect: 'postgres',
  logging:
    process.env.DATABASE_LOGGING_ENABLED === 'true' ? console.log : false,
  pool: {
    max: 50,
  },
  dialectOptions: process.env.DATABASE_SSL_ENABLED === 'true' ? sllOptions : {},
};
