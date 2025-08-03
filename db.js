// db.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Render sets this automatically
  ssl: {
    rejectUnauthorized: false, // required on Render
  },
});

module.exports = pool;
