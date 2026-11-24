
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function sendEmail(to, otp) {
  const mailOptions = {
    from: `"VEDA ORGANIC🍎" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify Your Email - OTP",

    html: `
      <div style="
        margin: 0;
        padding: 35px 15px;
        background: #f3f8f2;
        font-family: Arial, Helvetica, sans-serif;
      ">

        <div style="
          max-width: 500px;
          margin: auto;
          background: #ffffff;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid #e5eee2;
        ">

          <!-- Header -->
          <div style="
            padding: 24px;
            text-align: center;
            background: #ffffff;
          ">
            <h2 style="
              margin: 0;
              color: #166534;
              font-size: 25px;
              font-weight: 800;
            ">
              VEDA ORGANIC
            </h2>

            <p style="
              margin: 7px 0 0;
              color: #84a98c;
              font-size: 11px;
              letter-spacing: 2px;
              font-weight: 600;
            ">
              FRESHNESS DELIVERED TO YOUR DOOR
            </p>
          </div>

          <!-- Grocery Image -->
          <div style="padding: 0;">
            <img
              src=""https://images.unsplash.com/photo-1542838132-92c53300491e";"
              alt="Fresh fruits and vegetables"
              style="
                display: block;
                width: 100%;
                height: 220px;
                object-fit: cover;
                border: 0;
              "
            />
          </div>

          <!-- Main Content -->
          <div style="
            padding: 35px 30px;
            text-align: center;
          ">

            <div style="
              width: 55px;
              height: 55px;
              margin: 0 auto 18px;
              background: #ecfdf3;
              border-radius: 50%;
              line-height: 55px;
              font-size: 27px;
            ">
              🥬
            </div>

            <h1 style="
              margin: 0 0 12px;
              color: #14532d;
              font-size: 26px;
            ">
              Verify Your Email
            </h1>

            <p style="
              margin: 0 auto 28px;
              color: #64748b;
              font-size: 14px;
              line-height: 1.8;
            ">
              Welcome! We're happy to have you with us.
              Please use the verification code below
              to verify your email address.
            </p>

            <!-- OTP Box -->
            <div style="
              padding: 25px 15px;
              background: #f0fdf4;
              border: 1px dashed #86efac;
              border-radius: 12px;
            ">

              <p style="
                margin: 0 0 12px;
                color: #15803d;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 2px;
              ">
                YOUR VERIFICATION CODE
              </p>

              <div style="
                color: #166534;
                font-size: 36px;
                font-weight: 800;
                letter-spacing: 9px;
                font-family: monospace;
              ">
                ${otp}
              </div>

            </div>

            <!-- Expiry Notice -->
            <div style="
              margin-top: 20px;
              padding: 13px;
              background: #fff7ed;
              border-radius: 8px;
            ">
              <p style="
                margin: 0;
                color: #c2410c;
                font-size: 12px;
                font-weight: 600;
              ">
                ⏳ This verification code expires in 3 minutes.
              </p>
            </div>

            <p style="
              margin: 25px 0 0;
              color: #94a3b8;
              font-size: 12px;
              line-height: 1.7;
            ">
              If you didn't request this code,
              please ignore this email.
            </p>

          </div>

          <!-- Footer -->
          <div style="
            padding: 23px 20px;
            background: #f0fdf4;
            border-top: 1px solid #dcfce7;
            text-align: center;
          ">

            <p style="
              margin: 0 0 8px;
              color: #166534;
              font-size: 13px;
              font-weight: 700;
            ">
              GyanaStack - Freshness You Can Trust
            </p>

            <p style="
              margin: 0;
              color: #86a58d;
              font-size: 11px;
              line-height: 1.6;
            ">
              Fresh groceries, delivered with care.
              <br />
              This is an automated email. Please do not reply.
            </p>

          </div>

        </div>

        <p style="
          margin: 18px auto 0;
          color: #94a3b8;
          font-size: 11px;
          text-align: center;
        ">
          © ${new Date().getFullYear()} Grocery. All rights reserved.
        </p>

      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export default sendEmail;
