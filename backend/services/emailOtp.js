const nodemailer = require('nodemailer');

/**
 * Create Nodemailer transporter using environment variables (Gmail App Password or custom SMTP)
 */
function createTransporter() {
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });
}

/**
 * Send 6-Digit Verification OTP Email to User
 */
async function sendOtpEmail({ email, otp, name }) {
  const transporter = createTransporter();
  const displayName = name ? name.split(' ')[0] : 'there';

  const html = `
    <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; background: #F4F2EC; padding: 32px; border-radius: 16px; border: 1px solid #D6D0C2; color: #1C1B18;">
      <p style="font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #B0442C; margin: 0 0 8px 0;">
        Second Innings • Mentoring Platform
      </p>
      <h2 style="font-size: 24px; font-weight: normal; margin: 0 0 16px 0; color: #1C1B18;">
        Your Email Verification Code
      </h2>
      <p style="font-family: sans-serif; font-size: 14px; line-height: 1.6; color: #3B3934; margin: 0 0 20px 0;">
        Hello ${displayName}, use the 6-digit verification code below to sign in to your Second Innings Mentee Account:
      </p>
      <div style="background: #FFFFFF; border: 2px solid #B0442C; border-radius: 12px; padding: 18px; text-align: center; margin: 0 0 20px 0;">
        <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1C1B18;">
          ${otp}
        </span>
      </div>
      <p style="font-family: sans-serif; font-size: 12px; color: #6F6B62; margin: 0;">
        This code is valid for 10 minutes. If you did not request this code, you can safely ignore this email.
      </p>
    </div>
  `;

  if (!transporter) {
    console.warn(`[EMAIL OTP NOTICE] SMTP_USER / SMTP_PASS not set in .env. OTP for ${email} is: ${otp}`);
    return { delivered: false, reason: 'smtp_not_configured' };
  }

  const fromEmail = process.env.SMTP_FROM || `"Second Innings" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`;

  await transporter.sendMail({
    from: fromEmail,
    to: email,
    subject: `${otp} is your Second Innings verification code`,
    text: `Hello ${displayName}, your Second Innings verification code is ${otp}. Valid for 10 minutes.`,
    html
  });

  return { delivered: true };
}

module.exports = {
  sendOtpEmail
};
