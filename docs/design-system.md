# Design system

Maintainer reference for the Just Enable site. It describes the system as it is in the code, so when the two disagree, fix one of them. Source of truth for values is `src/styles/tokens.scss` and `tailwind.config.js`; this page explains the intent behind them.

## 1. Direction

The buyers spend their days in front of SCADA overviews and grey enclosures with engraved labels, where colour only ever means one thing. The site is that world as a company: an enclosure-grey ground, white label plates, black text, and one signal colour (the brand orange) used only where a state is true. In PLC terms an "enable" is the bit that switches a function on, so every lit orange lamp reads "enabled": the page you are on, the language you chose, the dark mode you switched on, and the four industries lit at the end of the home page's lamp test.

The rules that make it:

- **One signal colour.** `accent` (#FF6A00) fills the lit lamp, the primary button and the 3px title rule. It is never text in light mode, never a border, never an icon that carries meaning alone. Links and live labels use `accent-text`, a darker orange that passes as text.
- **Lamps only where state varies.** The astroid lamp appears in the nav (lit on the current page), the language menu and segmented picker (lit on the selected language), the theme rocker knob (lit when dark mode is on), the mimic's four terminals (lit after the lamp test) and the 404 card (unlit, the one page where the enable bit is 0). It does not appear on list markers, service cards, contact rows, the industries strip or the footer. A lamp that cannot go out is a bullet, and bullets are forbidden.
- **Identifiers encode a real position in a real list.** S1 to S4 (services), X1 to X4 (industries), A-01 to A-05 (automation sections), M-01 to M-06 (maintenance sections), 01 to 03 (about rows), 01 to 04 (contact channels), `404`. No initialisms, and `X` is used only for the four industry terminals. Identifiers are locale-invariant, never translated, and never carry meaning the adjacent translated text does not repeat.
- **Plates are literal label plates.** `.plate` is reserved for things that would be a plate on an enclosure: header, service cards, industries strip, reason sheet, CTA band, contact channel list, language popover, nameplate, 404 card. Intro prose, feature-section text and about paragraphs sit directly on the canvas.
- **Figures are ink on the canvas.** Every illustration on the service and about pages is an inline SVG drawn in the mimic's language (currentColor strokes, one accent marker for a state that is true, mono tags), wrapped by `app-figure` with a caption. No plate, no frame, no screen. Only the map sits on `.screen`, a fixed-light panel in both themes, so Google's tiles never land on graphite.
- **One choreographed moment.** The hero lamp test is the only orchestrated motion on the site. No scroll reveals, no parallax, no route transitions.

The mimic (`app-mimic`) is the signature element: a single-line plant overview in the home hero, and nowhere else. Not on other pages, not in the header or footer, never a watermark or background.

## 2. Tokens

Defined in `src/styles/tokens.scss` on `:root` (light), overridden under `.dark`, re-scoped under `.rear-panel`.

### Storage convention

Colour tokens are space-separated RGB channel triplets, not colours: `--color-ink: 17 20 17;`. Tailwind maps each one as `rgb(var(--color-ink) / <alpha-value>)` so utilities like `bg-ink/50` work. In SCSS always write `rgb(var(--color-ink))`; `var(--color-ink)` on its own is not a valid colour and silently produces nothing. Non-colour tokens are plain values.

### Colour

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--color-canvas` | #E8EAE7 | #17191B | page ground |
| `--color-surface` | #FFFFFF | #202326 | plates, header |
| `--color-surface-raised` | #F3F4F2 | #292D30 | chips, inset plates, sheet header, media ground |
| `--color-accent-soft` | #FFE3CF | #3A2416 | reason-sheet header row |
| `--color-border` | #C3C7C3 | #363B3E | decorative rules, plate edges |
| `--color-border-strong` | #6E746F | #7A8084 | interactive borders, unlit lamp ring |
| `--color-ink` | #111411 | #E9EAE6 | headings, primary text, strokes |
| `--color-ink-muted` | #454A46 | #B8BCB7 | body copy, eyebrows |
| `--color-ink-subtle` | #5F655F | #939893 | tags, captions (never below 12px) |
| `--color-accent` | #FF6A00 | #FF6A00 | lit lamp, primary button, title rule (non-text) |
| `--color-accent-hover` | #E85F00 | #FF7A1F | primary button hover |
| `--color-accent-text` | #A84000 | #FF8A3D | text-safe orange: links, ghost buttons |
| `--color-accent-contrast` | #111411 | #111411 | text on orange (stays black in both themes) |
| `--color-focus` | #A84000 | #FF8A3D | focus outline |
| `--color-screen` | #F3F4F2 | unchanged | map ground |

Every text pairing is at least 4.5:1 in both themes; the lowest are `ink-subtle` on the light canvas (4.94) and on the dark raised surface (4.73), which is why `ink-subtle` is only ever used at 12px or larger and never condensed. Plate-on-canvas contrast is only 1.21:1, so every plate carries a 1px `border`.

`.rear-panel` (the footer) re-declares the dark token set on one subtree in both themes, so Tailwind utilities keep working inside it and the footer is always the dark surface.

### Other tokens

- Spacing: `--space-1` to `--space-10` on an 8px module; `--section-y` (section padding, clamp 3.5rem to 6rem); `--plate-pad` (clamp 1.25rem to 2rem); `--gutter`.
- Radius: `--radius-1` 4px (buttons, chips, inputs, screens), `--radius-2` 6px (plates), `--radius-round` (rocker track and knob only). Nothing is a pill and nothing is square.
- Shadow: `--shadow-popover` only; elevation is expressed by plate borders, and shadows exist only for things that float (the language popover).
- Motion: `--dur-1` 120ms (colour, border, underline), `--dur-2` 200ms (rocker knob, panel, popover), `--dur-draw` 500ms (mimic bus), `--ease-out`, `--ease-std`.
- Z layers: `--z-panel` 40, `--z-header` 50, `--z-popover` 60, `--z-skip` 100.

Tailwind exposes these as `rounded-1`/`rounded-2`, `shadow-popover`, `duration-1`/`duration-2`, `ease-out`/`ease-std`, `z-panel`/`z-header`/`z-popover`/`z-skip`, `max-w-container` (75rem) and the colour names above. Extra screens: `xxxs` 300, `xxs` 360, `xs` 475 and `nav` 1180 (desktop nav bar; below it the panel takes over; the header reads the same value in `NAV_BAR_QUERY`).

Theme colour for the browser chrome is the header surface (#FFFFFF light, #202326 dark), set on two `<meta name="theme-color">` tags in `index.html`. The inline pre-paint script sets both from the stored preference before first paint; `ThemeService` rewrites both every time it applies a theme (start-up and each toggle). The two must stay in step.

## 3. Typography

### Packages and stacks

Fonts are self-hosted through fontsource and imported at the top of `src/styles.scss`:

- `@fontsource-variable/archivo/wdth.css`: Archivo with both the weight (100 to 900) and width (62% to 125%) axes. `index.css` would only carry weight, so keep `wdth.css`.
- `@fontsource-variable/ibm-plex-sans/wght.css`.
- `@fontsource/ibm-plex-mono/400.css` and `500.css`.

No italics are imported anywhere. An `Archivo Fallback` face (Arial or Helvetica with metric overrides) sits second in the display stack so the swap does not shift the hero.

| Tailwind family | Stack |
|---|---|
| `font-display` | Archivo Variable, Archivo Fallback, Arial Narrow, Arial, Helvetica, sans-serif |
| `font-sans` | IBM Plex Sans Variable, IBM Plex Sans, Helvetica Neue, Arial, sans-serif |
| `font-mono` | IBM Plex Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace |

Archivo's width axis is driven with `font-stretch` through the `stretch-75`, `stretch-85`, `stretch-100` and `stretch-112` utilities (a plugin in `tailwind.config.js`), never with `font-variation-settings`. `.font-mono` sets `tabular-nums`.

### Named scale

Every step is a `text-*` utility in `tailwind.config.js` that sets size, line height and, where relevant, tracking and weight.

| Step | Family | Size | Where |
|---|---|---|---|
| `display-xl` | Archivo 700, stretch 112 | 36 to 64px | home H1 |
| `display-l` | Archivo 650 | 28 to 44px | inner page H1 (title block), 404 H1 |
| `.tagline` | Archivo 500 | display-l size | home tagline (a class in `components.scss`, not a `text-*` step) |
| `heading-m` | Archivo 650 | 24 to 34px | section H2s, reason-sheet H2 |
| `heading-s` | Archivo 600 | 20 to 24px | service card and industries cell H3 |
| `eyebrow` | Archivo 600, stretch 85, uppercase | 13px | `.eyebrow`: title-block and hero eyebrows, footer column labels, contact row labels, nameplate labels, sheet header, panel labels |
| `lead` | Plex Sans 400 | 18 to 20px | title-block lead, CTA band text |
| `body` | Plex Sans 400 | 16px | dash-list items, card descriptions, about paragraphs, sheet notes, 404 message |
| `body-s` | Plex Sans 400 | 14px | defined, currently unused |
| `nav` | Plex Sans 500 | 15px | nav links and panel rows |
| `button` | Plex Sans 600 | 15px | all buttons |
| `tag` | Plex Mono 500, uppercase | 13px | `.tag`: section markers, identifiers, contents-row links, glyph captions, 404 readout, language code |
| `mono-value` | Plex Mono 400 | 15px | footer contact and address, tagline stack, copyright, nameplate values, contact address |
| `mono-value-l` | Plex Mono 500 | 18 to 24px | contact page email and phone values from `sm` |
| `caption` | Plex Mono 400 | 12px | glyph captions below 360px |

Rules: uppercase is applied with `text-transform` only, on the eyebrow and tag steps only; all prose and headings are sentence case. No `hyphens: auto` anywhere (browsers ship no patterns for zu or sw); `h1` to `h4` get `text-wrap: balance` and `overflow-wrap: anywhere` globally, and mono values and plate cells add `overflow-wrap: anywhere` where needed. Body measure is 68ch. Text containers never have fixed heights.

## 4. Layout primitives and CSS classes

All in `src/styles/components.scss`, inside `@layer components` so a utility on the same element still wins.

| Class | What it is |
|---|---|
| `.container-x` | `mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8`. Defined once, never nested. |
| `.section` | `padding-block: var(--section-y)`. Contains one `.container-x`. Grounds do not alternate; plates provide the rhythm. |
| `.section-marker` | A 1px top rule carrying the section's tag like a cable marker: `<div class="section-marker" aria-hidden="true"><span class="tag tag--chip">A-01</span></div>`. The chip straddles the line. The H2 that follows carries the matching `id` and `tabindex="-1"`; `h2[id]` gets `scroll-margin-top: 80px` globally so fragment links land clear of the sticky header. |
| `.plate` | `rounded-2 border border-border bg-surface`, padding `--plate-pad`. Add `p-0` when the content supplies its own padding. |
| `.plate--inset` | Plate on `surface-raised`: the nameplate. |
| `.screen` | Fixed-light panel (`tokens.scss`) for the map, edged with `border`. `.dark .screen` dims it with `brightness(0.94)`. |
| `.btn` | Base: inline-flex, min height 44px, `rounded-1`, `text-button`, colour transitions under `motion-safe:` only. Labels wrap (Afrikaans "Terug na die tuisblad" is 21 characters). |
| `.btn--primary` | `bg-accent text-accent-contrast`, hover `bg-accent-hover`. No gradient, shadow or transform. |
| `.btn--secondary` | Transparent with `border-border-strong`; `aria-checked="true"` or `.is-selected` fills it `bg-ink text-canvas` (not orange: the lamp carries the state). |
| `.btn--ghost` | `text-accent-text`, underline on hover, trailing arrow in an `aria-hidden` span. Hero secondary links and the map link. |
| `.btn--sm` / `.btn--lg` | 44px with tighter padding (the header's Contact button and the panel's language radios) / 52px (hero and CTA bands). |
| `.eyebrow` | `font-display stretch-85 text-eyebrow uppercase text-ink-muted`. Pattern with a tag: `<p class="eyebrow"><span class="tag text-ink-muted">A</span> · Automation</p>`. |
| `.tag` | `font-mono text-tag uppercase text-ink-subtle`; add `text-ink-muted` when it sits on the canvas. |
| `.tag--chip` | Tag on a `surface-raised` chip with `rounded-1`. |
| `.tagline` | The hero's second-largest text: Archivo 500 at display-l size. |
| `.dash-list` | `<ul>` whose items carry a 6px square `bg-ink-subtle` marker (a terminal, not a disc). Service page bullets. |
| `.hazard` | 8px repeating 45-degree ink/accent stripe. Exists only on the 404 card, top and bottom. |
| `.rear-panel` | The footer's re-scoped dark token set (`tokens.scss`). |
| `.reveal` / `.is-revealed` | Styles for `RevealDirective`. Not applied anywhere; see Motion. |

Global base rules in `src/styles.scss`: body is `bg-canvas font-sans text-body text-ink`; every element's default `border-color` is the `border` token; `:focus-visible` is a 2px `focus` outline with 2px offset (outline, not box-shadow, so it survives `overflow: hidden` and forced colours; under `forced-colors: active` it becomes `Highlight`); `main#main:focus` has no outline.

## 5. Component inventory

All components are NgModule-declared (`standalone: false`) except `NotFoundComponent`. Selectors are prefixed `app-`, directives `app` camelCase (enforced by ESLint).

### Shell (declared in `AppModule`)

| Selector | File | Inputs | Notes |
|---|---|---|---|
| `app-skip-link` | `components/skip-link` | none | First element in `app-root`; `sr-only` until focused, then a fixed primary button at `--z-skip`. Target is `main#main` (`tabindex="-1"`). |
| `app-site-header` | `layout/site-header` | none | Sticky, 64px from `nav`, 56px below. Renders `NAV`; text items carry `app-lamp [lit]="rla.isActive"` plus `aria-current` and an accent underline; the primary item is a `.btn--primary .btn--sm` with no lamp (its current state is an underline). Below `xxs` (360px) the wordmark is hidden and the brand link keeps its name from `A11Y.HOME_LINK`. Below `nav` a hamburger opens the panel (`#site-menu`): focus moves to the first row, Tab is trapped, Escape closes and returns focus, outside click and `NavigationEnd` close it, body scroll is locked, and widening past `nav` closes it. |
| `app-site-footer` | `layout/site-footer` | none | `footer.rear-panel`. Logo and wordmark, the five-language tagline stack (`TAGLINES`, fixed order, current one highlighted with `aria-current`), three columns from `NAV` and `CONTACT`, runtime year, `PRETORIA · ZA`. Plain links, no lamps. |
| `app-language-switcher` | `components/language-switcher` | `segmented` (boolean attribute) | Bar variant: trigger showing the code and a `role="menu"` of `menuitemradio` endonyms, each with its own `lang`; Arrow, Home, End, Escape, Tab, outside click. Segmented variant (panel): a `radiogroup` of `.btn--secondary .btn--sm` radios where arrows move and select. Both light a lamp beside the current language; `aria-checked` carries the state. |
| `app-theme-toggle` | `components/theme-toggle` | `labelled` (boolean attribute) | The rocker: `aria-pressed` = dark mode on; `O` and `I` marks (hidden below 360px), a 22px ink knob carrying a 10px lamp lit when dark. `labelled` shows the visible "Dark mode" eyebrow and links it with `aria-labelledby` instead of the sr-only text. Consumes `ThemeService` only. |

### UI primitives (`UiModule`, `src/app/shared/ui`, re-exported by `SharedModule`)

| Selector | Inputs | Notes |
|---|---|---|
| `app-lamp` | `lit` (required), `size` (number, default 8; 8 nav, 10 rocker, 14 404) | `aria-hidden` SVG. Lit: accent fill, ink ring. Unlit: no fill, `border-strong` ring. The path (`LAMP_PATH`) is a full astroid derived from the logo's spark, which is the left half with the same cubic control offsets. Contract: always the sibling of visible text that states the same thing, never blinks, never the only carrier of "current" or "selected". |
| `app-logo` | `height` (number, default 32; header 32, footer 28, nameplate 24) | The JE mark: `je-logo.webp` is opaque white, so it sits on a white `rounded-1` plate that reads as an engraved nameplate in both themes. Put `aria-hidden` on the host when it stands beside the wordmark. |

### Shared page components (`SharedModule`, `src/app/shared/components`)

| Selector | Inputs | Used on |
|---|---|---|
| `app-title-block` | `tag?`, `eyebrowKey`, `titleKey`, `titleParams?`, `leadKey?`, `leadParams?`, `contents?: { id, tag, key }[]` | Every inner page; the only thing that renders an H1 there. Eyebrow, H1 (`display-l`), 64 x 3px accent rule, optional lead (68ch) and an "On this page" `nav` of fragment links (44px tall). |
| `app-feature-section` | `tag`, `id`, `titleKey`, `reverse` | Automation (A-01 to A-04), Maintenance (M-01 to M-05), About (01 to 03). Section marker, `h2[id][tabindex=-1]`, slots `[body]` and `[figure]`; 7/5 grid from `lg`, figure first below. Pages alternate with `[reverse]="odd"`. The host's own `id` attribute is nulled so the H2 is the only element carrying the fragment id. |
| `app-reason-sheet` | `tag`, `id`, `titleKey`, `titleParams?`, `items: TitledText[] \| null` | A-05, M-06. A plate holding both a table (`md` and up) and a `<dl>` (below), switched with CSS. Items come from `UtilsService.streamTitledList`, which splits "Title: note" on the first colon and keeps a note without a title rather than dropping it. Same host `id` nulling as the feature section. |
| `app-figure` | `captionKey` | Every drawn figure on Automation, Maintenance and About. Projects the page's inline SVG (aria-hidden, drawn in the mimic's language) and sets a mono caption under it; no plate or frame; the drawing is capped at 280px tall below `lg`. The drawings themselves are page-local components: `app-process-figure`, `app-loop-figure`, `app-rack-figure`, `app-integration-figure` (Automation A-01 to A-04), `app-timeline-glyph` with five variants (Maintenance M-01 to M-05), `app-office-figure` and `app-stack-figure` (About 02 and 03). Each has exactly one accent element, for a state that is true in the drawing. |
| `app-cta-band` | `textKey`, `textParams?` | Closing plate on Home, Automation, Maintenance, About: one lead sentence and the primary contact button. |

### Page-local components

| Selector | Module | Inputs | Notes |
|---|---|---|---|
| `app-mimic` | Home | none; `.is-testing` set by `HomeComponent` | Inline SVG, `role="img"` with translated `<title>` and `<desc>`. Landscape variant from `md`, portrait below, both from `NODES` and `TERMINALS`. Only tags live inside the SVG. |
| `app-service-card` | Home | `tag`, `titleKey`, `descriptionKey`, `media: { kind: 'photo', src, altKey, position, width, height } \| { kind: 'ladder' }` | Plate with a 4:3 media slot, tag, H3, description. Not a link, no hover. |
| `app-ladder-figure` | Home | none | The software engineering card's media: a PLC ladder rung pair in `currentColor`, `aria-hidden`. |
| `app-timeline-glyph` | Maintenance | `variant: 'preventive' \| 'corrective' \| 'predictive' \| 'asset' \| 'facility'` | Inset plate with a 240 x 48 schedule strip and a visible `figcaption` from `MAINTENANCE.GLYPH_*`. The marker is an orange dot, not a lamp. |
| `app-nameplate` | About | none | Inset plate: logo and a `<dl>` of company, motto (`HOME.SUBTITLE`), location (the locality only, a literal in the component; the full address belongs to the footer and contact page) and the contact email from `CONTACT`. |
| `NotFoundComponent` | standalone, imports `SharedModule` | none | Hazard stripe, unlit 14px lamp beside `404`, H1, message, primary button. Client-rendered behind the Netlify SPA fallback. |

Contact channel rows and the map are plain markup in `ContactUsComponent`; the industries strip (`.terminal-cell`) is plain markup in `HomeComponent`. Contact identifiers (email, numbers) do not use `overflow-wrap: anywhere`: they carry a `<wbr>` after the `@` (`breakParts`) so the email breaks as "info@" over the domain instead of mid-word.

### Services and constants

- `ThemeService` (`services/theme.service.ts`): `theme` and `isDark` signals, `toggle()`, `set()`. Reads `localStorage.isDarkMode` (`'true'` / `'false'`), falls back to the OS preference and follows OS changes until a preference is stored. Toggles `.dark` on `<html>`, sets `color-scheme`, syncs both theme-color meta tags. Browser only; the inline script in `index.html` applies the same logic before first paint and must be kept in step.
- `LayoutService` (`services/layout.service.ts`): `menuOpen` signal with `openMenu()` / `closeMenu()`. `AppComponent` binds `inert` on `<main>` and the footer from it.
- `src/app/shared/navigation.ts` `NAV`: the five items rendered by the header bar, the panel and the footer.
- `src/app/shared/languages.ts` `LANGUAGES` (endonyms, fixed order af, en, fr, sw, zu), `LanguageCode`, `DEFAULT_LANGUAGE`, `isLanguageCode()`, `currentLanguage()` (typed signal over ngx-translate's current language).
- `src/app/shared/taglines.ts` `TAGLINES`: imported from `src/assets/i18n/taglines.json`.
- `src/app/shared/contact.ts` `CONTACT`: email, phone, mobile, their hrefs, address lines, maps URL. Shared by the footer, the contact page and the nameplate; the JSON-LD in `index.html` repeats them by hand.
- `RevealDirective` (`directives/reveal.directive.ts`): the sanctioned scroll-reveal mechanism, kept with its spec but applied to nothing. Adding `appReveal` anywhere is a design decision, not a tweak.
- `ClickElsewhereDirective`: outside-click close for the panel and the language menu.

## 6. Motion

**The lamp test.** Once per browser session, `HomeComponent` decides in its constructor (browser only, `sessionStorage['je:lamp-test']` not yet set, reduced motion not requested) to bind `.is-testing` on `app-mimic` and writes the flag. It is decided before the first client render so the hydrated DOM never shows the finished picture, hides it, then animates. The sequence is CSS keyframes with `animation-fill-mode: both`, 1.1s in total: lines draw in over `--dur-draw` (`pathLength="1"` on every line so one dash is the whole line), X1 to X4 fill 120ms apart, then the S labels appear. Every hidden start value lives in a keyframe `from` block under `.is-testing`, so prerendered HTML, revisits and reduced motion all show the finished, lit state. Nothing pulses afterwards: a blinking lamp in this world is an alarm.

**Utility motion**, all gated on `motion-safe:` or `prefers-reduced-motion: no-preference`:

- Colour, border and underline transitions, 120ms.
- Rocker knob 200ms `--ease-std`; the theme switch itself has no cross-fade, because a global transition flashes every plate.
- Mobile panel and language popover, 200ms.
- No hover transforms anywhere.

**Reduced motion**: no lamp test (the class is never added, and a belt-and-braces rule sets `animation: none` under it), no transitions, `RevealDirective` adds no classes. Nothing is ever hidden when animations are off.

After each navigation to a different path, `AppComponent` moves focus to `main#main` and the router scrolls to top; fragment-only navigation (the contents row) is left to `anchorScrolling`.

## 7. Accessibility rules a change must keep

- Exactly one H1 per page; heading order never skips (H2 sections, H3 cards and cells). Eyebrows and markers are `<p>` or `<div>`, never headings. Reason-sheet items are `th scope="row"`.
- Landmarks: skip link first, `header > nav[aria-label]`, `main#main[tabindex=-1]`, `footer > nav[aria-label]`, labels translated.
- The lamp is never the sole state cue: nav = `aria-current` + underline + lamp; language = `aria-checked` + lamp; rocker = `aria-pressed` + knob position + marks. Every lamp has a visible text sibling. Every SVG figure is `aria-hidden` with visible text nearby, except the mimic, which is `role="img"` with `<title>` and `<desc>`.
- `accent` is never text, border, or a sole icon on light grounds. `border-strong` on anything interactive; `border` is decorative only. Every text pairing stays at or above 4.5:1 in both themes and on the rear panel.
- Focus: `:focus-visible` outline visible on every control in both themes and in forced-colours mode. Panel and menu keyboard paths (Escape closes and returns focus, Tab trapped in the panel, arrows in the menu) are exercised by the specs; keep them green.
- Targets: 44 x 44 minimum everywhere; panel rows 48px; contact rows 56px; footer links padded to 44px.
- Text: no fixed heights on text containers, no `text-overflow: ellipsis`, no `hyphens: auto`, uppercase only via `text-transform` on the two 13px steps. No horizontal scroll at 320px wide or 200% zoom in any of the five locales (Zulu FMCG is 48 characters; French nav must fit at 1180px).
- Media: photos have descriptive `alt` from `IMG.*` keys plus `width`, `height` and `loading="lazy"`. The map iframe has a translated `title` and the address plus "Open in Google Maps" (with an sr-only new-tab note) beside it.
- Language: `<html lang>` follows the selection; the address carries `lang="en"`; email and numbers carry `translate="no"`; each language item carries its own `lang`.
- Theme: `color-scheme` on `:root` and `.dark`; no flash on reload in either theme; the theme class lives on `<html>`, never on `<body>`.

## 8. i18n rules

- Five locales, `src/assets/i18n/{af,en,fr,sw,zu}.json`, flat dotted keys (`GLOBAL.ASSET_MANAGEMENT`), sorted. Every key exists in all five files; there is no fallback merging beyond ngx-translate's `fallbackLang: 'en'` for missing keys at runtime, which the check script makes impossible to ship.
- `npm run i18n:check` (`scripts/check-i18n.mjs`) fails the build on: a key missing from or extra in any locale versus `en.json`; unsorted keys; empty values; any `*_OUTRO_TEXT.n` without a colon (the reason sheet splits on it); `<br>` in a value (use numbered `.0`/`.1` keys and separate `<p>` elements); leading or trailing whitespace; and any drift between `src/assets/i18n/taglines.json` and each locale's `HOME.SUBTITLE`.
- `taglines.json` exists because the footer shows all five taglines at once. It is imported by `src/app/shared/taglines.ts`, so editing `HOME.SUBTITLE` means editing it too.
- Numbered lists live under `PREFIX.0`, `PREFIX.1`, and are read by `UtilsService.streamTitledList(prefix)` as "Title: note" strings.
- Locale-invariant strings are never keys: S1 to S4, X1 to X4, A-01 and M-01 series, 01 to 04, `404`, the ladder labels (`L+`, `M`, `I0.0`, `I0.1`, `Q0.0`, `Q0.1`, `T1`, `TON`), `O`, `I`, `PRETORIA · ZA`, the company name, email, phone numbers and address lines.
- `scripts/check-i18n.mjs` is plain ESM and is linted by `npm run lint` (angular.json lists `scripts/**/*.mjs`; `eslint.config.js` gives it a Node block without the Angular rules).
- Language names are endonyms from `LANGUAGES`, not translation keys; `LANGUAGE.*` keys remain in the files but are not rendered.
- Copy is sentence case in every locale. Identifiers stay uppercase via CSS.

## 9. Assets

- `src/assets/img`: `je-logo.webp` (472 x 596, opaque white; OG image and the mark in `app-logo`, on a white plate), `design-engineering.webp`, `project-management-2.webp`, `maintenance-and-general-work.webp` (S1, S3, S4 cards, 4:3 crops with per-image `object-position`; `.dark` dims them with `brightness(0.92)`).
- There are no animation assets: every figure is an inline SVG component, so nothing is fetched for illustrations.
- `src/assets/icon`: `favicon.svg` (ink rounded square with an accent astroid lamp, the primary icon) and `favicon.png` (32px fallback).
- Fonts come from `node_modules` via fontsource; nothing is copied into `src/assets`.
- Filenames are kebab-case.

## 10. Open follow-ups

Carried over from the design brief and still open:

1. **Founding year.** `GLOBAL.OUR_STORY_TEXT.0` no longer states an age. Once the client confirms the year, prepend "Just Enable was founded in YYYY." in all five locales.
2. **OG image.** A 1200 x 630 image (logo on white with the tagline) to replace the raw logo in the OG and Twitter tags.
3. **Native-speaker review** of all af, fr, sw and zu strings added or re-cased in the redesign.
4. **Map click-to-load.** An address card with a "Show map" button would avoid about 1 MB of third-party load per contact visit; the brief asked for an embedded iframe, so confirm with the client. Also confirm the 2023 embed URL still resolves.
5. **Figure captions** (`AUTOMATION.FIGURE_*`, `ABOUT.FIGURE_*`) in af, fr, sw and zu were drafted without a native speaker; include them in the review above.
6. **Real-device pass** at 1024 to 1179px (tablet landscape gets the panel) in French and Zulu, and a mid-range Android profile of the lamp test.
