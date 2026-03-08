require("./env");

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,

    logging: console.log, // or false

    pool: {
      max: 5, // maximum connections
      min: 0, // minimum connections
      acquire: 30000, // time to get connection
      idle: 10000, // idle timeout
    },

    dialectOptions: {
      connectTimeout: 60000,
    },
  },

  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,

    logging: false,

    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },

    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
