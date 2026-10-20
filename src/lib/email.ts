import nodemailer from 'nodemailer';
import * as aws from '@aws-sdk/client-sesv2';
import path from 'path';
import fs from 'fs';
import { ORIGINBI_ASSESSMENT_AMOUNT } from './constants';

export function getEmailAssetUrls() {
  const rawBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://campussquare.originbi.com';
  const baseUrl = rawBaseUrl.replace(/^http:\/\//i, 'https://').replace(/\/+$/, '');
  return {
    baseUrl,
    colorLogoUrl: `${baseUrl}/campus-square-logo-transparent.png`,
    whiteLogoUrl: `${baseUrl}/campus-square-logo-white.png`,
    atomLogoUrl: `${baseUrl}/atom-logo.png`,
    originBiLogoUrl: `${baseUrl}/Origin-BI-Logo-01.png`,
  };
}

export function getEmailTransporter() {
  const hasAwsSdkCredentials = !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);

  if (hasAwsSdkCredentials) {
    const sesClient = new aws.SESv2Client({
      region: process.env.AWS_REGION || 'ap-south-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!.trim(),
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!.trim(),
      },
    });

    return nodemailer.createTransport({
      SES: { sesClient, SendEmailCommand: aws.SendEmailCommand },
    } as any);
  }

  if (!process.env.SMTP_USER) {
    console.warn('[Email Warning] No AWS SES credentials (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY) or SMTP credentials (SMTP_USER / SMTP_PASS) found in environment variables. Email sending may fail.');
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'email-smtp.ap-south-1.amazonaws.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export function getFromEmailAddress(): string {
  const rawFrom = process.env.EMAIL_FROM || process.env.SMTP_FROM || 'no-reply@originbi.com';
  const fromClean = rawFrom.trim();
  const name = process.env.EMAIL_SEND_FROM_NAME || 'Campus Square™';

  if (fromClean.includes('<')) {
    return fromClean;
  }
  return `"${name}" <${fromClean}>`;
}

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
    const { baseUrl, colorLogoUrl, whiteLogoUrl, atomLogoUrl, originBiLogoUrl } = getEmailAssetUrls();
    const currentYear = new Date().getFullYear();

    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Confirmed: ${eventName}</title>
  <!-- Google Fonts: Plus Jakarta Sans & Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet" type="text/css">
  <!--[if mso]>
  <style type="text/css">
    body, table, td, p, a, span { font-family: 'Segoe UI', Arial, sans-serif !important; }
    h1, h2, h3, h4 { font-family: 'Segoe UI', Arial, sans-serif !important; font-weight: bold !important; }
  </style>
  <![endif]-->
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');

    body, p, td, div, span, a, li {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    h1, h2, h3, h4, h5, h6, .brand-font, .heading-font {
      font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
      letter-spacing: -0.015em;
    }
    .wrapper { max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 18px; overflow: hidden; border: 1px solid #E8DCF0; box-shadow: 0 12px 36px rgba(34, 5, 44, 0.08); }
    .top-navbar { background-color: #ffffff; padding: 18px 28px; border-bottom: 1px solid #E8DCF0; }
    .hero { background: linear-gradient(135deg, #180421 0%, #22052C 50%, #3B0D4E 100%); padding: 36px 32px; text-align: center; border-bottom: 3px solid #701A94; color: #ffffff; }
    .content { padding: 36px 32px; }
    .ticket-box { background: linear-gradient(180deg, #FAF7FC 0%, #F5EEF9 100%); border: 2px dashed #701A94; border-radius: 14px; padding: 24px; margin: 24px 0; text-align: center; }
    .ticket-code { font-size: 28px; font-weight: 800; color: #701A94; letter-spacing: 3px; font-family: monospace; margin: 8px 0; }
    .assessment-card { background: linear-gradient(135deg, #FAF7FC 0%, #F0FDF4 100%); border: 1px solid #E8DCF0; border-radius: 14px; padding: 24px; margin: 24px 0; text-align: left; }
    .footer { background: #22052C; padding: 36px 28px; text-align: center; color: #B58BD7; font-size: 12px; line-height: 1.6; }
    .footer a { color: #FAF7FC; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF7FC; margin: 0; padding: 24px 12px;">
  <div class="wrapper">
    <!-- Top Brand Navbar: Campus Square™ Logo (Left) + Atom Infinity ✕ OriginBI Logos (Right) -->
    <div class="top-navbar">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
        <tr>
          <td align="left" style="vertical-align: middle;">
            <img src="${colorLogoUrl}" alt="Campus Square™" style="height: 38px; width: auto; max-width: 200px; display: block; border: 0;" />
          </td>
          <td align="right" style="vertical-align: middle;">
            <table align="right" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; background-color: #FAF7FC; border: 1px solid #E8DCF0; border-radius: 12px; padding: 5px 12px; box-shadow: 0 2px 6px rgba(34, 5, 44, 0.04);">
              <tr>
                <td style="font-size: 10px; font-weight: 700; color: #6B5677; text-transform: uppercase; letter-spacing: 0.5px; padding-right: 8px; vertical-align: middle; font-family: 'Plus Jakarta Sans', sans-serif;">
                  Joint Collaboration:
                </td>
                <td align="center" style="vertical-align: middle; padding: 0 4px;">
                  <img src="${atomLogoUrl}" alt="Atom Infinity" style="height: 20px; width: auto; max-width: 75px; display: block; border: 0;" />
                </td>
                <td align="center" style="font-size: 12px; font-weight: 800; color: #701A94; padding: 0 5px; vertical-align: middle; line-height: 1;">
                  ✕
                </td>
                <td align="center" style="vertical-align: middle; padding: 0 4px;">
                  <img src="${originBiLogoUrl}" alt="OriginBI Mindworks" style="height: 20px; width: auto; max-width: 75px; display: block; border: 0;" />
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>

    <!-- Hero Header Banner (Matches Website Hero Fair Theme) -->
    <div class="hero">

      <div style="display: inline-block; background-color: #16A66A; color: #ffffff; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 6px 16px; border-radius: 9999px; margin-bottom: 16px; font-family: 'Plus Jakarta Sans', sans-serif;">
        ✓ Registration Confirmed
      </div>
      <h1 style="color: #ffffff; font-size: 26px; font-weight: 800; margin: 0 0 8px 0; font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif;">
        Welcome, ${name}!
      </h1>
      <p style="color: #D8C3E5; font-size: 14px; margin: 0; line-height: 1.5; font-family: 'Inter', -apple-system, sans-serif;">
        You are officially registered for <strong>${eventName}</strong>.
      </p>
    </div>

    <!-- Main Content -->
    <div class="content">
      <div class="ticket-box">
        <p style="margin: 0; color: #6B5677; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; font-family: 'Plus Jakarta Sans', sans-serif;">Your Entry Pass Code</p>
        <div class="ticket-code">${ticketCode.substring(0, 8).toUpperCase()}</div>
        <p style="margin: 0; font-size: 13px; color: #6B5677; line-height: 1.5; font-family: 'Inter', -apple-system, sans-serif;">
          Please present this entry pass code or show this email at the registration desk for instant check-in.
        </p>
      </div>

      <!-- Complimentary Assessment Card -->
      <div class="assessment-card">
        <div style="display: inline-block; background-color: #16A66A; color: #ffffff; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; padding: 4px 12px; border-radius: 9999px; margin-bottom: 12px; font-family: 'Plus Jakarta Sans', sans-serif;">
          Complimentary Benefit • Worth ₹${ORIGINBI_ASSESSMENT_AMOUNT} (FREE)
        </div>
        <h3 style="margin: 0 0 8px 0; color: #22052C; font-size: 17px; font-weight: 800; font-family: 'Plus Jakarta Sans', sans-serif;">Discover Your Strengths with OriginBI</h3>
        <p style="margin: 0 0 10px 0; color: #4A3B52; font-size: 14px; line-height: 1.55; font-family: 'Inter', sans-serif;">
          Your registration gives you <strong>free access</strong> to the OriginBI Assessment (Worth <strong>₹${ORIGINBI_ASSESSMENT_AMOUNT}</strong> - completely complimentary for attendees).
        </p>
        <p style="margin: 0 0 14px 0; color: #6B5677; font-size: 13px; line-height: 1.55; font-family: 'Inter', sans-serif;">
          You will receive an email invitation to complete the short profile test. Complete it to download your personalised single-page career report on the spot!
        </p>
        <div style="font-size: 12px; color: #701A94; font-weight: 700; padding-top: 12px; border-top: 1px solid #E8DCF0; font-family: 'Inter', sans-serif;">
          A joint collaboration by <strong>Atom Infinity</strong> and <strong>OriginBI Mindworks</strong>
        </div>
      </div>

      <p style="color: #6B5677; font-size: 14px; line-height: 1.6; text-align: center; margin: 28px 0 0 0; font-family: 'Inter', sans-serif;">
        We look forward to welcoming you to the fair edition!
      </p>
    </div>

    <!-- Top Accent Gradient Stripe -->
    <div style="background: linear-gradient(90deg, #701A94 0%, #8E23BA 50%, #B58BD7 100%); height: 4px;"></div>

    <!-- Official Brand Footer (Matches Website Footer) -->
    <div class="footer">
      <div style="margin-bottom: 20px;">
        <img src="${whiteLogoUrl}" alt="Campus Square™" style="max-height: 36px; max-width: 190px; display: block; margin: 0 auto 12px auto; border: 0;" />
        <p style="font-size: 11px; color: #B58BD7; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 6px 0; font-family: 'Plus Jakarta Sans', sans-serif;">Connect Campuses.</p>
        <p style="font-size: 12px; color: #FAF7FC; font-weight: 600; margin: 0 0 8px 0; font-family: 'Inter', sans-serif;">Schools. Universities. Students. Opportunities.</p>
        <p style="font-size: 12px; color: #D8C3E5; margin: 0; max-width: 480px; display: inline-block; line-height: 1.5; font-family: 'Inter', sans-serif;">
          Campus Square™ is a multi-location education and university fair series hosted at different schools, bringing together school leaders, students, parents, universities, educators and education partners.
        </p>
      </div>

      <!-- Two-Column Office & Venue Card -->
      <div style="padding: 18px 20px; background: rgba(255, 255, 255, 0.05); border-radius: 12px; margin-bottom: 22px; border: 1px solid rgba(255, 255, 255, 0.12); text-align: left;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
          <tr>
            <td style="vertical-align: top; width: 50%; padding-right: 14px;">
              <p style="margin: 0 0 6px 0; font-weight: 800; color: #D8C3E5; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; font-family: 'Plus Jakarta Sans', sans-serif;">Office Address:</p>
              <p style="margin: 0; font-size: 11px; color: #FAF7FC; line-height: 1.55; font-family: 'Inter', sans-serif;">
                21-B, 5th Cross St, Thiru Vi Ka Industrial Estate,<br>
                Indira Nagar, Ramapuram, St.Thomas Mount,<br>
                Chennai, Tamil Nadu 600032
              </p>
            </td>
            <td style="vertical-align: top; width: 50%; padding-left: 14px; border-left: 1px solid rgba(255, 255, 255, 0.12);">
              <p style="margin: 0 0 6px 0; font-weight: 800; color: #D8C3E5; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; font-family: 'Plus Jakarta Sans', sans-serif;">Event Venue:</p>
              <p style="margin: 0; font-size: 11px; color: #FAF7FC; line-height: 1.55; font-family: 'Inter', sans-serif;">
                The Little Kingdom School,<br>
                Theni, Tamil Nadu, India<br>
                Saturday, 24 October 2026<br>
                (1:00 PM - 4:00 PM)
              </p>
            </td>
          </tr>
        </table>
      </div>

      <!-- Contact Links (Individual Unbreakable Glass Pills) -->
      <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 20px auto; width: auto !important; border-collapse: separate;">
        <tr>
          <td align="center" style="padding: 4px 6px;">
            <a href="https://wa.me/918056134455" style="display: inline-block; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 9999px; padding: 7px 14px; color: #FAF7FC; text-decoration: none; font-size: 12px; white-space: nowrap; font-family: 'Inter', sans-serif;">
              <span style="color: #25D366; font-weight: 800;">💬 WhatsApp:</span> <span style="color: #ffffff; font-weight: 600;">+91 80561 34455</span>
            </a>
          </td>
          <td align="center" style="padding: 4px 6px;">
            <a href="mailto:interact@atom-infinity.com" style="display: inline-block; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 9999px; padding: 7px 14px; color: #FAF7FC; text-decoration: none; font-size: 12px; white-space: nowrap; font-family: 'Inter', sans-serif;">
              <span style="color: #B58BD7; font-weight: 800;">✉️ Email:</span> <span style="color: #ffffff; font-weight: 600;">interact@atom-infinity.com</span>
            </a>
          </td>
        </tr>
      </table>

      <!-- Copyright -->
      <div style="padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 11px; color: #8E6E9C; font-family: 'Inter', sans-serif;">
        &copy; ${currentYear} Campus Square™. Connect Campuses. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
    `;

    const transporter = getEmailTransporter();
    const fromAddress = getFromEmailAddress();

    const info = await transporter.sendMail({
      from: fromAddress,
      replyTo: process.env.SMTP_REPLY_TO || fromAddress,
      to,
      subject: `Registration Confirmed: ${eventName}`,
      html: htmlTemplate,
    });

    console.log("Registration email sent: %s", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Error sending registration email:", error);
    return { success: false, error };
  }
};

export interface EnquiryNotificationPayload {
  category: 'University Partnership' | 'Host School Proposal' | 'General Contact Message';
  subjectTitle: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  organizationName?: string;
  designation?: string;
  city?: string;
  details: { label: string; value: string | undefined | null }[];
  notes?: string;
}

export const sendEnquiryNotificationEmail = async (payload: EnquiryNotificationPayload) => {
  const recipient = process.env.ENQUIRY_NOTIFICATION_EMAIL || process.env.ADMIN_NOTIFICATION_EMAIL || 'interact@atom-infinity.com';

  try {
    const detailsRowsHtml = payload.details
      .filter(item => item.value && String(item.value).trim().length > 0)
      .map((item, idx) => `
        <tr style="background-color: ${idx % 2 === 0 ? '#FFFFFF' : '#FAF7FC'};">
          <td style="padding: 12px 18px; border-bottom: 1px solid #E8DCF0; font-size: 13px; font-weight: 700; color: #6B5677; width: 36%; vertical-align: top; font-family: 'Plus Jakarta Sans', sans-serif;">
            ${item.label}
          </td>
          <td style="padding: 12px 18px; border-bottom: 1px solid #E8DCF0; font-size: 13px; color: #22052C; line-height: 1.55; font-weight: 600; vertical-align: top; font-family: 'Inter', sans-serif;">
            ${String(item.value).replace(/\n/g, '<br/>')}
          </td>
        </tr>
      `).join('');

    const parseEmailList = (value?: string): string[] => {
      if (!value) return [];
      return value
        .split(/[,;]+/)
        .map(e => e.trim())
        .filter(e => e.length > 0);
    };

    const ccList = parseEmailList(process.env.ENQUIRY_NOTIFICATION_CC);
    const bccList = parseEmailList(process.env.ENQUIRY_NOTIFICATION_BCC);

    const { baseUrl, colorLogoUrl, whiteLogoUrl, atomLogoUrl, originBiLogoUrl } = getEmailAssetUrls();
    const currentYear = new Date().getFullYear();
    const formattedDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' });

    let categoryBadgeBg = 'rgba(181, 139, 215, 0.22)';
    let categoryBadgeColor = '#FAF7FC';
    let categoryBadgeBorder = '#B58BD7';
    let categoryIcon = '🎓';

    if (payload.category === 'Host School Proposal') {
      categoryBadgeBg = 'rgba(142, 35, 186, 0.35)';
      categoryBadgeColor = '#FAF7FC';
      categoryBadgeBorder = '#A855F7';
      categoryIcon = '🏫';
    } else if (payload.category === 'General Contact Message') {
      categoryBadgeBg = 'rgba(112, 26, 148, 0.35)';
      categoryBadgeColor = '#FAF7FC';
      categoryBadgeBorder = '#B58BD7';
      categoryIcon = '✉️';
    }

    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${payload.subjectTitle}</title>
  <!-- Google Fonts: Plus Jakarta Sans & Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet" type="text/css">
  <!--[if mso]>
  <style type="text/css">
    body, table, td, p, a, span { font-family: 'Segoe UI', Arial, sans-serif !important; }
    h1, h2, h3, h4 { font-family: 'Segoe UI', Arial, sans-serif !important; font-weight: bold !important; }
  </style>
  <![endif]-->
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');

    body, p, td, div, span, a, li {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    h1, h2, h3, h4, h5, h6, .brand-font, .heading-font {
      font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
      letter-spacing: -0.015em;
    }
    .wrapper { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 18px; overflow: hidden; border: 1px solid #E8DCF0; box-shadow: 0 12px 36px rgba(34, 5, 44, 0.08); }
    .top-navbar { background-color: #ffffff; padding: 18px 28px; border-bottom: 1px solid #E8DCF0; }
    .hero { background: linear-gradient(135deg, #180421 0%, #22052C 50%, #3B0D4E 100%); padding: 32px 32px 28px 32px; text-align: left; border-bottom: 3px solid #701A94; color: #ffffff; }
    .badge { display: inline-block; background-color: ${categoryBadgeBg}; color: ${categoryBadgeColor}; border: 1px solid ${categoryBadgeBorder}; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 6px 14px; border-radius: 9999px; margin-bottom: 12px; font-family: 'Plus Jakarta Sans', sans-serif; }
    .title { color: #ffffff; font-size: 22px; font-weight: 800; margin: 0 0 6px 0; line-height: 1.35; font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif; }
    .subtitle { color: #D8C3E5; font-size: 12px; margin: 0; line-height: 1.5; font-family: 'Inter', sans-serif; }
    .body-content { padding: 32px; }
    .sender-card { background: #FAF7FC; border: 1px solid #E8DCF0; border-radius: 14px; padding: 24px; margin-bottom: 26px; }
    .sender-name { font-size: 20px; font-weight: 800; color: #22052C; margin: 0 0 4px 0; font-family: 'Plus Jakarta Sans', sans-serif; }
    .sender-meta { font-size: 13px; color: #6B5677; margin: 0 0 16px 0; line-height: 1.45; font-family: 'Inter', sans-serif; }
    .contact-links { font-size: 13px; color: #22052C; line-height: 1.8; margin-bottom: 20px; font-family: 'Inter', sans-serif; }
    .table-container { border: 1px solid #E8DCF0; border-radius: 12px; overflow: hidden; margin-top: 12px; }
    .breakdown-table { width: 100%; border-collapse: collapse; }
    .section-heading { font-size: 13px; font-weight: 800; color: #22052C; text-transform: uppercase; letter-spacing: 0.8px; margin: 0 0 10px 0; font-family: 'Plus Jakarta Sans', sans-serif; }
    .notes-box { margin-top: 24px; padding: 18px 20px; background-color: #FAF7FC; border-left: 4px solid #701A94; border-radius: 8px; border: 1px solid #E8DCF0; }
    .collab-banner { background: #FAF7FC; border: 1px solid #E8DCF0; border-radius: 14px; padding: 24px; margin-top: 28px; text-align: center; }
    .footer { background: #22052C; padding: 36px 28px; text-align: center; color: #B58BD7; font-size: 12px; line-height: 1.6; }
    .footer a { color: #FAF7FC; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF7FC; margin: 0; padding: 24px 12px;">
  <div class="wrapper">
    <!-- Top Brand Navbar: Campus Square™ Logo (Left) + Atom Infinity ✕ OriginBI Logos (Right) -->
    <div class="top-navbar">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
        <tr>
          <td align="left" style="vertical-align: middle;">
            <img src="${colorLogoUrl}" alt="Campus Square™" style="height: 38px; width: auto; max-width: 200px; display: block; border: 0;" />
          </td>
          <td align="right" style="vertical-align: middle;">
            <table align="right" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; background-color: #FAF7FC; border: 1px solid #E8DCF0; border-radius: 12px; padding: 5px 12px; box-shadow: 0 2px 6px rgba(34, 5, 44, 0.04);">
              <tr>
                <td style="font-size: 10px; font-weight: 700; color: #6B5677; text-transform: uppercase; letter-spacing: 0.5px; padding-right: 8px; vertical-align: middle; font-family: 'Plus Jakarta Sans', sans-serif;">
                  Joint Collaboration:
                </td>
                <td align="center" style="vertical-align: middle; padding: 0 4px;">
                  <img src="${atomLogoUrl}" alt="Atom Infinity" style="height: 20px; width: auto; max-width: 75px; display: block; border: 0;" />
                </td>
                <td align="center" style="font-size: 12px; font-weight: 800; color: #701A94; padding: 0 5px; vertical-align: middle; line-height: 1;">
                  ✕
                </td>
                <td align="center" style="vertical-align: middle; padding: 0 4px;">
                  <img src="${originBiLogoUrl}" alt="OriginBI Mindworks" style="height: 20px; width: auto; max-width: 75px; display: block; border: 0;" />
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>

    <!-- Hero Header Banner (Matches Website Hero Dark Fair Theme) -->
    <div class="hero">
      <!-- Category Badge -->
      <div>
        <span class="badge">${categoryIcon} ${payload.category}</span>
      </div>

      <h1 class="title">${payload.subjectTitle}</h1>
      <p class="subtitle">Campus Square™ Management Notification • Received: ${formattedDate} IST</p>
    </div>

    <!-- Body -->
    <div class="body-content">
      <!-- Sender Highlight Card -->
      <div class="sender-card">
        <h3 class="sender-name">${payload.senderName}</h3>
        <p class="sender-meta">
          ${payload.designation ? `<strong>${payload.designation}</strong>` : ''}
          ${payload.organizationName ? ` at <strong>${payload.organizationName}</strong>` : ''}
          ${payload.city ? ` • ${payload.city}` : ''}
        </p>

        <div class="contact-links">
          <div><strong>✉️ Email:</strong> <a href="mailto:${payload.senderEmail}" style="color: #701A94; font-weight: 700; text-decoration: underline;">${payload.senderEmail}</a></div>
          ${payload.senderPhone ? `<div><strong>📞 Phone / WhatsApp:</strong> <a href="tel:${payload.senderPhone}" style="color: #701A94; font-weight: 700; text-decoration: underline;">${payload.senderPhone}</a></div>` : ''}
        </div>

        <!-- Bulletproof Buttons (Table-based layout ensures 100% white text across all email clients) -->
        <table border="0" cellspacing="0" cellpadding="0" style="margin-top: 14px; width: auto !important; border-collapse: separate;">
          <tr>
            <td align="center" style="border-radius: 9999px; background-color: #701A94; padding: 0;" bgcolor="#701A94">
              <a href="mailto:${payload.senderEmail}?subject=Re: Campus Square™ - ${encodeURIComponent(payload.organizationName || payload.senderName)}" style="display: inline-block; background-color: #701A94; color: #ffffff !important; text-decoration: none !important; font-weight: 700; font-size: 13px; padding: 11px 22px; border-radius: 9999px; border: 1px solid #701A94; -webkit-text-fill-color: #ffffff; font-family: 'Plus Jakarta Sans', sans-serif;">
                <font color="#ffffff" style="color: #ffffff !important; text-decoration: none !important;">
                  <span style="color: #ffffff !important; text-decoration: none !important; font-weight: 700;">✉️ Reply Directly</span>
                </font>
              </a>
            </td>
            ${payload.senderPhone ? `
            <td width="10" style="width: 10px;"></td>
            <td align="center" style="border-radius: 9999px; background-color: #16A66A; padding: 0;" bgcolor="#16A66A">
              <a href="https://wa.me/${payload.senderPhone.replace(/[^0-9]/g, '')}" target="_blank" style="display: inline-block; background-color: #16A66A; color: #ffffff !important; text-decoration: none !important; font-weight: 700; font-size: 13px; padding: 11px 22px; border-radius: 9999px; border: 1px solid #16A66A; -webkit-text-fill-color: #ffffff; font-family: 'Plus Jakarta Sans', sans-serif;">
                <font color="#ffffff" style="color: #ffffff !important; text-decoration: none !important;">
                  <span style="color: #ffffff !important; text-decoration: none !important; font-weight: 700;">💬 WhatsApp Chat</span>
                </font>
              </a>
            </td>
            ` : ''}
          </tr>
        </table>
      </div>

      <!-- Submitted Information Table -->
      <h4 class="section-heading">Submission Breakdown</h4>
      <div class="table-container">
        <table class="breakdown-table" cellpadding="0" cellspacing="0" border="0">
          <tbody>
            ${detailsRowsHtml}
          </tbody>
        </table>
      </div>

      <!-- Message / Notes Box -->
      ${payload.notes ? `
        <div class="notes-box">
          <h4 style="margin: 0 0 6px 0; font-size: 12px; font-weight: 800; color: #701A94; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Plus Jakarta Sans', sans-serif;">Message / Additional Notes:</h4>
          <p style="margin: 0; font-size: 14px; color: #22052C; line-height: 1.6; font-family: 'Inter', sans-serif;">${String(payload.notes).replace(/\n/g, '<br/>')}</p>
        </div>
      ` : ''}
    </div>

    <!-- Top Accent Gradient Stripe -->
    <div style="background: linear-gradient(90deg, #701A94 0%, #8E23BA 50%, #B58BD7 100%); height: 4px;"></div>

    <!-- Official Brand Footer (Matches Website Footer) -->
    <div class="footer">
      <div style="margin-bottom: 20px;">
        <img src="${whiteLogoUrl}" alt="Campus Square™" style="max-height: 36px; max-width: 190px; display: block; margin: 0 auto 12px auto; border: 0;" />
        <p style="font-size: 11px; color: #B58BD7; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 6px 0; font-family: 'Plus Jakarta Sans', sans-serif;">Connect Campuses.</p>
        <p style="font-size: 12px; color: #FAF7FC; font-weight: 600; margin: 0 0 8px 0; font-family: 'Inter', sans-serif;">Schools. Universities. Students. Opportunities.</p>
        <p style="font-size: 12px; color: #D8C3E5; margin: 0; max-width: 480px; display: inline-block; line-height: 1.5; font-family: 'Inter', sans-serif;">
          Campus Square™ is a multi-location education and university fair series hosted at different schools, bringing together school leaders, students, parents, universities, educators and education partners.
        </p>
      </div>

      <!-- Two-Column Office & Venue Card -->
      <div style="padding: 18px 20px; background: rgba(255, 255, 255, 0.05); border-radius: 12px; margin-bottom: 22px; border: 1px solid rgba(255, 255, 255, 0.12); text-align: left;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
          <tr>
            <td style="vertical-align: top; width: 50%; padding-right: 14px;">
              <p style="margin: 0 0 6px 0; font-weight: 800; color: #D8C3E5; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; font-family: 'Plus Jakarta Sans', sans-serif;">Office Address:</p>
              <p style="margin: 0; font-size: 11px; color: #FAF7FC; line-height: 1.55; font-family: 'Inter', sans-serif;">
                21-B, 5th Cross St, Thiru Vi Ka Industrial Estate,<br>
                Indira Nagar, Ramapuram, St.Thomas Mount,<br>
                Chennai, Tamil Nadu 600032
              </p>
            </td>
            <td style="vertical-align: top; width: 50%; padding-left: 14px; border-left: 1px solid rgba(255, 255, 255, 0.12);">
              <p style="margin: 0 0 6px 0; font-weight: 800; color: #D8C3E5; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; font-family: 'Plus Jakarta Sans', sans-serif;">Event Venue:</p>
              <p style="margin: 0; font-size: 11px; color: #FAF7FC; line-height: 1.55; font-family: 'Inter', sans-serif;">
                The Little Kingdom School,<br>
                Theni, Tamil Nadu, India<br>
                Saturday, 24 October 2026<br>
                (1:00 PM - 4:00 PM)
              </p>
            </td>
          </tr>
        </table>
      </div>

      <!-- Contact Links (Individual Unbreakable Glass Pills) -->
      <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 20px auto; width: auto !important; border-collapse: separate;">
        <tr>
          <td align="center" style="padding: 4px 6px;">
            <a href="https://wa.me/918056134455" style="display: inline-block; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 9999px; padding: 7px 14px; color: #FAF7FC; text-decoration: none; font-size: 12px; white-space: nowrap; font-family: 'Inter', sans-serif;">
              <span style="color: #25D366; font-weight: 800;">💬 WhatsApp:</span> <span style="color: #ffffff; font-weight: 600;">+91 80561 34455</span>
            </a>
          </td>
          <td align="center" style="padding: 4px 6px;">
            <a href="mailto:interact@atom-infinity.com" style="display: inline-block; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 9999px; padding: 7px 14px; color: #FAF7FC; text-decoration: none; font-size: 12px; white-space: nowrap; font-family: 'Inter', sans-serif;">
              <span style="color: #B58BD7; font-weight: 800;">✉️ Email:</span> <span style="color: #ffffff; font-weight: 600;">interact@atom-infinity.com</span>
            </a>
          </td>
        </tr>
      </table>

      <!-- Copyright -->
      <div style="padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 11px; color: #8E6E9C; font-family: 'Inter', sans-serif;">
        &copy; ${currentYear} Campus Square™. Connect Campuses. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
    `;

    const transporter = getEmailTransporter();
    const fromAddress = getFromEmailAddress();

    const mailOptions: nodemailer.SendMailOptions = {
      from: fromAddress,
      replyTo: payload.senderEmail,
      to: recipient,
      subject: `[Campus Square™] New ${payload.category}: ${payload.organizationName || payload.senderName}`,
      html: htmlTemplate,
    };

    if (ccList.length > 0) {
      mailOptions.cc = ccList;
    }

    if (bccList.length > 0) {
      mailOptions.bcc = bccList;
    }

    const info = await transporter.sendMail(mailOptions);

    console.log(`[Email] Enquiry notification sent to ${recipient} (CC: ${ccList.join(', ') || 'none'}, BCC: ${bccList.join(', ') || 'none'}) (messageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[Email] Failed to send enquiry notification to ${recipient}:`, err);
    return { success: false, error: err };
  }
};

export interface EnquiryAcknowledgementPayload {
  category: 'University Partnership' | 'Host School Proposal' | 'General Contact Message';
  recipientName: string;
  recipientEmail: string;
  organizationName?: string;
  enquiryId?: string;
  details: { label: string; value: string | undefined | null }[];
}

export const sendEnquiryAcknowledgementEmail = async (payload: EnquiryAcknowledgementPayload) => {
  try {
    const { baseUrl, colorLogoUrl, whiteLogoUrl, atomLogoUrl, originBiLogoUrl } = getEmailAssetUrls();
    const currentYear = new Date().getFullYear();

    const detailsRowsHtml = payload.details
      .filter(item => item.value && String(item.value).trim().length > 0)
      .map((item, idx) => `
        <tr style="background-color: ${idx % 2 === 0 ? '#FFFFFF' : '#FAF7FC'};">
          <td style="padding: 10px 16px; border-bottom: 1px solid #E8DCF0; font-size: 13px; font-weight: 700; color: #6B5677; width: 38%; vertical-align: top; font-family: 'Plus Jakarta Sans', sans-serif;">
            ${item.label}
          </td>
          <td style="padding: 10px 16px; border-bottom: 1px solid #E8DCF0; font-size: 13px; color: #22052C; line-height: 1.5; font-weight: 600; vertical-align: top; font-family: 'Inter', sans-serif;">
            ${String(item.value).replace(/\n/g, '<br/>')}
          </td>
        </tr>
      `).join('');

    let subject = `Thank you for contacting Campus Square™`;
    let headingText = `Thank you, ${payload.recipientName}!`;
    let introText = `We have received your message and will get back to you shortly.`;

    if (payload.category === 'University Partnership') {
      subject = `Thank you for partnering with Campus Square™${payload.organizationName ? ` - ${payload.organizationName}` : ''}`;
      headingText = `Thank you for your Partnership Inquiry!`;
      introText = `We are delighted by your interest in collaborating with <strong>Campus Square™</strong> for ${payload.organizationName ? `<strong>${payload.organizationName}</strong>` : 'your institution'}. Our Higher Education Directorate has received your proposal.`;
    } else if (payload.category === 'Host School Proposal') {
      subject = `Thank you for your School Hosting Proposal - Campus Square™`;
      headingText = `Thank you for your School Hosting Proposal!`;
      introText = `We have received your proposal to host a Campus Square™ Edition at ${payload.organizationName ? `<strong>${payload.organizationName}</strong>` : 'your esteemed school'}. Our School Coordination team is reviewing your submission.`;
    }

    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <!-- Google Fonts: Plus Jakarta Sans & Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet" type="text/css">
  <!--[if mso]>
  <style type="text/css">
    body, table, td, p, a, span { font-family: 'Segoe UI', Arial, sans-serif !important; }
    h1, h2, h3, h4 { font-family: 'Segoe UI', Arial, sans-serif !important; font-weight: bold !important; }
  </style>
  <![endif]-->
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');

    body, p, td, div, span, a, li {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    h1, h2, h3, h4, h5, h6, .brand-font, .heading-font {
      font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
      letter-spacing: -0.015em;
    }
    .wrapper { max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 18px; overflow: hidden; border: 1px solid #E8DCF0; box-shadow: 0 12px 36px rgba(34, 5, 44, 0.08); }
    .top-navbar { background-color: #ffffff; padding: 18px 28px; border-bottom: 1px solid #E8DCF0; }
    .hero { background: linear-gradient(135deg, #180421 0%, #22052C 50%, #3B0D4E 100%); padding: 36px 32px; text-align: center; border-bottom: 3px solid #701A94; color: #ffffff; }
    .content { padding: 32px 32px; }
    .step-card { background: #FAF7FC; border: 1px solid #E8DCF0; border-radius: 14px; padding: 22px; margin-bottom: 24px; }
    .table-container { border: 1px solid #E8DCF0; border-radius: 12px; overflow: hidden; margin: 14px 0 24px 0; }
    .breakdown-table { width: 100%; border-collapse: collapse; }
    .collab-banner { background: #FAF7FC; border: 1px solid #E8DCF0; border-radius: 14px; padding: 22px; margin-top: 24px; text-align: center; }
    .footer { background: #22052C; padding: 36px 28px; text-align: center; color: #B58BD7; font-size: 12px; line-height: 1.6; }
    .footer a { color: #FAF7FC; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF7FC; margin: 0; padding: 24px 12px;">
  <div class="wrapper">
    <!-- Top Brand Navbar: Campus Square™ Logo (Left) + Atom Infinity ✕ OriginBI Logos (Right) -->
    <div class="top-navbar">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
        <tr>
          <td align="left" style="vertical-align: middle;">
            <img src="${colorLogoUrl}" alt="Campus Square™" style="height: 38px; width: auto; max-width: 200px; display: block; border: 0;" />
          </td>
          <td align="right" style="vertical-align: middle;">
            <table align="right" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; background-color: #FAF7FC; border: 1px solid #E8DCF0; border-radius: 12px; padding: 5px 12px; box-shadow: 0 2px 6px rgba(34, 5, 44, 0.04);">
              <tr>
                <td style="font-size: 10px; font-weight: 700; color: #6B5677; text-transform: uppercase; letter-spacing: 0.5px; padding-right: 8px; vertical-align: middle; font-family: 'Plus Jakarta Sans', sans-serif;">
                  Joint Collaboration:
                </td>
                <td align="center" style="vertical-align: middle; padding: 0 4px;">
                  <img src="${atomLogoUrl}" alt="Atom Infinity" style="height: 20px; width: auto; max-width: 75px; display: block; border: 0;" />
                </td>
                <td align="center" style="font-size: 12px; font-weight: 800; color: #701A94; padding: 0 5px; vertical-align: middle; line-height: 1;">
                  ✕
                </td>
                <td align="center" style="vertical-align: middle; padding: 0 4px;">
                  <img src="${originBiLogoUrl}" alt="OriginBI Mindworks" style="height: 20px; width: auto; max-width: 75px; display: block; border: 0;" />
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>

    <!-- Hero Header Banner -->
    <div class="hero">
      <div style="display: inline-block; background-color: #16A66A; color: #ffffff; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 6px 16px; border-radius: 9999px; margin-bottom: 14px; font-family: 'Plus Jakarta Sans', sans-serif;">
        ✓ Submission Received
      </div>
      <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0 0 8px 0; font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif;">
        ${headingText}
      </h1>
      <p style="color: #D8C3E5; font-size: 13px; margin: 0; line-height: 1.5; font-family: 'Inter', -apple-system, sans-serif;">
        Campus Square™ Directorate • Where Education Meets Opportunity
      </p>
    </div>

    <!-- Main Content -->
    <div class="content">
      <p style="color: #22052C; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0; font-family: 'Inter', sans-serif;">
        Dear <strong>${payload.recipientName}</strong>,
      </p>
      <p style="color: #4A3B52; font-size: 14px; line-height: 1.65; margin: 0 0 24px 0; font-family: 'Inter', sans-serif;">
        ${introText}
      </p>

      <!-- Next Steps Process Box -->
      <div class="step-card">
        <h3 style="margin: 0 0 14px 0; color: #22052C; font-size: 15px; font-weight: 800; font-family: 'Plus Jakarta Sans', sans-serif; text-transform: uppercase; letter-spacing: 0.5px;">
          What Happens Next?
        </h3>
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="vertical-align: top; width: 28px; padding-bottom: 12px; font-size: 16px;">1️⃣</td>
            <td style="vertical-align: top; padding-bottom: 12px; font-size: 13px; color: #4A3B52; line-height: 1.5; font-family: 'Inter', sans-serif;">
              <strong style="color: #22052C;">Review & Assessment:</strong> Our Operations Directorate is reviewing your preferences and event scheduling parameters.
            </td>
          </tr>
          <tr>
            <td style="vertical-align: top; width: 28px; padding-bottom: 12px; font-size: 16px;">2️⃣</td>
            <td style="vertical-align: top; padding-bottom: 12px; font-size: 13px; color: #4A3B52; line-height: 1.5; font-family: 'Inter', sans-serif;">
              <strong style="color: #22052C;">Direct Outreach:</strong> A dedicated Partnership Officer will connect with you via phone or email within <strong style="color: #701A94;">24 to 48 business hours</strong>.
            </td>
          </tr>
          <tr>
            <td style="vertical-align: top; width: 28px; font-size: 16px;">3️⃣</td>
            <td style="vertical-align: top; font-size: 13px; color: #4A3B52; line-height: 1.5; font-family: 'Inter', sans-serif;">
              <strong style="color: #22052C;">Partnership Finalization:</strong> We will provide detailed fair floorplans, student demographic profiles, and booth allocations.
            </td>
          </tr>
        </table>
      </div>

      <!-- Submission Summary Table -->
      <h4 style="font-size: 13px; font-weight: 800; color: #22052C; text-transform: uppercase; letter-spacing: 0.8px; margin: 0 0 10px 0; font-family: 'Plus Jakarta Sans', sans-serif;">
        Copy of Your Submission:
      </h4>
      <div class="table-container">
        <table class="breakdown-table" cellpadding="0" cellspacing="0" border="0">
          <tbody>
            ${detailsRowsHtml}
          </tbody>
        </table>
      </div>

      <!-- Urgent Assistance CTA -->
      <div style="background-color: #FAF7FC; border: 1px solid #E8DCF0; border-radius: 12px; padding: 18px; text-align: center;">
        <p style="margin: 0 0 10px 0; font-size: 13px; color: #6B5677; font-weight: 600; font-family: 'Inter', sans-serif;">
          Need immediate assistance or have urgent scheduling questions?
        </p>
        <table align="center" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto; width: auto !important; border-collapse: separate;">
          <tr>
            <td align="center" style="border-radius: 9999px; background-color: #16A66A; padding: 0;" bgcolor="#16A66A">
              <a href="https://wa.me/918056134455" target="_blank" style="display: inline-block; background-color: #16A66A; color: #ffffff !important; text-decoration: none !important; font-weight: 700; font-size: 13px; padding: 9px 20px; border-radius: 9999px; border: 1px solid #16A66A; -webkit-text-fill-color: #ffffff; font-family: 'Plus Jakarta Sans', sans-serif;">
                <font color="#ffffff" style="color: #ffffff !important; text-decoration: none !important;">
                  <span style="color: #ffffff !important; text-decoration: none !important; font-weight: 700;">💬 Chat on WhatsApp: +91 80561 34455</span>
                </font>
              </a>
            </td>
          </tr>
        </table>
      </div>

      <!-- Institutional Co-Branding Banner -->
      <div class="collab-banner">
        <div style="display: inline-block; padding: 4px 12px; border-radius: 9999px; background-color: rgba(112, 26, 148, 0.08); color: #701A94; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; font-family: 'Plus Jakarta Sans', sans-serif;">
          Joint Collaboration
        </div>
        <h4 style="font-size: 14px; font-weight: 800; color: #22052C; margin: 0 0 10px 0; font-family: 'Plus Jakarta Sans', sans-serif;">
          Campus Square™ - A University Fair Series, a joint collaboration by Atom Infinity and Origin Bi
        </h4>
        <p style="margin: 0; font-size: 12px; color: #6B5677; font-weight: 500; line-height: 1.55; font-family: 'Inter', sans-serif; max-width: 480px; display: inline-block;">
          Committed to empowering school leaders, students, and university partners with future-focused insights, data-driven innovation and transformative opportunities.
        </p>
      </div>
    </div>

    <!-- Top Accent Gradient Stripe -->
    <div style="background: linear-gradient(90deg, #701A94 0%, #8E23BA 50%, #B58BD7 100%); height: 4px;"></div>

    <!-- Official Brand Footer -->
    <div class="footer">
      <div style="margin-bottom: 20px;">
        <img src="${whiteLogoUrl}" alt="Campus Square™" style="max-height: 36px; max-width: 190px; display: block; margin: 0 auto 12px auto; border: 0;" />
        <p style="font-size: 11px; color: #B58BD7; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 6px 0; font-family: 'Plus Jakarta Sans', sans-serif;">Connect Campuses.</p>
        <p style="font-size: 12px; color: #FAF7FC; font-weight: 600; margin: 0 0 8px 0; font-family: 'Inter', sans-serif;">Schools. Universities. Students. Opportunities.</p>
        <p style="font-size: 12px; color: #D8C3E5; margin: 0; max-width: 480px; display: inline-block; line-height: 1.5; font-family: 'Inter', sans-serif;">
          Campus Square™ is a multi-location education and university fair series hosted at different schools, bringing together school leaders, students, parents, universities, educators and education partners.
        </p>
      </div>

      <!-- Two-Column Office & Venue Card -->
      <div style="padding: 18px 20px; background: rgba(255, 255, 255, 0.05); border-radius: 12px; margin-bottom: 22px; border: 1px solid rgba(255, 255, 255, 0.12); text-align: left;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
          <tr>
            <td style="vertical-align: top; width: 50%; padding-right: 14px;">
              <p style="margin: 0 0 6px 0; font-weight: 800; color: #D8C3E5; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; font-family: 'Plus Jakarta Sans', sans-serif;">Office Address:</p>
              <p style="margin: 0; font-size: 11px; color: #FAF7FC; line-height: 1.55; font-family: 'Inter', sans-serif;">
                21-B, 5th Cross St, Thiru Vi Ka Industrial Estate,<br>
                Indira Nagar, Ramapuram, St.Thomas Mount,<br>
                Chennai, Tamil Nadu 600032
              </p>
            </td>
            <td style="vertical-align: top; width: 50%; padding-left: 14px; border-left: 1px solid rgba(255, 255, 255, 0.12);">
              <p style="margin: 0 0 6px 0; font-weight: 800; color: #D8C3E5; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; font-family: 'Plus Jakarta Sans', sans-serif;">Event Venue:</p>
              <p style="margin: 0; font-size: 11px; color: #FAF7FC; line-height: 1.55; font-family: 'Inter', sans-serif;">
                The Little Kingdom School,<br>
                Theni, Tamil Nadu, India<br>
                Saturday, 24 October 2026<br>
                (1:00 PM - 4:00 PM)
              </p>
            </td>
          </tr>
        </table>
      </div>

      <!-- Contact Links (Individual Unbreakable Glass Pills) -->
      <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 20px auto; width: auto !important; border-collapse: separate;">
        <tr>
          <td align="center" style="padding: 4px 6px;">
            <a href="https://wa.me/918056134455" style="display: inline-block; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 9999px; padding: 7px 14px; color: #FAF7FC; text-decoration: none; font-size: 12px; white-space: nowrap; font-family: 'Inter', sans-serif;">
              <span style="color: #25D366; font-weight: 800;">💬 WhatsApp:</span> <span style="color: #ffffff; font-weight: 600;">+91 80561 34455</span>
            </a>
          </td>
          <td align="center" style="padding: 4px 6px;">
            <a href="mailto:interact@atom-infinity.com" style="display: inline-block; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 9999px; padding: 7px 14px; color: #FAF7FC; text-decoration: none; font-size: 12px; white-space: nowrap; font-family: 'Inter', sans-serif;">
              <span style="color: #B58BD7; font-weight: 800;">✉️ Email:</span> <span style="color: #ffffff; font-weight: 600;">interact@atom-infinity.com</span>
            </a>
          </td>
        </tr>
      </table>

      <!-- Copyright -->
      <div style="padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 11px; color: #8E6E9C; font-family: 'Inter', sans-serif;">
        &copy; ${currentYear} Campus Square™. Connect Campuses. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
    `;

    const transporter = getEmailTransporter();
    const fromAddress = getFromEmailAddress();

    const info = await transporter.sendMail({
      from: fromAddress,
      to: payload.recipientEmail,
      subject,
      html: htmlTemplate,
    });

    console.log(`[Email] Thank you acknowledgement sent to ${payload.recipientEmail} (messageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[Email] Failed to send thank you acknowledgement to ${payload.recipientEmail}:`, err);
    return { success: false, error: err };
  }
};



