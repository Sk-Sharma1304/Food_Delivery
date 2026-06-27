// src/utils/gatewaySimulator.js
// 🎲 GATEWAY SIMULATOR = Pretends to be a real bank (like Razorpay / PayU)
//
// 🧒 CHILD EXPLANATION:
// In real life, when you pay, the app secretly calls the BANK and asks:
// "Hey bank, can I take ₹299 from this card?"
// The bank says YES or NO.
//
// We don't have a real bank here, so we PRETEND using random numbers.
// 90% of the time = YES (success) ✅
// 10% of the time = NO  (failure) ❌

function simulateGateway(amount) {
  const roll = Math.random(); // Random number: 0.0 to 1.0

  if (roll > 0.1) {
    // 🎉 SUCCESS — bank said yes!
    return {
      success: true,
      transaction_id: `TXN-${Date.now()}-${Math.floor(Math.random() * 99999)}`
    };
  } else {
    // 😞 FAILURE — bank said no
    const reasons = [
      'Insufficient funds',
      'Card declined by bank',
      'Daily limit exceeded',
      'UPI PIN incorrect',
      'Bank server timeout — please retry'
    ];
    return {
      success: false,
      failure_reason: reasons[Math.floor(Math.random() * reasons.length)]
    };
  }
}

module.exports = { simulateGateway };
