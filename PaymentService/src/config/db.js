// src/config/db.js
// 🔌 This file connects our app to PostgreSQL
// Think of it like plugging in a cable to our filing cabinet

const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'payment_db',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASS     || 'password',  // ⚠️ Change to your password
});

// Test the connection when server starts
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Could not connect to PostgreSQL:', err.message);
  } else {
    console.log('✅ Connected to PostgreSQL database!');
    release();
  }
});

module.exports = pool;
