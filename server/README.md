# Server (Part 2 — Backend)

This folder contains the Express backend added in Part 2.

Contents:
- `server.js` — Express app: serves the existing static frontend
  (`public/` and `pages/`) and exposes the booking & contact JSON APIs.
- `utils/mailer.js` — Nodemailer transporter + branded HTML email templates
  (booking owner notification, booking customer confirmation, contact owner
  notification, contact customer acknowledgement).
- `utils/validate.js` — Shared server-side validation & input sanitization
  for the booking and contact forms.

## Running

```
npm install
cp .env.example .env   # then fill in real MAIL_* values
npm start
```

The site will be available at `http://localhost:3000/public/index.html`
(or whichever `PORT` you set in `.env`).

## API Endpoints

- `POST /api/booking` — body: `{ name, phone, email, service, date, time, address, message }`
- `POST /api/contact` — body: `{ name, phone, email, service, message }`

Both endpoints validate and sanitize input server-side, send a notification
email to `MAIL_TO`, and send a branded confirmation email back to the
customer. Never commit real credentials — all mail settings come from
environment variables (see `.env.example` in the project root).
