
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Set in your .env file
    pass: process.env.EMAIL_PASS, // Set in your .env file
  },
}

);

function sendEmail(to, otp) {
  const mailOptions = {
    from: `"Gyana" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: "OTP Verification",
  html: `
  <div style="background-color: #0f172a; padding: 40px 10px; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;">
    <div style="max-width: 440px; margin: 0 auto; background: #1e293b; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5); border: 1px solid #334155; text-align: center;">
      
      <!-- Top Glowing Animated Bar -->
      <div style="height: 4px; background: linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6, #ec4899); background-size: 200% 100%; animation: moveBar 3s linear infinite;"></div>

      <div style="padding: 32px 24px;">
        
        <!-- Animated Floating Icon (SVG with Embedded CSS Keyframes) -->
        <div style="margin-bottom: 15px;">
          <svg width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <style>
              @keyframes pulse {
                0% { transform: scale(0.95); opacity: 0.8; }
                50% { transform: scale(1.05); opacity: 0.3; }
                100% { transform: scale(0.95); opacity: 0.8; }
              }
              @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-6px); }
                100% { transform: translateY(0px); }
              }
              .pulse-ring { animation: pulse 2.5s infinite ease-in-out; transform-origin: center; }
              .floating-lock { animation: float 3s infinite ease-in-out; transform-origin: center; }
            </style>
            <!-- Outer Pulsing Glow Circle -->
            <circle class="pulse-ring" cx="50" cy="50" r="42" fill="#6366f1" opacity="0.2" />
            <circle cx="50" cy="50" r="32" fill="#312e81" />
            
            <!-- Animated Floating Shield Icon -->
            <g class="floating-lock" fill="#818cf8">
              <path d="M50 28L32 36V48C32 60 40 70 50 74C60 70 68 60 68 48V36L50 28ZM50 44C52.2 44 54 45.8 54 48C54 49.5 53.2 50.8 52 51.5V57C52 58.1 51.1 59 50 59C48.9 59 48 58.1 48 57V51.5C46.8 50.8 46 49.5 46 48C46 45.8 47.8 44 50 44Z"/>
            </g>
          </svg>
        </div>

        <h2 style="color: #f8fafc; font-size: 24px; font-weight: 700; margin: 0 0 6px 0; letter-spacing: -0.5px;">
          Verification Code
        </h2>
        
        <p style="color: #94a3b8; font-size: 14px; margin: 0 0 24px 0;">
          Enter the code below to complete sign-in.
        </p>

        <!-- Animated Shimmer OTP Card -->
        <div style="position: relative; background: #0f172a; border: 1px solid #475569; border-radius: 14px; padding: 20px; margin: 10px 0; overflow: hidden;">
          <span style="font-size: 34px; font-weight: 800; color: #38bdf8; letter-spacing: 10px; font-family: 'Courier New', monospace; display: inline-block;">
            ${otp}
          </span>
        </div>

        <!-- Timer Notice -->
        <div style="margin-top: 20px; display: inline-flex; align-items: center; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); padding: 6px 14px; border-radius: 20px;">
          <span style="color: #f87171; font-size: 12px; font-weight: 600;">
            ⏳ Code expires in 3 minutes
          </span>
        </div>
        
        <p style="color: #64748b; font-size: 12px; margin-top: 16px;">
          If you didn't request this code, please ignore this email.
        </p>
      </div>

      <div style="background-color: #0f172a; padding: 14px; border-top: 1px solid #1e293b; font-size: 11px; color: #475569;">
        Protected by GyanaStack Security System
      </div>
    </div>
  </div>
` // Changed from 'text' to 'html'
  };

  // Returning a Promise makes it compatible with async/await in your controller
  return transporter.sendMail(mailOptions);
}

export default sendEmail;