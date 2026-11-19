# ShiftingsCart Static Website Scaffold

This bundle is the **initial production-ready scaffold** for the ShiftingsCart website project.

It is intentionally limited to:
- base file structure
- reusable styling and script foundations
- shared header and footer
- connected core pages
- fixed WhatsApp and Call quick actions
- starter quote form logic for WhatsApp
- starter sitemap and robots files
- placeholder-ready sections for future content, SEO, and schema

It does **not** yet include:
- final website copy
- final full SEO metadata
- full service-page content
- final animations
- all 70–80 Chennai locality pages
- full structured data per page

---

## Project structure

```text
shiftingscart-static-scaffold/
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── images/
│   │   ├── general/
│   │   │   └── README.md
│   │   ├── logo/
│   │   │   ├── shiftingscart-logo.png
│   │   │   └── shiftingscart-logo-transparent.png
│   │   ├── qr/
│   │   │   └── shiftingscart-location-qr.png
│   │   └── services/
│   │       └── README.md
│   └── js/
│       └── main.js
├── areas/
│   └── README.md
├── includes/
│   ├── footer.html
│   └── header.html
├── bike-shifting.html
├── car-shifting.html
├── chennai-localities.html
├── contact.html
├── find-reach-us.html
├── house-shifting.html
├── index.html
├── office-shifting.html
├── README.md
├── reviews.html
├── robots.txt
├── services.html
├── shifting-process.html
├── sitemap.xml
└── why-choose-us.html
```

---

## How this scaffold works

### Shared header and footer
The site uses:
- `includes/header.html`
- `includes/footer.html`

These are loaded into each page by `assets/js/main.js`.

### Shared CSS
All global styling lives in:
- `assets/css/styles.css`

This file already includes starter patterns for:
- transparent navigation
- page hero/banner
- service cards
- CTA section
- FAQ section
- quote form section
- footer
- quick action buttons

### Shared JavaScript
`assets/js/main.js` currently handles:
- loading shared header/footer includes
- active navigation state
- mobile menu toggle
- sticky/solid header state
- current year in footer
- quote form to WhatsApp message generation

### Quote form behavior
The base quote form sends a structured prefilled message to WhatsApp with:
- name
- phone
- service type
- moving date
- from location
- to location
- notes / item details

---

## Local preview notes

Because the scaffold loads shared HTML partials with `fetch()`, preview the site through a local server or a normal web host instead of opening the HTML files directly with `file://`.

Examples:
- Python: `python -m http.server 8000`
- VS Code: Live Server extension
- Any static hosting service

---

## Required future work

### Phase 1: content and page depth
- write final homepage copy
- expand service pages
- refine Why Choose Us / Process / Reviews pages
- improve Contact and Find & Reach Us content

### Phase 2: SEO pass
- final unique meta title and description on every page
- canonical tags
- Open Graph and Twitter tags
- JSON-LD per page
- image alt review
- internal link refinement

### Phase 3: local SEO rollout
- create locality page template
- create first priority Chennai locality pages
- connect locality pages to services and hub page
- expand search/filter logic for localities

### Phase 4: visual polish
- final imagery
- subtle reveal motion
- premium hover/scroll treatment
- performance optimization

---

## Notes for editors

- Search for `TODO:` comments in HTML, CSS, and JS files to find insertion points for future work.
- Keep filenames and link patterns consistent.
- Maintain `data-root-path="./"` on root pages.
- Use `data-root-path="../"` later for pages inside `/areas/`.
- Keep contact information consistent across the entire bundle.

---

## Contact routes already wired

- Call: `tel:+918248667381`
- Email: `mailto:support@shiftingscart.com`
- WhatsApp: `https://wa.me/918248667381`
- Maps: `https://maps.app.goo.gl/xfjzT3yZuxZ45mRc9`

---

## Recommended next step

Create the **component/page-template expansion phase**:
- finalize shared partials
- refine homepage section content
- deepen all 4 service pages
- define the Chennai locality page template
- add page-level metadata and schema placeholders more precisely
