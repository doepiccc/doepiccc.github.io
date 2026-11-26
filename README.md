# DoEpic.cc

The DoEpic.cc Web3 product lab site, built with React, TypeScript, and Vite. A bilingual (EN/RU), light/dark themed showcase with the R&D projects, a block for upcoming ones, and the build logs. It also publishes the UNISON settlement desk at `/unison/` and the ten-app Zenith Apps suite at `/zenith/` from independent git submodules.

## Design

Current: **Four Market Seasons**, the crypto counterpart of [doepic.ai](https://doepic.ai). A low-poly crypto city under glass cards, whose season changes as you scroll (crypto spring → DeFi summer → harvest autumn → crypto winter), with falling blocks, fireflies, leaves, coins and snow.

Palette: `#1c1a3a #2a2662 #355281 #408898 #57bd91 #a4d969 #f0eb88 #d9a269 #bd5757 #984092 #5a3581`

The previous design is kept at the `design-terminal-v1` tag.

## Local development

```bash
npm install
npm run dev
```

Run the production checks:

```bash
npm run lint
npm run build
npm run verify:pages
```

## Adding a project

Add an object to the `projects` array in `src/App.tsx` (screenshot in `public/images/`) and its Russian strings to `src/i18n/translations.ts`. The "coming soon" card stays after the list.

## Artwork (Gemini, low-poly)

CSS draws the sky and water; the rest is 9 low-poly images generated with Gemini, under 500 KB in total.

1. `python tools/receiver.py 8778` starts a receiver on 127.0.0.1. It prints a token on startup and accepts images only.
2. The image is generated in Gemini in the built-in browser. The Gemini page does not allow `fetch` to other origins, so the image is drawn to a canvas, base64-encoded and passed in the URL fragment to `http://127.0.0.1:8778/recv.html#name.ext.data`. The receiver page saves the file to `gemini-raw/`.
3. `python tools/import_gemini.py` (Pillow, NumPy, SciPy) removes the chroma-key background, resizes and saves WebP to `public/img/lp/`.
4. `python tools/social_card.py` rebuilds `public/social.jpg`.

Prompts are in `docs/gemini/PROMPTS.md`.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds the main site, tests both `unison` and `zenith` submodules, and publishes everything as one Pages artifact. `zenith.doepic.cc` redirects to the Zenith artifact path. Enable **GitHub Actions** as the Pages source in the repository settings and point the subdomain DNS record at the same Pages host.
