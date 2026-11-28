import nodemailer from "nodemailer";

// ==========================================
// 1. GMAIL SMTP TRANSPORTER
// ==========================================

function getTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS?.replace(/\s+/g, "");

  if (!user || !pass) {
    throw new Error(
      "EMAIL_USER or EMAIL_PASS is missing in environment variables"
    );
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    auth: {
      user,
      pass,
    },

    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 30000,
  });
}

// ==========================================
// 2. HTML ESCAPE
// ==========================================

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
}

// ==========================================
// 3. SEND OTP EMAIL
// ==========================================

async function sendEmail(to, otp) {
  if (!to || !otp) {
    throw new Error("Recipient email and OTP are required");
  }

  const user = process.env.EMAIL_USER;
  const transporter = getTransporter();

  const safeOtp = escapeHtml(otp);
  const year = new Date().getFullYear();

  const mailOptions = {
    from: `"VEDA Organics" <${user}>`,
    to,

    subject: "Your VEDA Organics Verification Code",

    text: `
Welcome to VEDA Organics!

Your verification code is ${otp}.

This code expires in 3 minutes.

Never share this code with anyone.
    `.trim(),

    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VEDA Organics OTP</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#050505;
  font-family:Arial,Helvetica,sans-serif;
">

<table width="100%" cellpadding="0" cellspacing="0"
  style="background:#050505;padding:40px 12px;">

<tr>
<td align="center">

<table width="100%" cellpadding="0" cellspacing="0"
  style="
    max-width:480px;
    background:#111111;
    border:1px solid #292929;
    border-radius:16px;
    overflow:hidden;
  ">

<tr>
<td align="center" style="padding:38px 24px 20px;">

<h1 style="
  color:#ffffff;
  font-size:30px;
  letter-spacing:4px;
  margin:0;
">
VEDA
</h1>

<p style="
  color:#c5a66b;
  font-size:11px;
  letter-spacing:5px;
  margin:8px 0 0;
">
ORGANICS
</p>

<div style="
  width:45px;
  height:2px;
  background:#c5a66b;
  margin:25px auto 0;
"></div>

</td>
</tr>

<tr>
<td align="center" style="padding:20px 28px 35px;">

<h2 style="
  color:#ffffff;
  font-size:23px;
  margin:0 0 15px;
">
Verify Your Email
</h2>

<p style="
  color:#a3a3a3;
  font-size:14px;
  line-height:1.8;
  margin:0 0 28px;
">
Thank you for choosing VEDA Organics.
Use the verification code below to continue.
</p>

<table width="100%" cellpadding="0" cellspacing="0"
  style="
    background:#1b1b1b;
    border:1px solid #c5a66b;
    border-radius:12px;
  ">

<tr>
<td align="center" style="padding:25px 10px;">

<p style="
  color:#999999;
  font-size:10px;
  letter-spacing:3px;
  margin:0 0 14px;
">
YOUR VERIFICATION CODE
</p>

<p style="
  color:#d9c28b;
  font-size:34px;
  font-weight:bold;
  letter-spacing:9px;
  margin:0;
">
${safeOtp}
</p>

</td>
</tr>
</table>

<p style="
  color:#d9c28b;
  font-size:13px;
  margin:25px 0 12px;
">
This code expires in 3 minutes.
</p>

<p style="
  color:#777777;
  font-size:12px;
  line-height:1.7;
  margin:0;
">
Never share this code with anyone.
If you did not request this verification,
you can safely ignore this email.
</p>

</td>
</tr>

<tr>
<td align="center" style="
  background:#0b0b0b;
  border-top:1px solid #292929;
  padding:22px 15px;
">

<p style="
  color:#c5a66b;
  font-size:12px;
  font-weight:bold;
  letter-spacing:2px;
  margin:0 0 8px;
">
VEDA ORGANICS
</p>

<p style="
  color:#666666;
  font-size:10px;
  line-height:1.7;
  margin:0;
">
Freshness From The Farm
<br>
© ${year} VEDA Organics. All rights reserved.
</p>

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
    // Verify SMTP connection before sending
    await transporter.verify();

    const info = await transporter.sendMail(mailOptions);

    console.log(
      `[Nodemailer] Email sent successfully. Message ID: ${info.messageId}`
    );

    return info;

  } catch (error) {
    console.error("[Nodemailer Error]", {
      code: error.code,
      command: error.command,
      message: error.message,
    });

    throw error;

  } finally {
    transporter.close();
  }
}

export default sendEmail;