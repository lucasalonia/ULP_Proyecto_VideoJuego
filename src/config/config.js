// src/config/db.js
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",         // ⚠️ tu usuario MySQL
  password: "",         // ⚠️ tu contraseña MySQL
  database: "comarcas_1",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
