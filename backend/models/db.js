const mysql = require('mysql2');

// -------------------- Titouan -------------------
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_URI);
const Vote = require('./Vote');
// -------------------------------------------

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ----------------------- Titouan ------------------------
Vote.associate({ User, Issue });
// -------------------------------------------

module.exports = pool.promise();
