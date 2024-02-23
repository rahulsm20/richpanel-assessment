const { Pool } = require("pg");
require("dotenv").config();

const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 5432,
});

module.exports = db;
