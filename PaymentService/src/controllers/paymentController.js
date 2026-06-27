// src/controllers/paymentController.js
// 🚦 CONTROLLER = The TRAFFIC POLICE of our app
//
// 🧒 CHILD EXPLANATION:
// When someone sends a request to our server (like "I want to pay!"),
// the Controller is the first one to receive it.
// It reads the request, passes the work to the Service,
// then sends back the response.
//
// It does NOT think about business rules — that's the Service's job.
// It just receives → passes → responds.

const paymentService = require('../services/paymentService');

const paymentController = {

  // POST /payments/initiate
  async initiatePayment(req, res) {
    try {
      const { isDuplicate, payment } = await paymentService.initiatePayment(req.body);

      if (isDuplicate) {
        return res.status(200).json({
          message: '⚠️  Payment already exists — not charged again (idempotent)',
          payment
        });
      }

      res.status(201).json({
        message: '✅ Payment initiated! Call /process next to complete it.',
        payment
      });

    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
    }
  },

  // POST /payments/:id/process
  async processPayment(req, res) {
    try {
      const payment = await paymentService.processPayment(req.params.id);
      const success = payment.status === 'SUCCESS';

      res.status(200).json({
        message: success ? '🎉 Payment successful!' : '😞 Payment failed.',
        payment
      });

    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
    }
  },

  // GET /payments/:id
  async getPayment(req, res) {
    try {
      const payment = await paymentService.getPayment(req.params.id);
      res.status(200).json({ payment });
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
    }
  },

  // GET /payments/order/:orderId
  async getPaymentsByOrder(req, res) {
    try {
      const payments = await paymentService.getPaymentsByOrder(req.params.orderId);
      res.status(200).json({
        order_id: req.params.orderId,
        count: payments.length,
        payments
      });
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
    }
  },

  // POST /payments/:id/refund
  async refundPayment(req, res) {
    try {
      const payment = await paymentService.refundPayment(req.params.id);
      res.status(200).json({
        message: '💸 Refund processed successfully!',
        payment
      });
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
    }
  },

};

module.exports = paymentController;
