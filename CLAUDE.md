# Justenable

Marketing site for Justenable. Angular 20 + Tailwind 3.4, deployed to Netlify.

## Commands

- `npm start` -- dev server (localhost:4200)
- `npm run build` -- production build to `www/` (Netlify publishes `www/browser`)
- `npm run test:ci` -- Karma headless; set `CHROME_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"` if needed
- `npm run lint` -- ESLint (angular-eslint; also covers `scripts/**/*.mjs`)
- `npm run i18n:check` -- `scripts/check-i18n.mjs`: key parity, sort order, colons in `*_OUTRO_TEXT.n`, no `<br>`, `taglines.json` in sync

## Architecture

- NgModule-based app (not standalone-first). Pages under `src/app/pages/*` are lazy-loaded modules; routes: `/`, `/automation`, `/maintenance`, `/about-us`, `/contact-us`, plus a `**` standalone NotFoundComponent. Router has `anchorScrolling` and `scrollPositionRestoration: 'top'`.
- Shell (declared in `AppModule`): `app-skip-link`, `app-site-header` (`src/app/layout/site-header`), `app-site-footer`, `app-language-switcher`, `app-theme-toggle` (`src/app/components/*`). `app.component.html` wraps the outlet in `main#main[tabindex=-1]` and makes main and footer `inert` while the mobile panel is open.
- `src/app/shared/shared.module.ts` re-exports common modules, `UiModule` (`app-lamp`, `app-logo` in `src/app/shared/ui`) and the shared page components in `src/app/shared/components`: `app-title-block`, `app-feature-section`, `app-reason-sheet`, `app-cta-band`, `app-figure` (wrapper for the drawn SVG figures that live in each page folder under `figures/`). Import `SharedModule` instead of duplicating imports.
- Services: `ThemeService` (theme signal, `.dark` on `<html>`, `isDarkMode` in localStorage, theme-color meta sync; mirrors the inline pre-paint script in `index.html`), `LayoutService` (`menuOpen` signal), `TranslatedTitleStrategy` (route `title` keys), `UtilsService.streamTitledList`.
- Constants in `src/app/shared`: `NAV` (header, panel, footer), `LANGUAGES` (endonyms, `LanguageCode`), `TAGLINES` (from `src/assets/i18n/taglines.json`), `CONTACT` (footer, contact page, nameplate).
- Styles: `src/styles/tokens.scss` (CSS variables, light on `:root`, dark under `.dark`, `.rear-panel`, `.screen`), `src/styles/components.scss` (`.container-x`, `.section`, `.section-marker`, `.plate`, `.btn*`, `.eyebrow`, `.tag`, `.dash-list`, `.hazard`), `src/styles.scss` (font imports, base layer). Colour tokens are RGB triplets: always `rgb(var(--color-x))`, never `var(--color-x)` alone; `tailwind.config.js` maps them with `<alpha-value>`.
- Fonts are self-hosted via `@fontsource` imports at the top of `src/styles.scss` (Archivo `wdth.css`, IBM Plex Sans, IBM Plex Mono). No Swiper, no `CUSTOM_ELEMENTS_SCHEMA`.
- i18n: ngx-translate with flat dotted keys in `src/assets/i18n/{en,af,fr,sw,zu}.json`. Every key must exist in all 5 files; `npm run i18n:check` enforces it.
- Build is `outputMode: static` -- all routes prerendered (English, light); Netlify serves `index.csr.html` with a 404 status for unknown URLs. Client hydration is on: an app initializer loads the stored language before the first render so the prerendered DOM is reused (see `app.module.ts`).

## Conventions

- Strict TypeScript (`strict`, `strictTemplates`); keep it that way.
- Design rules live in `docs/design-system.md`; read it before touching templates or styles.
- One signal colour: `accent` is never text, a border or a sole icon in light mode; use `accent-text` for links.
- Lamps (`app-lamp`) only where state can vary (nav, language, theme rocker, mimic, 404); never as a bullet or decoration, never the only state cue.
- Identifiers (S1, X1, A-01, M-01, 01) are locale-invariant, never translation keys, uppercase via CSS only.
- Copy is sentence case in every locale; `<br>` and `innerHTML` are not used in translations (numbered `.0`/`.1` keys instead).
- No comments explaining "what" -- comments answer "why" only.
- No em dashes in code, copy or docs; use `--` or rephrase.
- Asset filenames are kebab-case (`src/assets/img`, `src/assets/animation`).
- Animation JSONs in `src/assets/animation/` are minified; keep them that way.
