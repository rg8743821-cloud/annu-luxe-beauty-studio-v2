/* ==========================================================================
   Validation & sanitization helpers
   Small, dependency-free helpers used to validate and clean form input
   before it is used in emails or logged anywhere.
   ========================================================================== */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Accepts Indian numbers with optional +91/91 prefix and 10-digit local numbers,
// allowing spaces/dashes which are stripped before checking.
const PHONE_RE = /^(?:\+?91)?[6-9]\d{9}$/;

/**
 * Strip HTML tags / angle brackets and trim whitespace so user input can
 * never inject markup into the outgoing emails.
 */
function sanitizeText(value, maxLength) {
  if (typeof value !== 'string') return '';
  let clean = value
    .replace(/<[^>]*>/g, '')   // strip tags
    .replace(/[<>]/g, '')      // strip stray angle brackets
    .trim();
  if (maxLength && clean.length > maxLength) {
    clean = clean.slice(0, maxLength);
  }
  return clean;
}

function isValidEmail(value) {
  return typeof value === 'string' && EMAIL_RE.test(value.trim());
}

function isValidPhone(value) {
  if (typeof value !== 'string') return false;
  const digitsOnly = value.replace(/[\s-]/g, '');
  return PHONE_RE.test(digitsOnly);
}

function isNonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Honeypot spam check — the "website" field is hidden off-screen in the
 * form; real visitors never fill it in, so any non-empty value here is
 * treated as an automated/spam submission.
 */
function isHoneypotTripped(body) {
  return typeof body.website === 'string' && body.website.trim().length > 0;
}

/**
 * Validates the booking form payload.
 * Returns { valid: boolean, errors: { field: message }, data: cleanedData }
 */
function validateBooking(body) {
  const errors = {};
  const data = {
    name: sanitizeText(body.name, 100),
    phone: sanitizeText(body.phone, 20),
    email: sanitizeText(body.email, 150),
    service: sanitizeText(body.service, 100),
    date: sanitizeText(body.date, 20),
    time: sanitizeText(body.time, 40),
    address: sanitizeText(body.address, 300),
    message: sanitizeText(body.message, 600)
  };

  if (!isNonEmpty(data.name) || data.name.length < 2) {
    errors.name = 'Please enter your full name.';
  }
  if (!isValidPhone(data.phone)) {
    errors.phone = 'Please enter a valid 10-digit Indian phone number.';
  }
  if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!isNonEmpty(data.service)) {
    errors.service = 'Please select a service.';
  }
  if (!isNonEmpty(data.date)) {
    errors.date = 'Please select a preferred date.';
  }
  if (!isNonEmpty(data.time)) {
    errors.time = 'Please select a preferred time slot.';
  }
  if (!isNonEmpty(data.address) || data.address.length < 5) {
    errors.address = 'Please enter your full home address.';
  }

  return { valid: Object.keys(errors).length === 0, errors, data };
}

/**
 * Validates the contact form payload.
 */
function validateContact(body) {
  const errors = {};
  const data = {
    name: sanitizeText(body.name, 100),
    phone: sanitizeText(body.phone, 20),
    email: sanitizeText(body.email, 150),
    service: sanitizeText(body.service, 100),
    message: sanitizeText(body.message, 800)
  };

  if (!isNonEmpty(data.name) || data.name.length < 2) {
    errors.name = 'Please enter your full name.';
  }
  if (!isValidPhone(data.phone)) {
    errors.phone = 'Please enter a valid 10-digit Indian phone number.';
  }
  if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!isNonEmpty(data.message) || data.message.length < 5) {
    errors.message = 'Please enter a short message so we know how to help.';
  }

  return { valid: Object.keys(errors).length === 0, errors, data };
}

module.exports = {
  sanitizeText,
  isValidEmail,
  isValidPhone,
  isHoneypotTripped,
  validateBooking,
  validateContact
};
