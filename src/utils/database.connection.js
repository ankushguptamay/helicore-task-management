const db = require("../models");

async function connectDB() {
  try {
    await db.sequelize.authenticate();
  } catch (error) {
    process.exit(1);
  }
}

module.exports = connectDB;