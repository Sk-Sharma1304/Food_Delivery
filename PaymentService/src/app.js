// src/app.js
// 🏗️ APP.JS = Assembles all pieces together

const express       = require('express');
const cors          = require('cors'); // 🌍 Allows frontend to talk to this server!
const logger        = require('./middlewares/logger');
const errorHandler  = require('./middlewares/errorHandler');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// ✅ CORS — VERY IMPORTANT for frontend integration!
// This tells the browser: "Yes, it's OK for a website to call this server"
// Without this, your friend's React/HTML frontend will get BLOCKED!
app.use(cors({
  origin: '*',           // Allow ALL websites (fine for development)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Read JSON from requests
app.use(logger);         // Log every request

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'payment-service', time: new Date() });
});

// All payment routes
app.use('/payments', paymentRoutes);

// Catch errors
app.use(errorHandler);

module.exports = app;
