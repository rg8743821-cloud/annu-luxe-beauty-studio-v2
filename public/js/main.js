/* ==========================================================================
   ANNU'S LUXE BEAUTY STUDIO — MAIN JS
   Part 1 interactions (menu, accordion, lightbox, reveals) are unchanged.
   Part 2 adds: booking form submission, contact form submission, the
   floating rule-based chatbot, and the WhatsApp / call floating buttons.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Preloader ---------- */
  var preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', function () {
      setTimeout(function () { preloader.classList.add('is-hidden'); }, 300);
    });
    // Fallback in case the load event already fired
    setTimeout(function () { preloader.classList.add('is-hidden'); }, 1800);
  }

  /* ---------- Sticky header ---------- */
  var header = document.querySelector('.site-header');
  function handleScrollHeader() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  handleScrollHeader();
  window.addEventListener('scroll', handleScrollHeader, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('is-open');
      navMenu.classList.toggle('is-open');
      document.body.style.overflow = navMenu.classList.contains('is-open') ? 'hidden' : '';
    });
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('is-open');
        navMenu.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Scroll reveal (fade in / slide up) ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- FAQ accordion ---------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', function () {
      var wasOpen = item.classList.contains('is-open');
      faqItems.forEach(function (i) { i.classList.remove('is-open'); });
      if (!wasOpen) item.classList.add('is-open');
    });
  });

  /* ---------- Gallery filters (design-only, filters DOM client-side) ---------- */
  var filterButtons = document.querySelectorAll('.gallery-filters button');
  var galleryItems = document.querySelectorAll('.gallery-item');
  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      galleryItems.forEach(function (item) {
        var parent = item.closest('.g-item') || item;
        var category = item.getAttribute('data-category');
        var show = filter === 'all' || filter === category;
        parent.style.display = show ? '' : 'none';
      });
    });
  });

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    var lightboxImg = lightbox.querySelector('img');
    var lightboxClose = lightbox.querySelector('.lightbox-close');
    var lightboxPrev = lightbox.querySelector('.lightbox-prev');
    var lightboxNext = lightbox.querySelector('.lightbox-next');
    var galleryLinks = Array.prototype.slice.call(document.querySelectorAll('.gallery-item img'));
    var currentIndex = 0;

    function openLightbox(index) {
      currentIndex = index;
      lightboxImg.src = galleryLinks[index].src;
      lightboxImg.alt = galleryLinks[index].alt;
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }
    function showRelative(step) {
      currentIndex = (currentIndex + step + galleryLinks.length) % galleryLinks.length;
      lightboxImg.src = galleryLinks[currentIndex].src;
      lightboxImg.alt = galleryLinks[currentIndex].alt;
    }

    galleryLinks.forEach(function (img, index) {
      img.closest('.gallery-item').addEventListener('click', function () { openLightbox(index); });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', function () { showRelative(-1); });
    if (lightboxNext) lightboxNext.addEventListener('click', function () { showRelative(1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showRelative(1);
      if (e.key === 'ArrowLeft') showRelative(-1);
    });
  }

  /* ---------- Active nav link highlighting ---------- */
  var currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-menu a').forEach(function (link) {
    var linkPage = link.getAttribute('href').split('/').pop().toLowerCase();
    if (linkPage === currentPage) link.classList.add('active');
  });

  /* ---------- Booking page: service selection (single-select, synced to hidden input + summary) ---------- */
  var bookingCards = document.querySelectorAll('.service-select-card');
  var bookServiceInput = document.getElementById('book-service');
  var summaryService = document.getElementById('summary-service');
  var summaryPrice = document.getElementById('summary-price');
  var summaryTotal = document.getElementById('summary-total');
  if (bookingCards.length) {
    bookingCards.forEach(function (card) {
      card.addEventListener('click', function () {
        bookingCards.forEach(function (c) { c.classList.remove('selected'); });
        card.classList.add('selected');
        var service = card.getAttribute('data-service') || card.querySelector('strong').textContent;
        var price = card.getAttribute('data-price') || '';
        if (bookServiceInput) bookServiceInput.value = service;
        if (summaryService) summaryService.textContent = service;
        if (summaryPrice) summaryPrice.textContent = price;
        if (summaryTotal) summaryTotal.textContent = price;
        clearFieldError('service');
      });
    });
  }

  /* ---------- Counter animation for stats (hero / about) ---------- */
  var counters = document.querySelectorAll('[data-counter]');
  if ('IntersectionObserver' in window && counters.length) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-counter'), 10) || 0;
        var suffix = el.getAttribute('data-suffix') || '';
        var current = 0;
        var duration = 1400;
        var startTime = null;
        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          current = Math.floor(progress * target);
          el.textContent = current + suffix;
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target + suffix;
        }
        requestAnimationFrame(step);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ==========================================================================
     PART 2 — Form validation + submission helpers
     ========================================================================== */

  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var PHONE_PATTERN = /^(?:\+?91)?[6-9]\d{9}$/;

  function showFieldError(fieldKey, message) {
    var errEl = document.getElementById('err-' + fieldKey) || document.getElementById('err-c-' + fieldKey);
    var inputEl = document.getElementById('book-' + fieldKey) || document.getElementById('c-' + fieldKey) || document.getElementById(fieldKey);
    if (errEl) { errEl.textContent = message; errEl.classList.add('is-visible'); }
    if (inputEl) inputEl.classList.add('is-invalid');
  }

  function clearFieldError(fieldKey) {
    var errEl = document.getElementById('err-' + fieldKey) || document.getElementById('err-c-' + fieldKey);
    var inputEl = document.getElementById('book-' + fieldKey) || document.getElementById('c-' + fieldKey) || document.getElementById(fieldKey);
    if (errEl) { errEl.textContent = ''; errEl.classList.remove('is-visible'); }
    if (inputEl) inputEl.classList.remove('is-invalid');
  }

  function clearAllFieldErrors(form) {
    form.querySelectorAll('.field-error').forEach(function (el) {
      el.textContent = '';
      el.classList.remove('is-visible');
    });
    form.querySelectorAll('.is-invalid').forEach(function (el) {
      el.classList.remove('is-invalid');
    });
  }

  function showFormMessage(msgEl, text, type) {
    if (!msgEl) return;
    msgEl.textContent = text;
    msgEl.className = 'form-message is-visible is-' + type;
  }

  function setButtonLoading(btn, isLoading, loadingText, defaultText) {
    if (!btn) return;
    var textEl = btn.querySelector('.btn-text');
    btn.disabled = isLoading;
    btn.classList.toggle('is-loading', isLoading);
    if (textEl) textEl.textContent = isLoading ? loadingText : defaultText;
  }

  async function postJSON(url, data) {
    var response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    var payload = {};
    try { payload = await response.json(); } catch (e) { payload = {}; }
    return { ok: response.ok, payload: payload };
  }

  /* ---------- Booking form submission ---------- */
  var bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    var bookingMsg = document.getElementById('booking-form-message');
    var bookingSubmitBtn = document.getElementById('booking-submit');

    bookingForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      clearAllFieldErrors(bookingForm);

      var name = document.getElementById('book-name').value.trim();
      var phone = document.getElementById('book-phone').value.trim();
      var email = document.getElementById('book-email').value.trim();
      var service = document.getElementById('book-service').value.trim();
      var date = document.getElementById('book-date').value.trim();
      var time = document.getElementById('book-time').value.trim();
      var address = document.getElementById('book-address').value.trim();
      var message = document.getElementById('book-notes').value.trim();
      var honeypotEl = document.getElementById('book-website');
      var honeypot = honeypotEl ? honeypotEl.value.trim() : '';

      var hasError = false;
      if (name.length < 2) { showFieldError('name', 'Please enter your full name.'); hasError = true; }
      if (!PHONE_PATTERN.test(phone.replace(/[\s-]/g, ''))) { showFieldError('phone', 'Please enter a valid 10-digit phone number.'); hasError = true; }
      if (!EMAIL_PATTERN.test(email)) { showFieldError('email', 'Please enter a valid email address.'); hasError = true; }
      if (!service) { showFieldError('service', 'Please select a service.'); hasError = true; }
      if (!date) { showFieldError('date', 'Please select a preferred date.'); hasError = true; }
      if (!time) { showFieldError('time', 'Please select a preferred time slot.'); hasError = true; }
      if (address.length < 5) { showFieldError('address', 'Please enter your full home address.'); hasError = true; }

      if (hasError) {
        showFormMessage(bookingMsg, 'Please correct the highlighted fields above and try again.', 'error');
        return;
      }

      setButtonLoading(bookingSubmitBtn, true, 'Submitting…', 'Confirm Booking');
      showFormMessage(bookingMsg, 'Sending your booking request…', 'loading');

      try {
        var result = await postJSON('/api/booking', { name: name, phone: phone, email: email, service: service, date: date, time: time, address: address, message: message, website: honeypot });
        if (result.ok && result.payload && result.payload.success) {
          showFormMessage(bookingMsg, result.payload.message || 'Thank you! Your appointment request has been received.', 'success');
          bookingForm.reset();
          if (bookServiceInput) bookServiceInput.value = 'Bridal Makeup';
          bookingCards.forEach(function (c) { c.classList.remove('selected'); });
          if (bookingCards[0]) bookingCards[0].classList.add('selected');
          if (summaryService) summaryService.textContent = 'Bridal Makeup';
          if (summaryPrice) summaryPrice.textContent = '₹8,999';
          if (summaryTotal) summaryTotal.textContent = '₹8,999';
        } else if (result.payload && result.payload.errors) {
          Object.keys(result.payload.errors).forEach(function (key) { showFieldError(key, result.payload.errors[key]); });
          showFormMessage(bookingMsg, result.payload.message || 'Please correct the highlighted fields and try again.', 'error');
        } else {
          showFormMessage(bookingMsg, (result.payload && result.payload.message) || 'Something went wrong. Please call or WhatsApp us at +91 63896 30821.', 'error');
        }
      } catch (err) {
        showFormMessage(bookingMsg, 'Network error — please check your connection or call/WhatsApp us at +91 63896 30821.', 'error');
      } finally {
        setButtonLoading(bookingSubmitBtn, false, 'Submitting…', 'Confirm Booking');
      }
    });
  }

  /* ---------- Contact form submission ---------- */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    var contactMsg = document.getElementById('contact-form-message');
    var contactSubmitBtn = document.getElementById('contact-submit');

    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      clearAllFieldErrors(contactForm);

      var name = document.getElementById('c-name').value.trim();
      var phone = document.getElementById('c-phone').value.trim();
      var email = document.getElementById('c-email').value.trim();
      var service = document.getElementById('c-service').value.trim();
      var message = document.getElementById('c-message').value.trim();
      var honeypotEl = document.getElementById('c-website');
      var honeypot = honeypotEl ? honeypotEl.value.trim() : '';

      var hasError = false;
      if (name.length < 2) { showFieldError('c-name', 'Please enter your full name.'); hasError = true; }
      if (!PHONE_PATTERN.test(phone.replace(/[\s-]/g, ''))) { showFieldError('c-phone', 'Please enter a valid 10-digit phone number.'); hasError = true; }
      if (!EMAIL_PATTERN.test(email)) { showFieldError('c-email', 'Please enter a valid email address.'); hasError = true; }
      if (message.length < 5) { showFieldError('c-message', 'Please enter a short message so we know how to help.'); hasError = true; }

      if (hasError) {
        showFormMessage(contactMsg, 'Please correct the highlighted fields above and try again.', 'error');
        return;
      }

      setButtonLoading(contactSubmitBtn, true, 'Sending…', 'Send Message');
      showFormMessage(contactMsg, 'Sending your message…', 'loading');

      try {
        var result = await postJSON('/api/contact', { name: name, phone: phone, email: email, service: service, message: message, website: honeypot });
        if (result.ok && result.payload && result.payload.success) {
          showFormMessage(contactMsg, result.payload.message || 'Thank you! We will get back to you shortly.', 'success');
          contactForm.reset();
        } else if (result.payload && result.payload.errors) {
          Object.keys(result.payload.errors).forEach(function (key) { showFieldError(key, result.payload.errors[key]); });
          showFormMessage(contactMsg, result.payload.message || 'Please correct the highlighted fields and try again.', 'error');
        } else {
          showFormMessage(contactMsg, (result.payload && result.payload.message) || 'Something went wrong. Please call or WhatsApp us at +91 63896 30821.', 'error');
        }
      } catch (err) {
        showFormMessage(contactMsg, 'Network error — please check your connection or call/WhatsApp us at +91 63896 30821.', 'error');
      } finally {
        setButtonLoading(contactSubmitBtn, false, 'Sending…', 'Send Message');
      }
    });
  }

  /* ==========================================================================
     PART 2 — Floating WhatsApp / Call buttons + rule-based chatbot
     Injected on every page (this script is shared site-wide) so no HTML
     file needs to be touched individually.
     ========================================================================== */

  var WHATSAPP_NUMBER = '916389630821';
  var WHATSAPP_MESSAGE = encodeURIComponent('Hello, I would like to book a beauty service.');
  var CALL_NUMBER = '+916389630821';

  var floatingWrap = document.createElement('div');
  floatingWrap.className = 'floating-actions';
  floatingWrap.innerHTML =
    '<button type="button" class="floating-btn chat-toggle-btn" id="chatbot-toggle" aria-label="Chat with us"><i class="fa-solid fa-comment-dots"></i></button>' +
    '<a class="floating-btn whatsapp-btn" href="https://wa.me/' + WHATSAPP_NUMBER + '?text=' + WHATSAPP_MESSAGE + '" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><span class="pulse-ring"></span><i class="fa-brands fa-whatsapp"></i></a>' +
    '<a class="floating-btn call-btn" href="tel:' + CALL_NUMBER + '" aria-label="Call us"><span class="pulse-ring"></span><i class="fa-solid fa-phone"></i></a>';
  document.body.appendChild(floatingWrap);

  /* ---------- Rule-based chatbot ---------- */
  var CHAT_QUICK_REPLIES = [
    'What services do you offer?',
    'What are your timings?',
    'Where are you located?',
    'How can I book?',
    'Do you provide home service?',
    'How can I contact you?',
    'Pricing'
  ];

  var CHAT_RULES = [
    { keys: ['service', 'services', 'offer'], reply: "We offer Bridal Makeup, Hair Services (cuts, colour, keratin, spa), Skin Care (facials, cleanups, waxing) and Nail Services (manicure, pedicure, extensions, nail art) — all delivered at your doorstep." },
    { keys: ['timing', 'timings', 'hours', 'open', 'time'], reply: "We're available Monday – Sunday, 9:00 AM – 8:00 PM. Bridal bookings are best made 2-3 weeks in advance." },
    { keys: ['located', 'location', 'address', 'where'], reply: "We're based at Brijesh Vatika Colony, Indirapuram, Ghaziabad, Uttar Pradesh, and serve Indirapuram and surrounding areas." },
    { keys: ['book', 'booking', 'appointment', 'reserve'], reply: "You can book instantly on our Booking page, or message us on WhatsApp / call us at +91 63896 30821 and we'll confirm your slot." },
    { keys: ['home service', 'at home', 'doorstep', 'home salon'], reply: "Yes! Every service is delivered at your home — our artists bring professional tools and premium, hygienic products with them." },
    { keys: ['contact', 'phone', 'email', 'number'], reply: "You can reach us at +91 63896 30821 or annugupta0692@gmail.com. We're happy to help with any questions." },
    { keys: ['pricing', 'price', 'cost', 'charges'], reply: "Starting prices: Bridal Makeup from ₹8,999, Hair Services from ₹499, Skin Care from ₹599, Nail Services from ₹499. Final pricing is confirmed on consultation." },
    { keys: ['bridal'], reply: "Bridal Makeup starts from ₹8,999 and includes HD/airbrush looks crafted to last through every ceremony." },
    { keys: ['hair'], reply: "Hair Services start from ₹499 and include cuts, colour, keratin and spa treatments." },
    { keys: ['skin'], reply: "Skin Care starts from ₹599 and includes facials, cleanups and waxing rituals." },
    { keys: ['nail'], reply: "Nail Services start from ₹499 and include manicures, pedicures, extensions and nail art." }
  ];

  function matchChatReply(input) {
    var text = input.toLowerCase();
    for (var i = 0; i < CHAT_RULES.length; i++) {
      var rule = CHAT_RULES[i];
      for (var j = 0; j < rule.keys.length; j++) {
        if (text.indexOf(rule.keys[j]) !== -1) return rule.reply;
      }
    }
    return 'Please call us or message us on WhatsApp.';
  }

  var chatPanel = document.createElement('div');
  chatPanel.className = 'chatbot-panel';
  chatPanel.id = 'chatbot-panel';
  chatPanel.innerHTML =
    '<div class="chatbot-header">' +
      '<div class="title"><div class="avatar"><i class="fa-solid fa-gem"></i></div><div><strong>Annu\'s Luxe Assistant</strong><span>Usually replies instantly</span></div></div>' +
      '<button type="button" class="chatbot-close" id="chatbot-close" aria-label="Close chat"><i class="fa-solid fa-xmark"></i></button>' +
    '</div>' +
    '<div class="chatbot-body" id="chatbot-body"></div>' +
    '<div class="chat-quick-replies" id="chat-quick-replies"></div>' +
    '<div class="chatbot-input-row">' +
      '<input type="text" id="chatbot-input" placeholder="Type your question…" aria-label="Type your question">' +
      '<button type="button" id="chatbot-send" aria-label="Send"><i class="fa-solid fa-paper-plane"></i></button>' +
    '</div>';
  document.body.appendChild(chatPanel);

  var chatBody = document.getElementById('chatbot-body');
  var quickRepliesWrap = document.getElementById('chat-quick-replies');
  var chatInput = document.getElementById('chatbot-input');
  var chatSendBtn = document.getElementById('chatbot-send');
  var chatToggleBtn = document.getElementById('chatbot-toggle');
  var chatCloseBtn = document.getElementById('chatbot-close');
  var chatStarted = false;

  function addChatMessage(text, sender) {
    var msg = document.createElement('div');
    msg.className = 'chat-msg ' + sender;
    msg.textContent = text;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function renderQuickReplies() {
    quickRepliesWrap.innerHTML = '';
    CHAT_QUICK_REPLIES.forEach(function (question) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = question;
      btn.addEventListener('click', function () { handleUserQuestion(question); });
      quickRepliesWrap.appendChild(btn);
    });
  }

  function handleUserQuestion(question) {
    addChatMessage(question, 'user');
    var reply = matchChatReply(question);
    setTimeout(function () { addChatMessage(reply, 'bot'); }, 350);
  }

  function startChatIfNeeded() {
    if (chatStarted) return;
    chatStarted = true;
    addChatMessage("Hi! I'm the Annu's Luxe virtual assistant. Ask me about services, pricing, timings or booking — or tap a question below.", 'bot');
    renderQuickReplies();
  }

  function openChat() {
    chatPanel.classList.add('is-open');
    startChatIfNeeded();
    chatInput.focus();
  }
  function closeChat() { chatPanel.classList.remove('is-open'); }

  if (chatToggleBtn) {
    chatToggleBtn.addEventListener('click', function () {
      if (chatPanel.classList.contains('is-open')) closeChat(); else openChat();
    });
  }
  if (chatCloseBtn) chatCloseBtn.addEventListener('click', closeChat);
  if (chatSendBtn) {
    chatSendBtn.addEventListener('click', function () {
      var val = chatInput.value.trim();
      if (!val) return;
      handleUserQuestion(val);
      chatInput.value = '';
    });
  }
  if (chatInput) {
    chatInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        chatSendBtn.click();
      }
    });
  }

});
