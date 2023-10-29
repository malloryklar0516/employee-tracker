const mysql = require('mysql2');

require('dotenv').config();

const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '1111',
  database: 'employees_db'
});

module.exports = connection;