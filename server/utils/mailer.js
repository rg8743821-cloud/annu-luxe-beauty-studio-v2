/* ==========================================================================
   Nodemailer transporter + branded HTML email templates
   ========================================================================== */

const nodemailer = require('nodemailer');

const BRAND = {
  name: "Annu's Luxe Beauty Studio",
  tagline: 'Luxury Home Salon Services at Your Doorstep',
  gold: '#D4AF37',
  goldDark: '#B8952E',
  black: '#111111',
  accent: '#FFF7F2',
  phone: '+91 63896 30821',
  email: 'annugupta0692@gmail.com',
  address: 'Brijesh Vatika Colony, Indirapuram, Ghaziabad, Uttar Pradesh'
};

let transporter = null;

/**
 * Lazily creates (and caches) the Nodemailer transporter using
 * environment variables. Never hardcode credentials here.
 */
function getTransporter() {
  if (transporter) return transporter;

  const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS } = process.env;

  if (!MAIL_HOST || !MAIL_USER || !MAIL_PASS) {
    throw new Error(
      'Email is not configured. Please set MAIL_HOST, MAIL_PORT, MAIL_USER and MAIL_PASS in your .env file.'
    );
  }

  const port = parseInt(MAIL_PORT, 10) || 587;

  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
  return transporter;
}

function emailShell(title, bodyHtml) {
  return `
  <!DOCTYPE html>
  <html>
  <head><meta charset="UTF-8"><title>${title}</title></head>
  <body style="margin:0; padding:0; background:#f4ede1; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4ede1; padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:600px; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 12px 30px -14px rgba(17,17,17,0.25);">
            <tr>
              <td style="background:${BRAND.black}; padding:28px 32px; text-align:center;">
                <div style="font-size:22px; font-weight:700; color:#ffffff; letter-spacing:0.03em;">
                  Annu's <span style="color:${BRAND.gold};">Luxe</span>
                </div>
                <div style="font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:${BRAND.gold}; margin-top:4px;">
                  Beauty Studio
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 32px;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="background:${BRAND.accent}; padding:22px 32px; text-align:center; font-size:12px; color:#767066;">
                <div style="margin-bottom:6px; color:${BRAND.black}; font-weight:600;">${BRAND.name}</div>
                <div>${BRAND.address}</div>
                <div style="margin-top:6px;">
                  <a href="tel:${BRAND.phone.replace(/\s/g, '')}" style="color:${BRAND.goldDark}; text-decoration:none;">${BRAND.phone}</a>
                  &nbsp;·&nbsp;
                  <a href="mailto:${BRAND.email}" style="color:${BRAND.goldDark}; text-decoration:none;">${BRAND.email}</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}

function detailRow(label, value) {
  if (!value) return '';
  return `
    <tr>
      <td style="padding:10px 0; border-bottom:1px dashed #EAE2D6; font-size:13px; color:#767066; width:38%; vertical-align:top;">${label}</td>
      <td style="padding:10px 0; border-bottom:1px dashed #EAE2D6; font-size:14px; color:#111111; font-weight:500;">${value}</td>
    </tr>`;
}

/* ---------------- Booking: owner notification ---------------- */
function bookingOwnerEmail(data) {
  const body = `
    <div style="font-size:12px; letter-spacing:0.12em; text-transform:uppercase; color:${BRAND.goldDark}; font-weight:700; margin-bottom:8px;">New Booking Request</div>
    <h2 style="margin:0 0 18px; color:${BRAND.black}; font-size:20px;">You've received a new appointment request</h2>
    <table role="presentation" width="100%" style="border-collapse:collapse;">
      ${detailRow('Customer Name', data.name)}
      ${detailRow('Phone', data.phone)}
      ${detailRow('Email', data.email)}
      ${detailRow('Service', data.service)}
      ${detailRow('Preferred Date', data.date)}
      ${detailRow('Preferred Time', data.time)}
      ${detailRow('Address', data.address)}
      ${detailRow('Special Request', data.message || '—')}
    </table>
    <p style="margin-top:24px; font-size:13px; color:#767066;">Please confirm this appointment with the customer by phone or WhatsApp as soon as possible.</p>
  `;
  return emailShell('New Booking Request', body);
}

/* ---------------- Booking: customer confirmation ---------------- */
function bookingCustomerEmail(data) {
  const body = `
    <div style="font-size:12px; letter-spacing:0.12em; text-transform:uppercase; color:${BRAND.goldDark}; font-weight:700; margin-bottom:8px;">Booking Received</div>
    <h2 style="margin:0 0 14px; color:${BRAND.black}; font-size:20px;">Thank you, ${data.name}!</h2>
    <p style="font-size:14px; color:#333; line-height:1.7;">
      We've received your appointment request and our team will confirm the final schedule with you shortly by phone or WhatsApp.
    </p>
    <table role="presentation" width="100%" style="border-collapse:collapse; margin-top:20px;">
      ${detailRow('Service', data.service)}
      ${detailRow('Preferred Date', data.date)}
      ${detailRow('Preferred Time', data.time)}
      ${detailRow('Address', data.address)}
    </table>
    <p style="margin-top:24px; font-size:14px; color:#333;">
      Need to change something or have a question in the meantime? Call or WhatsApp us at
      <a href="tel:${BRAND.phone.replace(/\s/g, '')}" style="color:${BRAND.goldDark}; font-weight:600; text-decoration:none;">${BRAND.phone}</a>.
    </p>
    <div style="margin-top:28px; text-align:center;">
      <span style="display:inline-block; padding:12px 28px; background:${BRAND.gold}; color:#fff; border-radius:999px; font-size:13px; font-weight:600;">We can't wait to pamper you ✨</span>
    </div>
  `;
  return emailShell('Booking Received — Annu\'s Luxe Beauty Studio', body);
}

/* ---------------- Contact: owner notification ---------------- */
function contactOwnerEmail(data) {
  const body = `
    <div style="font-size:12px; letter-spacing:0.12em; text-transform:uppercase; color:${BRAND.goldDark}; font-weight:700; margin-bottom:8px;">New Enquiry</div>
    <h2 style="margin:0 0 18px; color:${BRAND.black}; font-size:20px;">You've received a new contact form enquiry</h2>
    <table role="presentation" width="100%" style="border-collapse:collapse;">
      ${detailRow('Name', data.name)}
      ${detailRow('Phone', data.phone)}
      ${detailRow('Email', data.email)}
      ${detailRow('Service Interested In', data.service || '—')}
      ${detailRow('Message', data.message)}
    </table>
  `;
  return emailShell('New Contact Enquiry', body);
}

/* ---------------- Contact: customer acknowledgement ---------------- */
function contactCustomerEmail(data) {
  const body = `
    <div style="font-size:12px; letter-spacing:0.12em; text-transform:uppercase; color:${BRAND.goldDark}; font-weight:700; margin-bottom:8px;">Message Received</div>
    <h2 style="margin:0 0 14px; color:${BRAND.black}; font-size:20px;">Thank you for reaching out, ${data.name}!</h2>
    <p style="font-size:14px; color:#333; line-height:1.7;">
      We've received your message and one of our team members will get back to you shortly.
    </p>
    <table role="presentation" width="100%" style="border-collapse:collapse; margin-top:20px;">
      ${detailRow('Service Interested In', data.service || '—')}
      ${detailRow('Your Message', data.message)}
    </table>
    <p style="margin-top:24px; font-size:14px; color:#333;">
      For an immediate response, call or WhatsApp us at
      <a href="tel:${BRAND.phone.replace(/\s/g, '')}" style="color:${BRAND.goldDark}; font-weight:600; text-decoration:none;">${BRAND.phone}</a>.
    </p>
  `;
  return emailShell('We\'ve Received Your Message — Annu\'s Luxe Beauty Studio', body);
}

async function sendMail({ to, subject, html, replyTo }) {
  const t = getTransporter();
  const from = `"${BRAND.name}" <${process.env.MAIL_USER}>`;

  console.log("Sending email to:", to);

  const info = await t.sendMail({
    from,
    to,
    subject,
    html,
    replyTo
  });

  console.log("Mail sent successfully:", info);

  return info;
}

module.exports = {
  sendMail,
  bookingOwnerEmail,
  bookingCustomerEmail,
  contactOwnerEmail,
  contactCustomerEmail,
  BRAND
};
