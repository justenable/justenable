# Justenable

Marketing site for Justenable. Angular 20 + Tailwind, deployed to Netlify.

## Commands

- `npm start` -- dev server (localhost:4200)
- `npm run build` -- production build to `www/` (Netlify publishes `www/browser`)
- `npm run test:ci` -- Karma headless; set `CHROME_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"` if needed
- `npm run lint` -- ESLint (angular-eslint)

## Architecture

- NgModule-based app (not standalone-first). Pages under `src/app/pages/*` are lazy-loaded modules; routes: `/`, `/automation`, `/maintenance`, `/about-us`, `/contact-us`, plus a `**` standalone NotFoundComponent.
- `src/app/shared/shared.module.ts` re-exports common modules/components; import it instead of duplicating imports.
- Page titles come from `TranslatedTitleStrategy` (`src/app/services/translated-title.strategy.ts`) via route `title` keys.
- Theme: dark mode toggles the `dark` class on `document.documentElement` (Tailwind `darkMode: 'class'`); persisted in localStorage, guarded for prerender (no `document` on server).
- i18n: ngx-translate with flat dotted keys in `src/assets/i18n/{en,af,fr,sw,zu}.json`. Every key must exist in all 5 files.
- Build is `outputMode: static` -- all routes prerendered; Netlify SPA fallback handles unknown URLs.

## Conventions

- Strict TypeScript (`strict`, `strictTemplates`); keep it that way.
- No comments explaining "what" -- comments answer "why" only.
- Asset filenames are kebab-case (`src/assets/img`, `src/assets/animation`).
- Animation JSONs in `src/assets/animation/` are minified; keep them that way.
