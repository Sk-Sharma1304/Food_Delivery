-- schema.sql
-- 🗄️ This creates our payments table in PostgreSQL
-- Run this manually if the auto-setup doesn't work

CREATE DATABASE payment_db;

\c payment_db;

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
);
