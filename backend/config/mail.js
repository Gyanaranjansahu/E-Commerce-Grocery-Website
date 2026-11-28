import nodemailer from "nodemailer";

// Simple, reliable Nodemailer helper for sending OTPs
function getTransporter() {
  const user = process.env.EMAIL_USER;
  // Strip whitespace from App Passwords (e.g. "abcd efgh ijkl mnop" -> "abcdefghijklmnop")
  const pass = (process.env.EMAIL_PASS || "").replace(/\s+/g, "");

  if (!user || !pass) {
    console.error(
      "[Nodemailer Error] EMAIL_USER or EMAIL_PASS is missing in environment variables!\n" +
      "If running locally, check backend/.env.\n" +
      "If running on Vercel, add EMAIL_USER and EMAIL_PASS to Vercel Project Settings > Environment Variables."
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

/**
 * Send 6-digit OTP verification email
 * @param {string} to - Recipient email
 * @param {string|number} otp - 6-digit OTP code
 */
async function sendEmail(to, otp) {
  const user = process.env.EMAIL_USER;
  const transporter = getTransporter();

  const mailOptions = {
    from: `"VEDA Organics" <${user}>`,
    to,
    subject: `Your Verification Code: ${otp} - VEDA Organics`,
    text: `Your VEDA Organics verification code is ${otp}. It will expire in 3 minutes. If you did not request this, please ignore this email.`,
    html: `
      <div style="max-width: 480px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff; border: 1px solid #E8E6DF; border-radius: 12px; overflow: hidden; padding: 32px 24px; text-align: center;">
        <h2 style="margin: 0; color: #1B3821; font-size: 24px; letter-spacing: 2px;">VEDA ORGANICS</h2>
        <p style="margin: 4px 0 24px; color: #7A827A; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;">Freshness From The Farm</p>

        <p style="color: #3C423C; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
          Use the verification code below to verify your email address.
        </p>

        <div style="background: #F0FDF4; border: 2px dashed #86EFAC; border-radius: 10px; padding: 18px 24px; margin: 20px 0; display: inline-block;">
          <span style="font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #15803D;">${otp}</span>
        </div>

        <p style="color: #C2410C; font-size: 12px; font-weight: 600; margin: 16px 0 8px;">
          ⏳ This code expires in 3 minutes.
        </p>
        <p style="color: #9DA89D; font-size: 11px; margin: 0;">
          If you did not request this code, no action is needed.
        </p>

        <hr style="border: none; border-top: 1px solid #F0EEE8; margin: 28px 0 16px;" />
        <p style="color: #9DA89D; font-size: 10px; margin: 0;">
          © ${new Date().getFullYear()} VEDA Organics. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Nodemailer] OTP email successfully sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`[Nodemailer] Failed to send email to ${to}:`, error.message);
    throw error;
  }
}

export default sendEmail;
