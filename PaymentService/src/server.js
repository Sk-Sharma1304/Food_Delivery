// src/server.js
require('dotenv').config({ path: `${__dirname}/../.env` }); // Loads .env first!

const app = require('./app');
const paymentRepository = require('./repositories/paymentRepository');

const PORT = process.env.PORT || 3002;

async function startServer() {
  try {
    await paymentRepository.createTable();
    console.log('✅ Database table ready!');

    app.listen(PORT, () => {
      console.log('');
      console.log('🏦 =====================================');
      console.log(`🏦  Payment Service is RUNNING!`);
      console.log(`🏦  http://localhost:${PORT}`);
      console.log('🏦 =====================================');
      console.log('');
      console.log('📋 Available routes:');
      console.log(`   GET  http://localhost:${PORT}/health`);
      console.log(`   POST http://localhost:${PORT}/payments/initiate`);
      console.log(`   POST http://localhost:${PORT}/payments/:id/process`);
      console.log(`   GET  http://localhost:${PORT}/payments/:id`);
      console.log(`   GET  http://localhost:${PORT}/payments/order/:orderId`);
      console.log(`   POST http://localhost:${PORT}/payments/:id/refund`);
    });

  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

startServer();
