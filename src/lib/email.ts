import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendRegistrationEmail = async ({
  to,
  name,
  ticketCode,
  eventName
}: {
  to: string;
  name: string;
  ticketCode: string;
  eventName: string;
}) => {
  try {
    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #F7F9FC;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      border: 1px solid #E4E7EC;
    }
    .header {
      background: linear-gradient(135deg, #6B24E8 0%, #1478F2 48%, #15CDB5 100%);
      padding: 30px 20px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .content {
      padding: 40px 30px;
      text-align: center;
    }
    .content h2 {
      color: #161B35;
      font-size: 20px;
      margin-top: 0;
    }
    .content p {
      color: #667085;
      font-size: 16px;
      line-height: 1.6;
    }
    .ticket-box {
      background-color: #F7F9FC;
      border: 2px dashed #1478F2;
      border-radius: 8px;
      padding: 20px;
      margin: 30px 0;
    }
    .ticket-code {
      font-size: 24px;
      font-weight: 800;
      color: #5B27D9;
      letter-spacing: 2px;
      font-family: monospace;
      margin: 10px 0;
    }
    .footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      color: #98a2b3;
      font-size: 14px;
      border-top: 1px solid #E4E7EC;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Campus Connect</h1>
    </div>
    <div class="content">
      <h2>Registration Confirmed!</h2>
      <p>Hi ${name},</p>
      <p>You have successfully registered for <strong>${eventName}</strong>.</p>
      
      <div class="ticket-box">
        <p style="margin:0; color: #161B35; font-weight: 600;">Your Entry Pass Code</p>
        <div class="ticket-code">${ticketCode.substring(0, 8).toUpperCase()}</div>
        <p style="margin:0; font-size: 13px;">Please keep this code handy for check-in.</p>
      </div>
      
      <p>We look forward to seeing you at the event!</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Campus Connect. All rights reserved.
    </div>
  </div>
</body>
</html>
    `;

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      replyTo: process.env.SMTP_REPLY_TO,
      to,
      subject: `Registration Confirmed: ${eventName}`,
      html: htmlTemplate,
    });

    console.log("Email sent: %s", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};
