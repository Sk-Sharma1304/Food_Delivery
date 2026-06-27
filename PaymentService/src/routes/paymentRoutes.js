// src/routes/paymentRoutes.js
// 🗺️ ROUTES = The MAP of our app
// This file says: "When someone visits THIS URL, call THAT controller function"
//
// 🧒 CHILD EXPLANATION:
// Imagine a big building with many doors.
// Routes are the SIGNS on each door that say:
// "POST /payments/initiate  → go to initiatePayment room"
// "GET  /payments/:id       → go to getPayment room"
// etc.

const express = require('express');
const router  = express.Router();
const paymentController = require('../controllers/paymentController');

// Start a new payment
router.post('/initiate', paymentController.initiatePayment);

// Process (complete) a payment
router.post('/:id/process', paymentController.processPayment);

// Get a single payment by ID
router.get('/:id', paymentController.getPayment);

// Get all payments for an order
router.get('/order/:orderId', paymentController.getPaymentsByOrder);

// Refund a payment
router.post('/:id/refund', paymentController.refundPayment);

module.exports = router;
