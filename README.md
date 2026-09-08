# Justenable

Marketing site for Just Enable, a Pretoria engineering company offering design engineering, software engineering, project management, automation and maintenance services. Angular 20 (NgModule-based, prerendered to static HTML), Tailwind CSS 3.4, ngx-translate in five languages, self-hosted fonts, light and dark themes.

The design is a control-room world: enclosure-grey canvas, white label plates, one signal colour used only where a state is true. See `docs/design-system.md` before changing templates or styles.

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
npm run lint        # ESLint via angular-eslint (src and scripts/)
npm run i18n:check  # locale files consistent with each other and with taglines.json
npm run build       # production build to www/
npm run test:ci     # Karma headless (set CHROME_BIN if Chrome is not on PATH)
```

## Deploy

Netlify, configured in `netlify.toml`:

- Build command: `npm run build`, publish dir `www/browser`.
- Routes (`/`, `/automation`, `/maintenance`, `/about-us`, `/contact-us`) are prerendered to static HTML (`outputMode: static`), in English and the light theme; the inline script in `index.html` applies the stored theme before first paint and the app applies the stored language on bootstrap.
- Unknown routes fall through a non-forced redirect to `index.csr.html` with a 404 status (SPA fallback), which renders the 404 page client-side without being indexed.

## i18n

Five locales in `src/assets/i18n/`: `en`, `af`, `fr`, `sw`, `zu`. Keys are flat and dotted (e.g. `GLOBAL.ASSET_MANAGEMENT`) and sorted. When adding a key, add it to all five files -- there is no fallback merging.

`src/assets/i18n/taglines.json` holds each locale's `HOME.SUBTITLE` so the footer can show all five taglines at once; edit both when the tagline changes.

`npm run i18n:check` (`scripts/check-i18n.mjs`) fails on:

- a key missing from, or extra in, any locale compared with `en.json`
- keys out of sorted order, or empty values
- a `*_OUTRO_TEXT.n` value without a colon (the reason sheet splits "Title: note" on it)
- `<br>` in a value, or leading/trailing whitespace
- any difference between `taglines.json` and a locale's `HOME.SUBTITLE`

Language names are endonyms from `src/app/shared/languages.ts`; identifiers such as `S1`, `X1`, `A-01` are locale-invariant and never translation keys.

## Design system

Tokens live in `src/styles/tokens.scss` (RGB triplets, mapped in `tailwind.config.js`), shared classes in `src/styles/components.scss`, and the rules, component inventory, motion and accessibility requirements in `docs/design-system.md`.

## TODO

- Founding year: add "Just Enable was founded in YYYY." to `GLOBAL.OUR_STORY_TEXT.0` in all five locales once confirmed
- OG image: a 1200 x 630 image instead of the raw logo in the meta tags
- Native-speaker review of the af, fr, sw and zu strings added or re-cased in the redesign
- Map click-to-load on the contact page (confirm with the client; confirm the 2023 embed URL still resolves)
- Real-device pass at 1024 to 1179px in French and Zulu; lamp test on a mid-range Android
