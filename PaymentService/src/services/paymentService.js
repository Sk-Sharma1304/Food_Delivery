// src/services/paymentService.js
// 🧠 SERVICE = The BRAIN of the operation
// It holds all the business rules and logic.
//
// 🧒 CHILD EXPLANATION:
// The Controller takes your order ("I want to pay!")
// The Service THINKS about what to do ("OK, let me check if it's valid, then call the bank...")
// The Repository actually touches the database ("Let me write that down...")
//
// Controller → Service → Repository
// (Waiter)  → (Chef) → (Pantry)

const paymentRepository = require('../repositories/paymentRepository');
const { simulateGateway } = require('../utils/gatewaySimulator');

const paymentService = {

  // 💳 Start a new payment
  async initiatePayment({ order_id, amount, currency, payment_method, idempotency_key }) {

    // Rule 1: All required fields must be present
    if (!order_id || !amount || !idempotency_key) {
      throw { status: 400, message: 'order_id, amount, and idempotency_key are required.' };
    }

    // Rule 2: Amount must be a positive number
    if (amount <= 0) {
      throw { status: 400, message: 'Amount must be greater than zero.' };
    }

    // Rule 3: Check for duplicate request (idempotency)
    // If the same key was used before, return the old payment — don't charge again!
    const existing = await paymentRepository.findByIdempotencyKey(idempotency_key);
    if (existing) {
      return { isDuplicate: true, payment: existing };
    }

    // Rule 4: Create a brand new payment
    const payment = await paymentRepository.create({
      order_id, amount, currency, payment_method, idempotency_key
    });

    return { isDuplicate: false, payment };
  },

  // 🏦 Process (complete) a payment by calling the "bank"
  async processPayment(paymentId) {

    // Find the payment first
    const payment = await paymentRepository.findById(paymentId);
    if (!payment) {
      throw { status: 404, message: 'Payment not found. Check the ID!' };
    }

    // Only PENDING payments can be processed
    if (payment.status !== 'PENDING') {
      throw { status: 400, message: `Payment is already ${payment.status}. Cannot process again.` };
    }

    // Call the "bank" (simulated)
    const bankResponse = simulateGateway(payment.amount);

    if (bankResponse.success) {
      return await paymentRepository.markSuccess(paymentId, bankResponse.transaction_id);
    } else {
      return await paymentRepository.markFailed(paymentId, bankResponse.failure_reason);
    }
  },

  // 🔍 Get a single payment's status
  async getPayment(paymentId) {
    const payment = await paymentRepository.findById(paymentId);
    if (!payment) {
      throw { status: 404, message: 'Payment not found.' };
    }
    return payment;
  },

  // 📋 Get all payments for an order
  async getPaymentsByOrder(orderId) {
    return await paymentRepository.findByOrderId(orderId);
  },

  // 💸 Refund a payment
  async refundPayment(paymentId) {
    const payment = await paymentRepository.findById(paymentId);
    if (!payment) {
      throw { status: 404, message: 'Payment not found.' };
    }

    // Can only refund a payment that was successful
    if (payment.status !== 'SUCCESS') {
      throw { status: 400, message: `Cannot refund. Payment status is: ${payment.status}` };
    }

    return await paymentRepository.markRefunded(paymentId);
  },

};

module.exports = paymentService;
