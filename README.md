# SBF See & Binnen – Fragenkatalog (Deutsch/English)

Study and quiz app for the official SBF See and Binnen question catalogs (valid since 1 Aug 2023), German with English: browse/search, quiz with Leitner-style progress tracking, and a progress dashboard. Built with Vite 8, Svelte 5 and Tailwind CSS 4. Live at <https://sbfbinnen.adct.it>.

## Development

```sh
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
npm run preview  # serve the production build
```

Questions live in `src/data/questions.json`; figures in `public/img/`.

## Deployment

Pushes to `main` build with Vite and deploy to GitHub Pages via `.github/workflows/deploy.yml`.

One-time setup:

1. Repo **Settings → Pages → Source: GitHub Actions**.
2. Custom domain `sbfbinnen.adct.it` (also shipped via `public/CNAME`); enable **Enforce HTTPS**.
3. DNS: `CNAME sbfbinnen → <your-github-user>.github.io`.
