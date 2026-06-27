// src/middlewares/errorHandler.js
// 🛡️ MIDDLEWARE = A SECURITY GUARD that stands between requests and responses
//
// This specific middleware catches any errors that slip through
// and returns a clean error message instead of crashing the server.
//
// 🧒 CHILD EXPLANATION:
// If the kitchen (service) catches fire, this guard doesn't let the fire
// reach the customer. Instead they calmly say: "Sorry, something went wrong!"

function errorHandler(err, req, res, next) {
  console.error('🔥 Unhandled error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong on our end.'
  });
}

module.exports = errorHandler;
