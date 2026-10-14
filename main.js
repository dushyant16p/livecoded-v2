/* Livecoded v2 — shared behaviour. No backend. Workshop ticket + demo inquiry in localStorage. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Mobile menu */
  var menuBtn = $('#menuBtn'); var navLinks = $('#navLinks');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* Scroll reveal */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(function (el) { io.observe(el); });

  /* Animated counters — DRAFT placeholder numbers only */
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target; cio.unobserve(el);
      var target = parseInt(el.getAttribute('data-count') || '0', 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var start = 0; var t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / 1100, 1);
        el.textContent = Math.floor(start + (target - start) * p).toLocaleString('en-IN') + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.4 });
  $$('[data-count]').forEach(function (el) { cio.observe(el); });

  /* Typing effect */
  $$('[data-typing]').forEach(function (el) {
    var words = (el.getAttribute('data-typing') || '').split('|').filter(Boolean);
    if (!words.length) return;
    var wi = 0, ci = 0, deleting = false;
    setInterval(function () {
      var w = words[wi];
      if (!deleting) { ci++; if (ci >= w.length) { deleting = true; setTimeout(function () {}, 900); } }
      else { ci--; if (ci <= 0) { deleting = false; wi = (wi + 1) % words.length; } }
      el.textContent = words[wi].slice(0, ci);
    }, deleting ? 40 : 90);
  });

  /* FAQ accordion */
  $$('.faq button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq');
      var open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* Course filter (courses.html) */
  $$('[data-filter-btn]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      $$('[data-filter-btn]').forEach(function (b) { b.classList.remove('btn-dark'); b.classList.add('btn-ghost'); });
      btn.classList.add('btn-dark'); btn.classList.remove('btn-ghost');
      var f = btn.getAttribute('data-filter-btn');
      $$('[data-course]').forEach(function (card) {
        card.style.display = (f === 'all' || card.getAttribute('data-course') === f) ? '' : 'none';
      });
    });
  });

  /* ---- Workshop registration + ticket (localStorage) ---- */
  var TICKET_KEY = 'livecoded_v2_ticket';
  function makeTicketId() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var s = '';
    for (var i = 0; i < 6; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
    return 'LC-' + s;
  }
  function getTicket() {
    try { return JSON.parse(localStorage.getItem(TICKET_KEY) || 'null'); } catch (e) { return null; }
  }
  function saveTicket(t) { try { localStorage.setItem(TICKET_KEY, JSON.stringify(t)); } catch (e) {} }
  function clearTicket() { try { localStorage.removeItem(TICKET_KEY); } catch (e) {} }

  function renderTicket(container) {
    if (!container) return;
    var t = getTicket();
    if (!t) {
      container.innerHTML = '<p class="help">No ticket saved yet on this device. Register below and your ticket will appear here — it stays saved even if you reload.</p>';
      return;
    }
    container.innerHTML =
      '<div class="ticket"><div style="display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap">' +
      '<div><p class="small-label">Your workshop ticket · saved on this device</p>' +
      '<p class="ticket-id">' + t.id + '</p>' +
      '<p><b>' + t.name + '</b> · ' + t.email + (t.phone ? ' · ' + t.phone : '') + '</p>' +
      '<p>Workshop: <b>' + t.workshop + '</b> · Date / time: <b>TBA</b> · Price: <b>TBA</b></p>' +
      '<p>Status: <b>Registered (local demo)</b> · No email was sent — this ticket lives only in this browser.</p>' +
      '<p class="help">Show this ticket ID at the workshop. Saved: ' + new Date(t.createdAt).toLocaleString() + '</p></div>' +
      '<div class="qr" aria-hidden="true"></div></div>' +
      '<div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap">' +
      '<button class="btn btn-ghost btn-sm" id="copyTicketBtn" type="button">Copy ticket ID</button>' +
      '<button class="btn btn-ghost btn-sm" id="clearTicketBtn" type="button">Clear my ticket</button></div></div>';
    var copyBtn = $('#copyTicketBtn', container);
    if (copyBtn) copyBtn.addEventListener('click', function () {
      var done = function () { copyBtn.textContent = 'Copied ✓'; };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t.id).then(done).catch(done);
      } else { done(); }
    });
    var clearBtn = $('#clearTicketBtn', container);
    if (clearBtn) clearBtn.addEventListener('click', function () { clearTicket(); renderTicket(container); });
  }

  var ticketBox = $('#myTicket');
  if (ticketBox) renderTicket(ticketBox);

  var form = $('#workshopForm');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name = $('#wsName').value.trim();
      var email = $('#wsEmail').value.trim();
      var phone = $('#wsPhone').value.trim();
      var workshop = $('#wsChoice').value;
      var err = $('#wsError');
      if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (err) err.textContent = 'Please enter your name and a valid email.';
        return;
      }
      if (err) err.textContent = '';
      var ticket = { id: makeTicketId(), name: name, email: email, phone: phone, workshop: workshop, createdAt: new Date().toISOString() };
      saveTicket(ticket);
      var success = $('#wsSuccess');
      if (success) {
        success.hidden = false;
        success.innerHTML = '<b>Registered!</b> Your ticket ID is <b>' + ticket.id + '</b>. It is saved in this browser — see “My ticket” below.';
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      renderTicket(ticketBox);
      form.reset();
    });
  }

  /* ---- Contact demo inquiry (localStorage, NOT sent) ---- */
  var contactForm = $('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var data = {
        name: ($('#cfName') || {}).value || '',
        email: ($('#cfEmail') || {}).value || '',
        topic: ($('#cfTopic') || {}).value || '',
        message: ($('#cfMsg') || {}).value || '',
        at: new Date().toISOString()
      };
      try { localStorage.setItem('livecoded_v2_inquiry', JSON.stringify(data)); } catch (e) {}
      var note = $('#contactNote');
      if (note) { note.hidden = false; note.textContent = 'Demo only — your message was saved in this browser, not sent anywhere. Official contact will be connected before production.'; }
      contactForm.reset();
    });
  }

  /* ---- Careers: DRAFT apply buttons show honest notice ---- */
  $$('[data-draft-apply]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var note = $('#draftApplyNote');
      if (note) { note.hidden = false; note.textContent = 'DRAFT listing — this is not a real opening, so no application is collected.'; }
    });
  });
})();
