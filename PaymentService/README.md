# 🏦 Payment Service

A microservice that handles payments for a food delivery platform.
Built with **Node.js + Express + PostgreSQL**.

---

## 📁 Folder Structure

```
payment-service/
├── src/
│   ├── config/         → Database connection
│   ├── controllers/    → Handles HTTP requests & responses
│   ├── middlewares/    → Logger & error handler
│   ├── repositories/   → All database queries live here
│   ├── routes/         → URL definitions
│   ├── services/       → Business logic
│   ├── utils/          → Payment gateway simulator
│   ├── app.js          → Express app setup
│   └── server.js       → Entry point (run this!)
├── .env                → Your secret config (passwords etc.)
├── .env.example        → Template for .env
├── package.json
└── schema.sql          → Database table definition
```

---

## ⚙️ Setup Instructions (Do this once)

### Step 1 — Make sure you have these installed
- Node.js → https://nodejs.org (download LTS version)
- PostgreSQL → https://www.postgresql.org/download/windows

### Step 2 — Create the database
Open **pgAdmin** or **SQL Shell (psql)** and run:
```sql
CREATE DATABASE payment_db;
```

### Step 3 — Set up your .env file
- Copy `.env.example` and rename it to `.env`
- Open `.env` and change `DB_PASS` to your PostgreSQL password

### Step 4 — Install dependencies
Open terminal in this folder and run:
```
npm install
```

### Step 5 — Start the server
```
npm start
```

You should see:
```
✅ Database table ready!
🏦  Payment Service is RUNNING!
🏦  http://localhost:3002
```

---

## 🌐 API Reference (For Frontend Integration)

Base URL: `http://localhost:3002`

---

### ✅ Health Check
```
GET /health
```
**Response:**
```json
{ "status": "UP", "service": "payment-service" }
```

---

### 💳 1. Initiate a Payment
```
POST /payments/initiate
```
**Request Body (JSON):**
```json
{
  "order_id": "ORDER_001",
  "amount": 299.00,
  "currency": "INR",
  "payment_method": "UPI",
  "idempotency_key": "UNIQUE_STRING_PER_ATTEMPT"
}
```
> ⚠️ `idempotency_key` must be unique per payment attempt.
> Use a UUID or combine order_id + timestamp. This prevents double charging!

**Success Response (201):**
```json
{
  "message": "Payment initiated!",
  "payment": {
    "id": "abc123-...",
    "order_id": "ORDER_001",
    "amount": "299.00",
    "status": "PENDING",
    ...
  }
}
```
> 📌 Save the `id` — you need it for the next step!

---

### 🏦 2. Process (Complete) the Payment
```
POST /payments/:id/process
```
Replace `:id` with the `id` from step 1.

**Success Response (200):**
```json
{
  "message": "🎉 Payment successful!",
  "payment": {
    "id": "abc123-...",
    "status": "SUCCESS",
    "gateway_transaction_id": "TXN-1234567-99999"
  }
}
```
> Status will be `SUCCESS` or `FAILED` (10% random failure, realistic simulation)

---

### 🔍 3. Get Payment Status
```
GET /payments/:id
```
**Response:**
```json
{
  "payment": {
    "id": "abc123",
    "status": "SUCCESS",
    "amount": "299.00",
    ...
  }
}
```

---

### 📋 4. Get All Payments for an Order
```
GET /payments/order/:orderId
```
**Response:**
```json
{
  "order_id": "ORDER_001",
  "count": 1,
  "payments": [...]
}
```

---

### 💸 5. Refund a Payment
```
POST /payments/:id/refund
```
> Only works if payment status is `SUCCESS`

**Response:**
```json
{
  "message": "💸 Refund processed successfully!",
  "payment": { "status": "REFUNDED", ... }
}
```

---

## 💻 Frontend Integration Example (JavaScript Fetch)

```javascript
// Step 1: Initiate payment
const initResponse = await fetch('http://localhost:3002/payments/initiate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    order_id: 'ORDER_001',
    amount: 299.00,
    currency: 'INR',
    payment_method: 'UPI',
    idempotency_key: `KEY_${Date.now()}` // unique every time
  })
});
const { payment } = await initResponse.json();

// Step 2: Process it
const processResponse = await fetch(`http://localhost:3002/payments/${payment.id}/process`, {
  method: 'POST'
});
const result = await processResponse.json();

console.log(result.payment.status); // "SUCCESS" or "FAILED"
```

---

## 🔄 Payment Status Flow

```
PENDING → (process) → SUCCESS → (refund) → REFUNDED
                   ↘ FAILED
```

---

## ❓ Common Issues

| Problem | Fix |
|---|---|
| `ECONNREFUSED` error | PostgreSQL is not running. Start it from Services or pgAdmin |
| `password authentication failed` | Wrong DB_PASS in your .env file |
| `relation payments does not exist` | Database didn't set up. Check DB_NAME in .env |
| Frontend getting CORS error | Server is not running, or wrong port |
