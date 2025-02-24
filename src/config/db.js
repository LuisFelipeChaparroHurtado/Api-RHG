const mysql = require("mysql2");
require("dotenv").config();

// Crear un pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Promesa para facilitar el uso de async/await
const promisePool = pool.promise();

module.exports = promisePool;
