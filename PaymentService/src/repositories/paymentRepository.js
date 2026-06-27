// src/repositories/paymentRepository.js
// 📂 REPOSITORY = The only file allowed to talk to the database
// Think of it as the LIBRARIAN — only they touch the books (database)
// Everyone else asks the librarian for help!

const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const paymentRepository = {

  // Create our payments table if it doesn't exist yet
  async createTable() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id                     TEXT PRIMARY KEY,
        order_id               TEXT NOT NULL,
        amount                 NUMERIC(10,2) NOT NULL,
        currency               TEXT DEFAULT 'INR',
        status                 TEXT DEFAULT 'PENDING',
        idempotency_key        TEXT UNIQUE,
        payment_method         TEXT DEFAULT 'CARD',
        gateway_transaction_id TEXT,
        failure_reason         TEXT,
        created_at             TIMESTAMP DEFAULT NOW(),
        updated_at             TIMESTAMP DEFAULT NOW()
      )
    `);
  },

  // Find a payment by its unique ID
  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM payments WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  // Find by idempotency key (to avoid double charging)
  async findByIdempotencyKey(key) {
    const result = await pool.query(
      'SELECT * FROM payments WHERE idempotency_key = $1',
      [key]
    );
    return result.rows[0] || null;
  },

  // Find all payments for a specific order
  async findByOrderId(orderId) {
    const result = await pool.query(
      'SELECT * FROM payments WHERE order_id = $1 ORDER BY created_at DESC',
      [orderId]
    );
    return result.rows;
  },

  // Save a brand new payment
  async create({ order_id, amount, currency, payment_method, idempotency_key }) {
    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO payments (id, order_id, amount, currency, status, idempotency_key, payment_method)
       VALUES ($1, $2, $3, $4, 'PENDING', $5, $6)
       RETURNING *`,
      [id, order_id, amount, currency || 'INR', idempotency_key, payment_method || 'CARD']
    );
    return result.rows[0];
  },

  // Update payment to SUCCESS
  async markSuccess(id, transactionId) {
    const result = await pool.query(
      `UPDATE payments
       SET status = 'SUCCESS', gateway_transaction_id = $1, updated_at = NOW()
       WHERE id = $2 RETURNING *`,
      [transactionId, id]
    );
    return result.rows[0];
  },

  // Update payment to FAILED
  async markFailed(id, reason) {
    const result = await pool.query(
      `UPDATE payments
       SET status = 'FAILED', failure_reason = $1, updated_at = NOW()
       WHERE id = $2 RETURNING *`,
      [reason, id]
    );
    return result.rows[0];
  },

  // Update payment to REFUNDED
  async markRefunded(id) {
    const result = await pool.query(
      `UPDATE payments
       SET status = 'REFUNDED', updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  },

};

module.exports = paymentRepository;
