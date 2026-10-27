const { sendEmailOtp } = require('./emailService');

/**
 * Send 6-Digit Verification OTP Email to User via centralized Resend Email Service.
 * Security: Never logs the plaintext OTP to console or includes it in the email subject.
 */
async function sendOtpEmail({ email, otp, name, purpose, idempotencyKey }) {
  const result = await sendEmailOtp({
    email,
    otp,
    name,
    purpose,
    idempotencyKey
  });

  return {
    delivered: Boolean(result && result.sent),
    status: result ? result.status : 'failed',
    providerMessageId: result ? result.id || null : null,
    reason: result && !result.sent ? result.status : null
  };
}

module.exports = {
  sendOtpEmail
};
