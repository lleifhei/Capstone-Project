const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

console.log('Connecting to database:', connectionString);

const pool = new Pool({
  connectionString,
});

module.exports = pool;

