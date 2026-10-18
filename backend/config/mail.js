import "dotenv/config";
import nodemailer from "nodemailer";

// Create reusable transporter with connection pooling and resilient auth
const getTransporter = () => {
  const user = (process.env.EMAIL_USER || "cc653510@gmail.com").trim();
  // Strip any accidental spaces from Google App Password
  const pass = (process.env.EMAIL_PASS || "lbaz wmjx efgz qkqy").replace(/\s+/g, "");

  return nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
    pool: true, // Reuse connections for high performance in production
    maxConnections: 3,
    maxMessages: 50,
  });
};

const transporter = getTransporter();

// Verify connection configuration on server startup
transporter.verify((error) => {
  if (error) {
    console.error("❌ Nodemailer SMTP Connection Error:", error.message);
  } else {
    console.log("✅ Nodemailer SMTP Server is ready to send emails");
  }
});

/**
 * Send OTP Verification / Password Reset Email
 * @param {string} to - Recipient email address
 * @param {string} otp - 6 digit verification code
 * @param {string} subject - Email subject line
 */
export async function sendEmail(
  to,
  otp,
  subject = "Password Reset Verification Code - Veda Organics"
) {
  const cleanTo = (to || "").trim().toLowerCase();
  const senderEmail = (process.env.EMAIL_USER || "cc653510@gmail.com").trim();

  const mailOptions = {
    from: `"Veda Organics" <${senderEmail}>`,
    to: cleanTo,
    subject: subject,
    text: `Your Veda Organics verification code is: ${otp}. It expires in 5 minutes. Do not share this code with anyone.`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #F7F7F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #161B16;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F7F7F5; padding: 40px 10px;">
          <tr>
            <td align="center">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #E6E4DD; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); overflow: hidden;">
                
                <!-- Brand Header -->
                <tr>
                  <td style="background-color: #1B3821; padding: 28px 32px; text-align: center;">
                    <h1 style="margin: 0; font-family: Georgia, serif; font-size: 26px; color: #FFFFFF; letter-spacing: 2px;">VEDA</h1>
                    <span style="font-size: 10px; color: #C4DFC7; text-transform: uppercase; letter-spacing: 3px; font-weight: 600;">Organics</span>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 36px 32px 28px 32px; text-align: center;">
                    <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 50%; background-color: #E8EFE8; margin-bottom: 16px; font-size: 22px;">
                      🔐
                    </div>
                    <h2 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 600; color: #161B16;">
                      Password Reset Code
                    </h2>
                    <p style="margin: 0 0 24px 0; font-size: 13px; line-height: 1.6; color: #6F756F;">
                      We received a request to reset your password for your Veda Organics account. Use the 6-digit code below to set a new password.
                    </p>

                    <!-- OTP Code Display Card -->
                    <div style="background-color: #F8FAF8; border: 2px dashed #1B3821; border-radius: 8px; padding: 18px 24px; margin: 0 auto 24px auto; display: inline-block;">
                      <span style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #1B3821;">
                        ${otp}
                      </span>
                    </div>

                    <!-- Expiration Notice -->
                    <div style="margin-bottom: 24px;">
                      <span style="display: inline-block; background-color: #FFF2F2; color: #D32F2F; font-size: 11px; font-weight: 600; padding: 5px 12px; border-radius: 20px; border: 1px solid #FFCDD2;">
                        ⏳ Valid for 5 minutes only
                      </span>
                    </div>

                    <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #9DA89D;">
                      If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
                    </p>
                  </td>
                </tr>

                <!-- Footer Strip -->
                <tr>
                  <td style="background-color: #FAFAF8; border-top: 1px solid #EFECE6; padding: 20px 32px; text-align: center; font-size: 11px; color: #8C948C;">
                    <p style="margin: 0 0 4px 0;">This is an automated security email from Veda Organics Agro Products.</p>
                    <p style="margin: 0;">Please do not reply to this email.</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${cleanTo} (Message ID: ${info.messageId})`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send email to ${cleanTo}:`, error.message);
    throw error;
  }
}

export default sendEmail;