const crypto = require('crypto');

const PAYHERE_MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID || '1211149';
const PAYHERE_MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET || '4N4s7O5l2p9O7q8v0x1z3A';
const PAYHERE_MODE = process.env.PAYHERE_MODE || 'sandbox'; // 'sandbox' | 'live'
const PAYHERE_CURRENCY = process.env.PAYHERE_CURRENCY || 'LKR';

/**
 * Format amount to 2 decimal places with no thousands separators (e.g., 350.00)
 */
function formatAmount(amount) {
  return Number(amount).toFixed(2);
}

/**
 * Generates PayHere Checkout Security MD5 Hash
 * Formula: strtoupper(md5(merchant_id + order_id + amount + currency + strtoupper(md5(merchant_secret))))
 */
function generatePayhereHash(merchantId, orderId, amount, currency, merchantSecret = PAYHERE_MERCHANT_SECRET) {
  const formattedAmount = formatAmount(amount);
  const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
  const hashString = `${merchantId}${orderId}${formattedAmount}${currency}${hashedSecret}`;
  return crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();
}

/**
 * Verifies PayHere Return/Notify MD5 Signature
 * Formula: md5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + strtoupper(md5(merchant_secret)))
 */
function verifyPayhereSignature(merchantId, orderId, payhereAmount, payhereCurrency, statusCode, md5sig, merchantSecret = PAYHERE_MERCHANT_SECRET) {
  if (!md5sig) return false;
  const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
  const hashString = `${merchantId}${orderId}${payhereAmount}${payhereCurrency}${statusCode}${hashedSecret}`;
  const calculatedSig = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();
  return calculatedSig === md5sig.toUpperCase();
}

module.exports = {
  PAYHERE_MERCHANT_ID,
  PAYHERE_MERCHANT_SECRET,
  PAYHERE_MODE,
  PAYHERE_CURRENCY,
  formatAmount,
  generatePayhereHash,
  verifyPayhereSignature,
};
