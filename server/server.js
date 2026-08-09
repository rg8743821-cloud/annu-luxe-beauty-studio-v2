/* ==========================================================================
   ANNU'S LUXE BEAUTY STUDIO — EXPRESS SERVER (Part 2)
   Serves the existing static frontend (public/ + pages/) and exposes
   JSON APIs for the booking form and contact form, sending emails via
   Nodemailer. No frontend files are modified by this server; it only
   serves them and answers API requests.
   ========================================================================== */

require('dotenv').config();

console.log("MAIL_HOST =", process.env.MAIL_HOST);
console.log("MAIL_PORT =", process.env.MAIL_PORT);
console.log("MAIL_USER =", process.env.MAIL_USER);
console.log("MAIL_FROM =", process.env.MAIL_FROM);
console.log("MAIL_PASS Exists =", !!process.env.MAIL_PASS);

const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { validateBooking, validateContact, isHoneypotTripped } = require('./utils/validate');
const {
  sendMail,
  bookingOwnerEmail,
  bookingCustomerEmail,
  contactOwnerEmail,
  contactCustomerEmail
} = require('./utils/mailer');

const app = express();
const PORT = process.env.PORT || 3000;
const PROJECT_ROOT = path.join(__dirname, '..');

/* ---------------- Core middleware ---------------- */
app.use(cors());
app.use(bodyParser.json({ limit: '100kb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100kb' }));

/* ---------------- Static frontend (unchanged files) ----------------
   The existing pages reference assets with relative paths such as
   "css/style.css" (from public/index.html) and "../public/css/style.css"
   (from pages/*.html). Serving the whole project root as static keeps
   every existing link working exactly as-is. */
app.use(express.static(PROJECT_ROOT, { extensions: ['html'] }));

/* Friendly root redirect to the homepage */
app.get('/', (req, res) => {
  res.redirect('/public/index.html');
});

app.get('/google4c422949215b54dd.html', (req, res) => {
  res.sendFile(path.join(PROJECT_ROOT, 'public', 'google4c422949215b54dd.html'));
});


/* ---------------- Security: basic in-memory rate limiter ----------------
   Lightweight, dependency-free throttle for the two public POST endpoints.
   Keyed by IP; resets automatically after the time window. This is not a
   replacement for a dedicated WAF/reverse-proxy limiter in production, but
   it blocks basic scripted spam without adding new dependencies. */
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 8; // max submissions per IP per window
const rateLimitHits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitHits.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitHits.set(ip, { windowStart: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

function formRateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please wait a few minutes before trying again, or call/WhatsApp us directly.'
    });
  }
  next();
}

/* ---------------- API: Booking ---------------- */
app.post('/api/booking', formRateLimiter, async (req, res) => {
  // Silently accept honeypot-tripped (bot) submissions without sending mail
  if (isHoneypotTripped(req.body || {})) {
    return res.status(200).json({
      success: true,
      message: "Thank you! Your appointment request has been received. We'll confirm your slot shortly by phone or WhatsApp."
    });
  }

  const { valid, errors, data } = validateBooking(req.body || {});

  if (!valid) {
    return res.status(400).json({
      success: false,
      message: 'Please correct the highlighted fields and try again.',
      errors
    });
  }

  try {


    return res.status(200).json({
      success: true,
      message: "Thank you! Your appointment request has been received. We'll confirm your slot shortly by phone or WhatsApp."
    });
  } catch (err) {
    console.error("Booking FULL ERROR:", err);
    return res.status(500).json({
      success: false,
      message: 'Sorry, something went wrong while sending your request. Please call or WhatsApp us directly at +91 63896 30821.'
    });
  }
});

/* ---------------- API: Contact ---------------- */
app.post('/api/contact', formRateLimiter, async (req, res) => {
  // Silently accept honeypot-tripped (bot) submissions without sending mail
  if (isHoneypotTripped(req.body || {})) {
    return res.status(200).json({
      success: true,
      message: "Thank you for reaching out! We've received your message and will get back to you shortly."
    });
  }

  const { valid, errors, data } = validateContact(req.body || {});

  if (!valid) {
    return res.status(400).json({
      success: false,
      message: 'Please correct the highlighted fields and try again.',
      errors
    });
  }

  try {
    await sendMail({
      to: process.env.MAIL_TO,
      subject: `New Enquiry from ${data.name}`,
      html: contactOwnerEmail(data),
      replyTo: data.email
    });

    await sendMail({
      to: data.email,
      subject: "We've Received Your Message — Annu's Luxe Beauty Studio",
      html: contactCustomerEmail(data)
    });

    return res.status(200).json({
      success: true,
      message: "Thank you for reaching out! We've received your message and will get back to you shortly."
    });
  } catch (err) {
    console.error("Contact FULL ERROR:", err);
    return res.status(500).json({
      success: false,
      message: 'Sorry, something went wrong while sending your message. Please call or WhatsApp us directly at +91 63896 30821.'
    });
  }
});

/* ---------------- 404 for unknown API routes ---------------- */
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'Not found.' });
});

/* ---------------- Generic error handler ---------------- */
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error('Unhandled server error:', err);
  res.status(500).json({ success: false, message: 'Unexpected server error. Please try again later.' });
});

app.listen(PORT, () => {
  console.log(`✨ Annu's Luxe Beauty Studio server running at http://localhost:${PORT}`);
  console.log(`   Homepage: http://localhost:${PORT}/public/index.html`);
});
