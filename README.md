# Livecoded v2 — Building-phase testing site

> ⚠ **DRAFT — NOT FOR PRODUCTION. NO MARKETING.**
> All stats, testimonials, courses (except the workshop format), jobs, and contact
> details are clearly-labelled placeholders. See `CHANGES-NEEDED.md` for everything
> that must be replaced before any production launch. Dushyant will audit + supply
> real data in his own changes MD file.

## What this is

A new-gen rebuild of the Livecoded site for **testing only**, keeping the original
repo's page structure and adding a workshop registration page:

- `index.html` — editorial hero, philosophy bento, programs preview, DRAFT stats/testimonials
- `courses.html` — workshop (current) + 3 DRAFT course placeholders + MERN (Planned)
- `workshop.html` — **NEW** — Build Your First React App (90 min, date/price TBA) + registration form + ticket
- `about.html` — story, philosophy, founder (Dushyant, creator of Livecoded — no invented credentials)
- `careers.html` — DRAFT placeholder roles/internships, **not real openings**
- `contact.html` — demo-only form (saves to localStorage, sends nothing), contact TBA

No login anywhere. No backend.

## Design

- **Neumorphism + glassmorphism:** soft extruded cards on a cool light-grey canvas,
  frosted-glass panels over the hero, inset-pressed form fields.
- **Not the generic template:** side-rail hero, asymmetric bento grids, rotated ticker,
  overlapping glass terminal + floating ticket card, editorial numbering.
- **Motion:** scroll-reveal, marquee ticker, typing effect, animated DRAFT counters,
  hover lifts, FAQ accordion. `prefers-reduced-motion` respected.
- **Fonts:** Space Grotesk + JetBrains Mono. **Colours:** ink + electric blue + cyan.
- **Accessibility:** skip link, labels, focus states, alt/aria where needed, mobile-first.

## Workshop registration + ticket (localStorage)

- Form on `workshop.html`: name, email (validated), phone (optional), workshop choice.
- On submit: a ticket `LC-XXXXXX` is generated and saved to `localStorage` key
  `livecoded_v2_ticket`. It renders in "My ticket" and **persists on reload**.
- Ticket shows name, email, workshop, date/time TBA, price TBA, status.
- Buttons: **Copy ticket ID** and **Clear my ticket**.
- Honest copy throughout: "No email was sent — this ticket lives only in this browser."
- Contact form saves a demo inquiry to `livecoded_v2_inquiry` and says "not sent".

## Run locally

```bash
# from this folder
python3 -m http.server 8000
# open http://localhost:8000/
```

No build step. Static files only — deployable to GitHub Pages as-is.

## Structure

```
index.html  courses.html  workshop.html  about.html  careers.html  contact.html
assets/css/main.css        # shared design system
assets/js/main.js          # menu, reveal, counters, typing, FAQ, filter, ticket
.github/workflows/static.yml  # GitHub Pages deploy (same as original repo)
README.md  CHANGES-NEEDED.md  .gitignore
```

## Before production — DO NOT SKIP

1. Dushyant's changes MD file → replace every item in `CHANGES-NEEDED.md`.
2. Remove the DRAFT banners only after real data is in.
3. Connect a real registration / contact destination and test it end-to-end.
4. Re-audit: no placeholder, fake, or unverified claim may remain on a public link.
