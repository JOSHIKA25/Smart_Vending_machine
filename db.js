const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'vending_db',
  password: 'Misi@2006',
  port: 5432,
});

module.exports = pool;
