# DoEpic.cc

The DoEpic.cc Web3 product lab site, built with React, TypeScript, and Vite. It publishes the UNISON settlement desk at `/unison/` and the Zenith Apps suite at `/zenith/` from independent git submodules.

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

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds the main site, tests both `unison` and `zenith` submodules, and publishes everything as one Pages artifact. `zenith.doepic.cc` redirects to the Zenith artifact path. Enable **GitHub Actions** as the Pages source in the repository settings and point the subdomain DNS record at the same Pages host.
