# Justenable

Marketing site for Justenable. Angular 22 + Tailwind 4 on Node 24, deployed to Netlify.

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
- Styles: `src/styles/tokens.scss` (CSS variables, light on `:root`, dark under `.dark`, `.rear-panel`, `.screen`), `src/styles/components.scss` (`.container-x`, `.section`, `.section-marker`, `.plate`, `.btn*`, `.eyebrow`, `.tag`, `.dash-list`, `.hazard`), `src/styles.scss` (font imports, base layer). Colour tokens are RGB triplets: always `rgb(var(--rgb-x))`, never `var(--rgb-x)` alone; `tokens.scss` maps each to a real `--color-x` via its `colours` mixin and `theme.scss` registers those names with Tailwind (alpha via `color-mix`). Shadow tokens are `--elevation-*` for the same reason: `--shadow-*` is Tailwind's own namespace.
- Fonts are self-hosted via `@fontsource` imports at the top of `src/styles.scss` (Archivo `wdth.css`, IBM Plex Sans, IBM Plex Mono). No Swiper, no `CUSTOM_ELEMENTS_SCHEMA`.
- i18n: ngx-translate with flat dotted keys in `src/assets/i18n/{en,af,fr,sw,zu}.json`. Every key must exist in all 5 files; `npm run i18n:check` enforces it.
- Build is `outputMode: static` -- all routes prerendered (English, light); Netlify serves `index.csr.html` with a 404 status for unknown URLs. Client hydration is on: an app initializer loads the stored language before the first render so the prerendered DOM is reused (see `app.module.ts`).

## Styling

- Tailwind 4 is CSS-first: the theme is `src/styles/theme.scss` (`@theme`, `@utility`, `@custom-variant`), not a `tailwind.config.js`. `.postcssrc.json` wires the `@tailwindcss/postcss` plugin.
- Colour tokens are RGB triplets under `--rgb-*`; `tokens.scss` maps each to a real `--color-*` with its `colours` mixin. Re-scoping the triplets (`.dark`, `.rear-panel`) must re-run that mixin.
- A component stylesheet using `@apply` must start with `@reference '<rel>/styles/tailwind-reference.scss';`.

## Conventions

- Strict TypeScript (`strict`, `strictTemplates`); keep it that way.
- Design rules live in `docs/design-system.md`; read it before touching templates or styles.
- One signal colour: `accent` is never text, a border or a sole icon in light mode; use `accent-text` for links.
- Lamps (`app-lamp`) only where state can vary (nav, language, theme rocker, mimic, 404); never as a bullet or decoration, never the only state cue.
- Identifiers (S1, X1, A-01, M-01, 01) are locale-invariant, never translation keys, uppercase via CSS only.
- Copy is sentence case in every locale; `<br>` and `innerHTML` are not used in translations (numbered `.0`/`.1` keys instead).
- Keyframes may live in a component stylesheet only if the `animation:` declaration sits in a top-level rule (never as the first declaration inside an at-rule) and is switched off by a separate `@media (prefers-reduced-motion: reduce)` override; otherwise declare them in the global styles (`src/styles/components.scss`, `src/styles/figure-motion.scss`). Angular's emulated encapsulation renames a component's `@keyframes` but does not rewrite an `animation:` that a minified production build leaves opening a rule inside a media block, so that motion is silently inert. See `docs/design-system.md` section 7 for the full authoring rule. Every animation is finite, never blinks, and leaves nothing hidden under `prefers-reduced-motion: reduce`.
- No comments explaining "what" -- comments answer "why" only.
- No em dashes in code, copy or docs; use `--` or rephrase.
- Asset filenames are kebab-case (`src/assets/img`, `src/assets/icon`, `src/assets/og`).
