# Justenable

Marketing site for Justenable (software engineering, automation, and maintenance services). Angular 20, NgModule-based, Tailwind CSS, ngx-translate.

## Requirements

- Node >= 18

## Getting started

```sh
npm install
npm start        # dev server at http://localhost:4200
```

## Gates

Run these before committing:

```sh
npm run build    # production build to www/
npm run test:ci  # Karma headless (set CHROME_BIN if Chrome is not on PATH)
npm run lint     # ESLint via angular-eslint
```

## Deploy

Netlify, configured in `netlify.toml`:

- Build command: `npm run build`, publish dir `www/browser`.
- Routes (`/`, `/automation`, `/maintenance`, `/about-us`, `/contact-us`) are prerendered to static HTML (`outputMode: static`).
- Unknown routes fall through a non-forced 200 redirect to `index.csr.html` (SPA fallback), which renders the 404 page client-side.

## i18n

Five locales in `src/assets/i18n/`: `en`, `af`, `fr`, `sw`, `zu`. Keys are flat and dotted (e.g. `GLOBAL.ASSET_MANAGEMENT`). When adding a key, add it to all five files -- there is no fallback merging.

## TODO

- Confirm production domain: justenable.co.za
