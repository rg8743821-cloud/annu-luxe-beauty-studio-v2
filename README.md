# Annu's Luxe Beauty Studio — Website (Part 3: SEO, Performance & Security)

Luxury home salon website for **Annu's Luxe Beauty Studio**, Indirapuram, Ghaziabad.
Tagline: *Luxury Home Salon Services at Your Doorstep*

Part 1 delivered the complete, production-quality frontend. Part 2 added the
backend — an Express server, working booking and contact forms with
Nodemailer email delivery, a rule-based chatbot, a WhatsApp click-to-chat
button, a click-to-call button, and a live Google Maps embed on the Contact
page. **Part 3 (this update)** builds on both without changing any existing
functionality:

- **Google Maps** — "Get Directions" button added next to the existing Contact page embed.
- **WhatsApp** — floating button (already site-wide) now opens with the exact message *"Hello, I would like to book a beauty service."*; added an explicit WhatsApp + Book Now button on the Contact page.
- **SEO** — `robots.txt`, `sitemap.xml`, full Open Graph + Twitter Card tags on every page, and JSON-LD structured data site-wide: `BeautySalon`/`LocalBusiness`, `BreadcrumbList`, `FAQPage` (20 Q&As), `Review`/`AggregateRating`, and an appointment `Service`/`ReserveAction` schema on the booking page.
- **Google Business Profile ready** — name, address, phone, email, opening hours, geo-coordinates and services are all present in structured data and on-page content.
- **Gallery** — expanded with Makeup, Spa and Facial categories alongside the existing Bridal, Hair, Skin and Nails.
- **Testimonials** — expanded to 10 real-style reviews in a new accessible slider (arrows, dots, autoplay, pause-on-hover).
- **FAQ** — expanded from 8 to 20 SEO-friendly questions.
- **Performance** — lazy-loaded images site-wide; minified `style.min.css` / `main.min.js` builds (originals kept as editable source) referenced with `defer`.
- **Accessibility** — skip-to-content link, `main` landmark, extra focus-visible states.
- **Security** — honeypot spam field on both forms and a lightweight in-memory rate limiter on the booking/contact APIs (no new dependencies).

---

## Running the project

```
npm install
cp .env.example .env      # then fill in your real SMTP / Gmail app-password details
npm start
```

Visit `http://localhost:3000/public/index.html` (or whichever `PORT` you set).
`robots.txt` and `sitemap.xml` are served automatically from the project root
(e.g. `http://localhost:3000/robots.txt`) since the whole project root is
already served statically.

## Folder Structure

```
annu-luxe-beauty-studio/
├── robots.txt               Search-engine crawl rules
├── sitemap.xml               Full page list for search engines
├── public/
│   ├── index.html          Home page
│   ├── css/
│   │   └── style.min.css   Minified build referenced by all pages
│   ├── js/
│   │   └── main.min.js     Minified build referenced by all pages
│   │   └── style.css       Master stylesheet (Part 1 design + Part 2 additions appended)
│   ├── js/
│   │   └── main.js         Part 1 interactions + Part 2 forms/chatbot/floating buttons
│   └── images/              Reserved for local image assets (currently using Unsplash placeholders)
├── pages/
│   ├── about.html
│   ├── services.html
│   ├── bridal-makeup.html
│   ├── hair-services.html
│   ├── skin-care.html
│   ├── nail-services.html
│   ├── gallery.html
│   ├── pricing.html
│   ├── testimonials.html
│   ├── faq.html
│   ├── booking.html        Fully working — submits to /api/booking
│   └── contact.html        Fully working — submits to /api/contact, live Google Map embedded
├── server/
│   ├── server.js            Express app: static hosting + booking/contact APIs
│   └── utils/
│       ├── mailer.js        Nodemailer transporter + branded HTML email templates
│       └── validate.js      Server-side validation & input sanitization
├── .env.example             Copy to .env and fill in real mail credentials
├── package.json
└── README.md
```

## Design System

| Token       | Value                          |
|-------------|---------------------------------|
| Primary     | `#D4AF37` (Luxury Gold)         |
| Secondary   | `#111111` (Black)               |
| Background  | `#FFFFFF`                       |
| Accent      | `#FFF7F2`                       |
| Text        | `#333333`                       |
| Font        | Poppins (Google Fonts)          |

**Signature element:** the "gold thread" divider — a stitched gold line motif
used between sections, echoing the studio's threading service.

## Pages Included

Home, About, Services (overview), Bridal Makeup, Hair Services, Skin Care,
Nail Services, Gallery, Pricing, Testimonials, FAQ, Booking, Contact.

## What's Included in Part 2

- **Express server** (`server/server.js`) serving the existing static frontend
  and exposing `POST /api/booking` and `POST /api/contact`.
- **Nodemailer email integration** — every booking sends a notification to
  the business inbox *and* a branded confirmation email to the customer;
  every contact enquiry sends a notification to the business inbox *and* an
  acknowledgement email to the customer.
- **Working booking form** — full client + server-side validation (name,
  phone, email, service, date, time, address; special request optional).
- **Working contact form** — full client + server-side validation.
- **Rule-based chatbot** — floating widget on every page, answers questions
  about services, timings, location, booking, home service, contact details
  and pricing; falls back to "Please call us or message us on WhatsApp."
  for anything else.
- **WhatsApp floating button** — opens a chat to +91 63896 30821 with a
  pre-filled message.
- **Click-to-call floating button** — dials +91 63896 30821.
- **Live Google Maps embed** on the Contact page for Brijesh Vatika Colony,
  Indirapuram, Ghaziabad, Uttar Pradesh.
- **Security** — all form input is sanitized server-side, environment
  variables hold every credential (never hardcoded), and `.env` should never
  be committed.

## Notes

- Image `src` attributes currently point to Unsplash for placeholder purposes;
  swap these for real studio photography in `public/images/` when available,
  keeping the same file names/paths referenced across pages.
- Business details (phone, email, address) are correct and consistent across
  every page and the structured data (JSON-LD) blocks.

## Business Details

- **Business:** Annu's Luxe Beauty Studio
- **Phone:** +91 63896 30821
- **Email:** annugupta0692@gmail.com
- **Address:** Brijesh Vatika Colony, Indirapuram, Ghaziabad, Uttar Pradesh

