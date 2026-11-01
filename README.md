# Amr — personal site

A single-page personal site for a second-year medical student who also builds software.
Dark glassmorphism UI, animated stethoscope intro, a working focus timer, and no build step.

**Live:** <https://amrdev750.github.io/>

## Files

```
amr/
├── index.html              → content, metadata, social cards
├── styles.css              → theme, glass UI, intro animation, responsive layout
├── app.js                  → intro, nav, scroll reveal, cursor glow, Pomodoro timer
├── 404.html                → GitHub Pages not-found page
├── favicon.svg             → site icon
├── apple-touch-icon.png    → iOS home-screen icon (180×180)
├── og-image.png            → social share card (1200×630)
├── fonts/                  → self-hosted Sora + Instrument Serif WOFF2 files
├── robots.txt              → crawler rules
├── sitemap.xml             → single-page sitemap
├── .nojekyll               → serve files as-is on GitHub Pages
├── .gitignore
└── README.md
```

## Preview locally

From this folder:

```bash
python3 -m http.server 4173
```

Then open <http://127.0.0.1:4173>.

You can also double-click `index.html`, but a local server is closer to a real deployment.

## What's included

- **Intro animation** — a stethoscope draws itself, the chest piece pulses, then the name appears.
  Runs for about 4.5 seconds on the first visit of a browser session, with a **Skip intro**
  button and `Esc` to dismiss. Respects `prefers-reduced-motion` (skips the animation entirely).
- **Glass UI** — aurora background, film grain, frosted cards, pointer-tracked glow and card spotlights.
- **Focus timer** — 25 / 5 / 15 minute modes, start/pause/reset, completion chime, and a daily
  session count saved in `localStorage`.
- **Responsive** — mobile menu, single-column layouts, touch-friendly targets.
- **Accessible** — semantic landmarks, keyboard focus styles, inert page behind the intro,
  reduced-motion support.
- **Self-contained** — fonts are self-hosted, so there are no third-party requests, no
  analytics, and no tracking. The whole site is static HTML, CSS, and JS.

## Personal details used

- Name: **Amr**
- Course: **UOK 2/6** (year 2 of a 6-year medical course)
- Email: **aziziamr905@gmail.com**
- Instagram: **[@callme_amr](https://instagram.com/callme_amr)**
- GitHub: **[amrdev750](https://github.com/amrdev750)**

## Editing content

Everything lives in `index.html`:

- Hero copy and stats: the `<section class="hero">` block.
- About, focus cards, timeline: the sections with IDs `about`, `focus`, `journey`.
- Timer copy: the `study` section.
- Contact email and social links: the `contact` section.

Colors and spacing are CSS variables at the top of `styles.css`:

```css
--teal: #5eead4;
--blue: #60a5fa;
--violet: #a78bfa;
```

## Deploy

The site is published with **GitHub Pages** from the `main` branch root of
[`amrdev750/amrdev750.github.io`](https://github.com/amrdev750/amrdev750.github.io).
Every push to `main` redeploys it; no build step is involved.

To publish elsewhere, upload the folder to any static host:

- **Netlify Drop** — drag the folder onto <https://app.netlify.com/drop>.
- **Vercel** — `vercel` in this folder, framework preset "Other".
- **Cloudflare Pages** — upload as a static site.

If you change the domain, update the absolute URLs in `index.html` (canonical,
Open Graph, Twitter), `robots.txt`, and `sitemap.xml`.
