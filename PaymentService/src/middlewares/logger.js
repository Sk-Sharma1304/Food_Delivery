// src/middlewares/logger.js
// 📝 LOGGER = A DIARY that records every request that comes in
//
// 🧒 CHILD EXPLANATION:
// Every time someone knocks on our server's door,
// the logger writes it down:
// "At 10:30 AM, someone asked for POST /payments/initiate"
// This helps us debug problems later!

function logger(req, res, next) {
  const time = new Date().toISOString();
  console.log(`📩 [${time}] ${req.method} ${req.url}`);
  next(); // "OK diary entry done — now let the request continue!"
}

module.exports = logger;
