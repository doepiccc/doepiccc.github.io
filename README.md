# DoEpic.cc

The DoEpic.cc Web3 product lab site, built with React, TypeScript, and Vite. It includes the UNISON development log and publishes the UNISON DApp submodule at `/unison/`.

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

The workflow in `.github/workflows/deploy.yml` builds the main site, tests and builds the `unison` submodule, and publishes both as one Pages artifact. Enable **GitHub Actions** as the Pages source in the repository settings.
