# Design system

Maintainer reference for the Just Enable site. It describes the system as it is in the code, so when the two disagree, fix one of them. Source of truth for values is `src/styles/tokens.scss` and `src/styles/theme.scss` (the Tailwind 4 `@theme`, which replaced `tailwind.config.js`); this page explains the intent behind them.

## 1. Direction

The buyers spend their days in front of SCADA overviews and grey enclosures with engraved labels, where colour only ever means one thing. The site is that world as a company: an enclosure-grey ground, white label plates, black text, and one signal colour (the brand orange) used only where a state is true. In PLC terms an "enable" is the bit that switches a function on, so every lit orange lamp reads "enabled": the page you are on, the language you chose, the dark mode you switched on, and the four industries lit at the end of the home page's lamp test.

The rules that make it:

- **One signal colour.** `accent` (#FF6A00) fills the lit lamp, the primary button and the 3px title rule. It is never text in light mode, never a border, never an icon that carries meaning alone. Links and live labels use `accent-text`, a darker orange that passes as text.
- **Lamps only where state varies.** The astroid lamp appears in the nav (lit on the current page), the language menu and segmented picker (unlit on the four languages you did not choose; the selected one shows a check mark instead, because an accent lamp on that inverted fill is unreadable, see Selected language), the theme rocker knob (lit when dark mode is on), the mimic's four terminals (lit after the lamp test), the section rail of the service and about pages (lit on the section in view, the one lamp on those pages) and the 404 card (unlit, the one page where the enable bit is 0). It does not appear on list markers, service cards, contact rows, the industries strip or the footer. A lamp that cannot go out is a bullet, and bullets are forbidden.
- **Identifiers encode a real position in a real list.** S1 to S4 (services), X1 to X4 (industries), A-01 to A-05 (automation sections), M-01 to M-06 (maintenance sections), 01 to 03 (about rows), 01 to 04 (contact channels), `404`; the home page's section markers are `S`, `X` and `I` (services, industries, index). No initialisms, and `X` is used only for the four industry terminals. Identifiers are locale-invariant, never translated, and never carry meaning the adjacent translated text does not repeat.
- **Plates are literal label plates.** `.plate` is reserved for things that would be a plate on an enclosure: header, service cards, industries strip, reason sheet, CTA band, contact channel list, language popover, nameplate, 404 card. Intro prose, feature-section text and about paragraphs sit directly on the canvas.
- **Figures are ink on the canvas.** Every illustration on the service and about pages is an inline SVG drawn in the mimic's language (currentColor strokes, one accent marker for a state that is true, mono tags), wrapped by `app-figure` with a caption. No plate, no frame, no screen. Only the map sits on `.screen`, a fixed-light panel in both themes, so Google's tiles never land on graphite.
- **Motion shows structure or a state changing, then stops.** Lines draw in, the lamp test runs, sections and plates arrive as you scroll, the page you leave fades into the page you open. Every animation is finite (done within 5 s of its trigger, nothing loops), physical (short distances, 120 to 900 ms, `--ease-out`) and absent under `prefers-reduced-motion: reduce`, where nothing is ever hidden. A blinking lamp is an alarm, so nothing pulses. Section 6 is the vocabulary.

The mimic (`app-mimic`) is the signature element: a single-line plant overview in the home hero, and nowhere else. Not on other pages, not in the header or footer, never a watermark or background.

## 2. Tokens

Defined in `src/styles/tokens.scss` on `:root` (light), overridden under `.dark`, re-scoped under `.rear-panel`.

### Storage convention

Colour tokens are space-separated RGB channel triplets, not colours, and live under `--rgb-*`: `--rgb-ink: 17 20 17;`. `tokens.scss` turns each one into a real colour with its `colours` mixin (`--color-ink: rgb(var(--rgb-ink))`), and `theme.scss` registers those `--color-*` names with Tailwind, so utilities like `bg-ink/50` work (Tailwind 4 adds the alpha with `color-mix`, which replaced the v3 `<alpha-value>` placeholder). In SCSS always write `rgb(var(--rgb-ink))`; `var(--rgb-ink)` on its own is not a valid colour and silently produces nothing. Non-colour tokens are plain values.

The two namespaces must stay distinct: `--rgb-*` holds triplets, `--color-*` holds colours. Any scope that re-points the triplets has to `@include colours` as well, or Tailwind keeps the colour computed at `:root` — this is what `.dark` and `.rear-panel` do.

### Colour

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--rgb-canvas` | #E8EAE7 | #17191B | page ground |
| `--rgb-surface` | #FFFFFF | #202326 | plates, header |
| `--rgb-surface-raised` | #F3F4F2 | #292D30 | chips, inset plates, sheet header, media ground |
| `--rgb-accent-soft` | #FFE3CF | #3A2416 | reason-sheet header row |
| `--rgb-border` | #C3C7C3 | #363B3E | decorative rules, plate edges |
| `--rgb-border-strong` | #6E746F | #7A8084 | interactive borders, unlit lamp ring |
| `--rgb-ink` | #111411 | #E9EAE6 | headings, primary text, strokes |
| `--rgb-ink-muted` | #454A46 | #B8BCB7 | body copy, eyebrows |
| `--rgb-ink-subtle` | #5F655F | #939893 | tags, captions (never below 12px) |
| `--rgb-accent` | #FF6A00 | #FF6A00 | lit lamp, primary button, title rule (non-text) |
| `--rgb-accent-hover` | #E85F00 | #FF7A1F | primary button hover |
| `--rgb-accent-text` | #A84000 | #FF8A3D | text-safe orange: links, ghost buttons |
| `--rgb-accent-contrast` | #111411 | #111411 | text on orange (stays black in both themes) |
| `--rgb-focus` | #A84000 | #FF8A3D | focus outline |
| `--rgb-screen` | #F3F4F2 | unchanged | map ground |

Every text pairing is at least 4.5:1 in both themes; the lowest are `ink-subtle` on the light canvas (4.94) and on the dark raised surface (4.73), which is why `ink-subtle` is only ever used at 12px or larger and never condensed. Plate-on-canvas contrast is only 1.21:1, so every plate carries a 1px `border`.

`.rear-panel` (the footer) re-declares the dark token set on one subtree in both themes and re-runs the `colours` mixin, so Tailwind utilities keep working inside it and the footer is always the dark surface.

### Other tokens

- Spacing: `--space-1` to `--space-10` on an 8px module; `--section-y` (section padding, clamp 2.5rem to 4.5rem); `--plate-pad` (clamp 1.25rem to 2rem); `--gutter` (the `.container-x` padding: 1rem, 1.5rem from `sm`, 2rem from `lg`, 3rem from `xl`).
- Radius: `--radius-1` 4px (buttons, chips, inputs, screens), `--radius-2` 6px (plates), `--radius-round` (rocker track and knob only). Nothing is a pill and nothing is square.
- Shadow: `--elevation-popover` and `--elevation-header`; elevation is expressed by plate borders, and shadows exist only for things that float: the language popover, and the header once content has scrolled under it. The token name avoids Tailwind's own `--shadow-*` namespace: `theme.scss` maps `shadow-popover`/`shadow-header` onto these with `var()`, so the dark theme's stronger values still reach the utilities (a literal in `@theme` would be frozen at its light value).
- Motion: `--dur-1` 120ms (colour, border, underline, button lift), `--dur-2` 200ms (rocker knob, panel, popover, nav underline, ghost arrow), `--dur-reveal` 480ms (scroll reveal), `--dur-draw` 500ms (mimic bus), `--dur-figure` 700ms and `--dur-figure-step` 60ms (one figure line, and the stagger between lines), `--dur-route-out` 160ms and `--dur-route-in` 240ms (route transition), `--ease-out`, `--ease-std`.
- Anchors: `--anchor-offset` 80px, where a fragment target lands below the viewport top (the 64px header plus a 16px breath). `h2[id]` uses it as `scroll-margin-top`, and `SmoothViewportScroller` reads the same token (below, under `.section-marker` and In-page scrolling).
- Z layers: `--z-panel` 40, `--z-header` 50, `--z-popover` 60, `--z-skip` 100.

Tailwind exposes these as `rounded-1`/`rounded-2`, `shadow-popover`/`shadow-header`, `duration-1`/`duration-2`/`duration-reveal`, `ease-out`/`ease-std`, `z-panel`/`z-header`/`z-popover`/`z-skip`, `max-w-container` (90rem, so the page spans 1440px at most and uses the whole width below that) and the colour names above. Extra screens: `xxxs` 300, `xxs` 360, `xs` 475 and `nav` 1180 (desktop nav bar; below it the panel takes over; the header reads the same value in `NAV_BAR_QUERY`).

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

Archivo's width axis is driven with `font-stretch` through the `stretch-75`, `stretch-85`, `stretch-100` and `stretch-112` utilities (`@utility` rules in `src/styles/theme.scss`), never with `font-variation-settings`. `.font-mono` sets `tabular-nums`.

### Named scale

Every step is a `text-*` utility in `src/styles/theme.scss` that sets size, line height and, where relevant, tracking and weight.

| Step | Family | Size | Where |
|---|---|---|---|
| `display-xl` | Archivo 700, stretch 112 | 36 to 80px | home H1 (`max-w-[22ch]`, `text-wrap: balance` off: it fights the line rhythm) |
| `display-l` | Archivo 650 | 28 to 44px | inner page H1 (title block), 404 H1 |
| `.tagline` | Archivo 500 | display-l size | home tagline (a class in `components.scss`, not a `text-*` step) |
| `heading-m` | Archivo 650 | 24 to 34px | section H2s, reason-sheet H2 |
| `heading-s` | Archivo 600 | 20 to 24px | service card and industries cell H3 |
| `eyebrow` | Archivo 600, stretch 85, uppercase | 13px | `.eyebrow`: title-block and hero eyebrows, footer column labels, contact row labels, nameplate labels, sheet header, panel labels |
| `lead` | Plex Sans 400 | 18 to 20px | title-block lead, CTA band text |
| `body` | Plex Sans 400 | 16px | dash-list items, card descriptions, about paragraphs, sheet notes, 404 message |
| `body-s` | Plex Sans 400 | 14px | section rail names, figure outcome lines |
| `nav` | Plex Sans 500 | 15px | nav links and panel rows |
| `button` | Plex Sans 600 | 15px | all buttons |
| `tag` | Plex Mono 500, uppercase | 13px | `.tag`: section markers, identifiers, contents-row links, glyph captions, 404 readout, language code |
| `mono-value` | Plex Mono 400 | 15px | footer contact and address, tagline stack, copyright, nameplate values, contact address |
| `mono-value-l` | Plex Mono 500 | 18 to 24px | contact page email and phone values from `sm` |
| `caption` | Plex Mono 400 | 12px | glyph captions below 360px |

Rules: uppercase is applied with `text-transform` only, on the eyebrow and tag steps only; all prose and headings are sentence case. No `hyphens: auto` anywhere (browsers ship no patterns for zu or sw); `h1` to `h4` get `text-wrap: balance` and `overflow-wrap: anywhere` globally, and mono values and plate cells add `overflow-wrap: anywhere` where needed. Body and lead measure is 68ch: on wide screens the layout and the drawings fill the space, the words do not. Text containers never have fixed heights.

## 4. Layout primitives and CSS classes

All in `src/styles/components.scss`, inside `@layer components` so a utility on the same element still wins. `tokens.scss` declares `@layer theme, base, components, utilities;` at the top of the output: Sass hoists its `@use` rules above the `@import 'tailwindcss'`, so without that line the components layer would be emitted before Tailwind can state the order and the preflight reset in `base` would outrank `.container-x`.

The motion rules at the end of that file sit outside the layer on purpose: Tailwind purges custom classes inside a layer that no template mentions, and the figure contract keys on an attribute and on classes figure authors add later. That block is gated on `@media screen and (prefers-reduced-motion: no-preference)`: `screen` because a printed page never scrolls, so a section still waiting for its reveal would print blank.

A component stylesheet that uses `@apply` must start with `@reference '<relative path>/styles/tailwind-reference.scss';`. Tailwind 4 compiles each component file on its own, so without the reference it cannot see the theme and the build fails on the first unknown utility. The reference emits no CSS.

| Class | What it is |
|---|---|
| `.container-x` | `mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8 xl:px-12` (the `container-x` mixin): 1440px wide at most, gutters 16, 24, 32 and 48px. Defined once, never nested, except that the shared sections' own `.container-x` sits inside `.page-rail`, where it collapses to the column (below). |
| `.section` | `padding-block: var(--section-y)`. Contains one `.container-x`. Grounds do not alternate; plates provide the rhythm. |
| `.page-rail` | The service and about pages' wrapper for everything after the title block: a `.container-x` itself (same mixin, same gutters) and, from `xl`, `grid-cols-[13rem_1fr] gap-12` with `app-section-rail` in the first column and the sections in the second. The shared sections keep their own `.container-x`, so inside `.page-rail` that class collapses to `max-w-none px-0` and nothing is guttered twice. Below `xl` the grid is off and the rail is hidden, so the page reads exactly as before. |
| `.section-marker` | A 1px top rule carrying the section's tag like a cable marker: `<div class="section-marker" aria-hidden="true"><span class="tag tag--chip">A-01</span></div>`. The chip straddles the line. The H2 that follows carries the matching `id` and `tabindex="-1"`; `h2[id]` gets `scroll-margin-top: var(--anchor-offset)` globally, and `AppRoutingModule` gives the router's `ViewportScroller` the same token as its offset (`useAnchorOffset`), because the router's anchor scrolling ignores scroll-margin: a heading lands 80px below the viewport top whether the browser scrolled to it (a fragment in the address bar) or the router did (a rail or contents-row link, the home index). The router's scroller is `SmoothViewportScroller`, so that landing is a glide; see In-page scrolling under Motion. |
| `.plate` | `rounded-2 border border-border bg-surface`, padding `--plate-pad`. Add `p-0` when the content supplies its own padding. |
| `.plate--inset` | Plate on `surface-raised`: the nameplate. |
| `.screen` | Fixed-light panel (`tokens.scss`) for the map, edged with `border`. `.dark .screen` dims it with `brightness(0.94)`. |
| `.btn` | Base: inline-flex, min height 44px, `rounded-1`, `text-button`; colour and transform transitions (`--dur-1`) under `prefers-reduced-motion: no-preference` only. Labels wrap (Afrikaans "Terug na die tuisblad" is 21 characters). |
| `.btn--primary` | `bg-accent text-accent-contrast`, hover `bg-accent-hover` and a 1px lift that lands again on press. No gradient or shadow. |
| `.btn--secondary` | Transparent with `border-border-strong`; `aria-checked="true"` or `.is-selected` fills it `bg-ink text-canvas` (not orange: the lamp carries the state). |
| `.btn--ghost` | `text-accent-text`, underline on hover, trailing arrow in an `aria-hidden` span that nudges 4px right on hover (the footer's map link does the same). Hero secondary links and the map link. |
| `.btn--sm` / `.btn--lg` | 44px with tighter padding (the header's Contact button and the panel's language radios) / 52px (hero and CTA bands). |
| `.eyebrow` | `font-display stretch-85 text-eyebrow uppercase text-ink-muted`. Pattern with a tag: `<p class="eyebrow"><span class="tag text-ink-muted">A</span> · Automation</p>`. |
| `.tag` | `font-mono text-tag uppercase text-ink-subtle`; add `text-ink-muted` when it sits on the canvas. |
| `.tag--chip` | Tag on a `surface-raised` chip with `rounded-1`. |
| `.tagline` | The hero's second-largest text: Archivo 500 at display-l size. |
| `.dash-list` | `<ul>` whose items carry a 6px square `bg-ink-subtle` marker (a terminal, not a disc). Service page bullets. |
| `.hazard` | 8px repeating 45-degree ink/accent stripe. Exists only on the 404 card, top and bottom. |
| `.rear-panel` | The footer's re-scoped dark token set (`tokens.scss`). |
| `.reveal` / `.is-revealed` | Styles for `RevealDirective`: the hidden start state (only ever present under `.reveal`, which the directive never adds for reduced motion, and only on screen media) and the 480ms rise. See Motion. |

Global base rules in `src/styles.scss`: body is `bg-canvas font-sans text-body text-ink`; every element's default `border-color` is the `border` token; `:focus-visible` is a 2px `focus` outline with 2px offset (outline, not box-shadow, so it survives `overflow: hidden` and forced colours; under `forced-colors: active` it becomes `Highlight`); `main#main:focus` has no outline.

## 5. Component inventory

All components are NgModule-declared (`standalone: false`) except `NotFoundComponent`. Selectors are prefixed `app-`, directives `app` camelCase (enforced by ESLint).

### Shell (declared in `AppModule`)

| Selector | File | Inputs | Notes |
|---|---|---|---|
| `app-skip-link` | `components/skip-link` | none | First element in `app-root`; `sr-only` until focused, then a fixed primary button at `--z-skip`. Target is `main#main` (`tabindex="-1"`). |
| `app-site-header` | `layout/site-header` | none | Sticky, 64px from `nav`, 56px below. After 24px of scroll (`SCROLLED_OFFSET`) the host carries `.is-scrolled` and its bottom rule becomes `--shadow-header`; the height never changes. The host has `view-transition-name: header`, so it never fades with the page. Renders `NAV`; text items carry `app-lamp [lit]="rla.isActive"` plus `aria-current` and an underline that grows from the left in ink on hover and stays full, in accent, on the current page; the primary item is a `.btn--primary .btn--sm` with no lamp (its current state is an underline). Below `xxs` (360px) the wordmark is hidden and the brand link keeps its name from `A11Y.HOME_LINK`. Below `nav` a hamburger opens the panel (`#site-menu`): focus moves to the first row, Tab is trapped, Escape closes and returns focus, outside click and `NavigationEnd` close it, body scroll is locked, and widening past `nav` closes it. |
| `app-site-footer` | `layout/site-footer` | none | `footer.rear-panel`. Logo and wordmark, the five-language tagline stack (`TAGLINES`, fixed order, current one highlighted with `aria-current`), three columns from `NAV` and `CONTACT` that reveal 80ms apart, runtime year, `PRETORIA · ZA`. Plain links, no lamps. |
| `app-language-switcher` | `components/language-switcher` | `segmented` (boolean attribute) | Bar variant: a bordered trigger carrying a globe, the code, the endonym (from `xl`, where the header has the room) and a chevron, plus a `role="menu"` of `menuitemradio` endonyms, each with its own `lang`; Arrow, Home, End, Escape, Tab, outside click. Segmented variant (panel): a `radiogroup` of `.btn--secondary .btn--sm` radios where arrows move and select. `aria-checked` carries the state and the selected row is marked without colour (below). |
| `app-theme-toggle` | `components/theme-toggle` | `labelled` (boolean attribute) | The rocker: `aria-pressed` = dark mode on; `O` and `I` marks (hidden below 360px), a 22px ink knob carrying a 10px lamp lit when dark. `labelled` shows the visible "Dark mode" eyebrow and links it with `aria-labelledby` instead of the sr-only text. Consumes `ThemeService` only. |

### UI primitives (`UiModule`, `src/app/shared/ui`, re-exported by `SharedModule`)

| Selector | Inputs | Notes |
|---|---|---|
| `app-lamp` | `lit` (required), `size` (number, default 8; 8 nav, 10 rocker, 14 404) | `aria-hidden` SVG. Lit: accent fill, ink ring. Unlit: no fill, `border-strong` ring. The path (`LAMP_PATH`) is a full astroid derived from the logo's spark, which is the left half with the same cubic control offsets. Contract: always the sibling of visible text that states the same thing, never blinks, never the only carrier of "current" or "selected". |
| `app-logo` | `height` (number, default 32; header 32, footer 28, nameplate 40) | The JE mark: `je-logo.webp` is opaque white, so it sits on a white `rounded-1` plate that reads as an engraved nameplate in both themes. Put `aria-hidden` on the host when it stands beside the wordmark. |

### Shared page components (`SharedModule`, `src/app/shared/components`)

| Selector | Inputs | Used on |
|---|---|---|
| `app-title-block` | `tag?`, `eyebrowKey`, `titleKey`, `titleParams?`, `leadKey?`, `leadParams?`, `contents?: ContentsItem[]` (`{ id, tag, key, params? }`; `params` interpolates the name, as the reason-sheet titles need) | Every inner page; the only thing that renders an H1 there. Eyebrow, H1 (`display-l`), 64 x 3px accent rule, optional lead (68ch) and an "On this page" `nav` of fragment links (44px tall), `xl:hidden` because the section rail takes over there. |
| `app-section-rail` | `items: ContentsItem[]` (the same `{ id, tag, key, params? }` list the title block gets: every section of the page with an H2, so on the service pages the index sections and then the reason sheet, A-05 / M-06, whose title interpolates the company name through `params`) | Automation, Maintenance, About, in the first column of `.page-rail`. A SCADA alarm list: an aria-hidden "On this page" eyebrow, then an `<ol>` of 44px fragment links, each an 8px `app-lamp`, the tag (`.tag`) and the translated name (`body-s`), ruled like sheet rows. The lamp is lit and the link carries `aria-current="true"`, ink text and weight 500 on the active section, `activeId()`. Active means the last section whose H2 has reached the line at 45% of the viewport height: an `IntersectionObserver` over the sections' H2s (found by id in the document, so it must render in the same view as them) with `threshold: 0` and `RAIL_ROOT_MARGIN` (`100000px 0px -55% 0px`), a root open above so no heading can jump the line in one frame (a fragment link, PageDown, a scrollbar drag) without reporting; a band would be jumped. Created in `afterNextRender`, browser only; the server and the first client render light the first item, so the prerendered rail is already right. Sticky at `top-24` (96px) with `self-start`, hidden below `xl`. The lamp changes only when the section changes: state, not motion, so it works the same under reduced motion. |
| `app-feature-section` | `tag`, `id`, `titleKey`, `introKey?`, `reverse` | Automation (A-01 to A-04), Maintenance (M-01 to M-05), About (01 to 03). Section marker, `h2[id][tabindex=-1]`, an optional framing sentence, slots `[body]` and `[figure]`; a 12-column grid from `lg` (text 7 / figure 5, then 6 / 6 from `xl`), figure first below `lg`. The whole section reveals on scroll. Pages alternate with `[reverse]="odd"`. The host's own `id` attribute is nulled so the H2 is the only element carrying the fragment id. `introKey` renders one plain sentence between the H2 and the body in the `lead` step, `text-ink-muted`, at the 68ch measure, and tightens the H2's own margin from `mb-4` to `mb-3`: the reader who is not an engineer gets the business reason before the bullets, and the bullets stay untouched for the reader who wants detail. It is an input rather than a second `[body]` element because that step, colour, measure and the gap to the list are this section's typographic contract, not each page's. The nine service sections set it; the three About rows do not, their body already being prose. |
| `app-reason-sheet` | `tag`, `id`, `titleKey`, `titleParams?`, `items: TitledText[] \| null` | A-05, M-06. Reveals on scroll. A plate holding both a table (`md` and up) and a `<dl>` (below), switched with CSS. Items come from `UtilsService.streamTitledList`, which splits "Title: note" on the first colon and keeps a note without a title rather than dropping it. Same host `id` nulling as the feature section. |
| `app-figure` | `captionKey`, `outcomeKey?` | Every drawn figure on Automation, Maintenance and About. Projects the page's inline SVG (aria-hidden, drawn in the mimic's language) and sets a caption under it; no plate or frame; 520px wide at most, 640px from `xl`, and the drawing is capped at 280px tall below `lg`. The `<figure>` carries `appReveal`, and that reveal is what starts the draw-in (section 6). The drawings themselves are page-local components: `app-process-figure`, `app-loop-figure`, `app-rack-figure`, `app-integration-figure` (Automation A-01 to A-04), `app-timeline-glyph` with five variants (Maintenance M-01 to M-05), `app-office-figure` and `app-stack-figure` (About 02 and 03). Each has exactly one accent element, for a state that is true in the drawing. With `outcomeKey` the `<figcaption>` becomes two lines in one element: the outcome in `text-body-s text-ink` (sentence case, about eight words, what the drawing means for a plant, its downtime or its budget) and the technical caption below it in `tag text-ink-muted` as the subtitle. Buyers are usually the research or procurement side rather than the engineers who read a P&ID, so the outcome leads and the mechanism follows. Without it the figure keeps today's single mono caption. All eleven figures set it. |
| `app-cta-band` | `textKey`, `textParams?` | Closing plate on Home, Automation, Maintenance, About: one lead sentence and the primary contact button. Reveals on scroll. |

### Page-local components

| Selector | Module | Inputs | Notes |
|---|---|---|---|
| `app-mimic` | Home | none; `.is-testing` set by `HomeComponent` | Inline SVG, `role="img"` with translated `<title>` and `<desc>` (the desc says the services and industries are links, `A11Y.MIMIC_LINKS`). Landscape variant from `md`, portrait below, both from `NODES` and `TERMINALS`. Only tags live inside the SVG. Each service node S1 to S4 and each terminal X1 to X4 is an SVG `<a>` (`href="#services"` / `href="#industries"`, the H2 ids of the two sections below, `aria-label` from the `GLOBAL.*` name) so keyboard users can reach and follow them; see Interactive mimic under Motion for the hover and focus highlight. |
| `app-service-card` | Home | `tag`, `titleKey`, `descriptionKey`, `media: { kind: 'photo', src, altKey, position, width, height } \| { kind: 'ladder' }` | Plate with a 4:3 media slot, tag, H3, description. Not a link; on hover the plate edge firms up to `border-strong` and the media scales to 1.03 inside its overflow-hidden slot over 500ms. No shadow, no card transform: plates sit on the enclosure, they do not float. |
| `app-ladder-figure` | Home | none | The software engineering card's media: a PLC ladder rung pair in `currentColor`, `aria-hidden`. |
| `app-timeline-glyph` | Maintenance | `variant: 'preventive' \| 'corrective' \| 'predictive' \| 'asset' \| 'facility'` | Inset plate with a 240 x 48 schedule strip and a two-line `figcaption`: the outcome from `MAINTENANCE.GLYPH_*_OUTCOME` over the mechanism from `MAINTENANCE.GLYPH_*`. The marker is an orange dot, not a lamp. |
| `app-nameplate` | About | none | Inset plate: the 40px mark and a `<dl>` of six ruled rows (one `.nameplate__row` div per dt/dd pair, each with a top rule and the list closed by a bottom rule; labels on a shared subgrid column from `xs`): company, motto (`HOME.SUBTITLE`), location (`CONTACT.locality` only; the full address belongs to the footer and contact page), contact email, services (`NAMEPLATE.SERVICES`, the four `GLOBAL.*` service names joined with a no-break space and a middle dot, `NAME_SEPARATOR`) and industries (`NAMEPLATE.INDUSTRIES`, the four industry names), the last two from `SERVICE_KEYS` and `INDUSTRY_KEYS` in `src/app/shared/catalogue.ts`. |
| `NotFoundComponent` | standalone, imports `SharedModule` | none | Hazard stripe, unlit 14px lamp beside `404`, H1, message, primary button. Client-rendered behind the Netlify SPA fallback. |

Contact channel rows and the map are plain markup in `ContactUsComponent`; the industries strip (`.terminal-cell`) and the site index are plain markup in `HomeComponent`. The site index (marker `I`, H2 `HOME.INDEX_TITLE`, between the industries strip and the CTA band) is one `.plate p-0` split into two columns from `md`, AUTOMATION and MAINTENANCE as eyebrows, each row a 48px `routerLink` + `fragment` link to a section with its tag, its translated name and a trailing arrow, `bg-surface-raised` on hover. Its rows come from `SITE_INDEX`, the same list the service pages build their contents rows and rails from. Contact identifiers (email, numbers) do not use `overflow-wrap: anywhere`: they carry a `<wbr>` after the `@` (`breakParts`) so the email breaks as "info@" over the domain instead of mid-word.

### Services and constants

- `ThemeService` (`services/theme.service.ts`): `theme` and `isDark` signals, `toggle()`, `set()`. Reads `localStorage.isDarkMode` (`'true'` / `'false'`), falls back to the OS preference and follows OS changes until a preference is stored. Toggles `.dark` on `<html>`, sets `color-scheme`, syncs both theme-color meta tags. Browser only; the inline script in `index.html` applies the same logic before first paint and must be kept in step.
- `LayoutService` (`services/layout.service.ts`): `menuOpen` signal with `openMenu()` / `closeMenu()`. `AppComponent` binds `inert` on `<main>` and the footer from it.
- `src/app/shared/navigation.ts` `NAV`: the five items rendered by the header bar, the panel and the footer.
- `src/app/shared/site-index.ts` `SITE_INDEX`: the two service pages (`pageKey`, `url`) with their numbered sections as `ContentsItem`s (A-01 to A-04, M-01 to M-05), looked up with `sitePage(url)`. The automation and maintenance pages build their `contents` from it plus their own reason sheet (`sheet`: A-05 / M-06 is a section of the page, not an entry of the index, so the home index does not list it) and the home index lists it, so a section is added or renamed in one place.
- `src/app/shared/catalogue.ts` `SERVICE_KEYS` and `INDUSTRY_KEYS`: the four services (S1 to S4) and the four industries (X1 to X4) as `GLOBAL.*` keys in their numbered order. The nameplate reads both; the home page's mimic and cards still carry their own copies (`NODE_NAME_KEYS`, `TERMINAL_NAME_KEYS`) and should import these instead.
- `src/app/shared/languages.ts` `LANGUAGES` (endonyms, fixed order af, en, fr, sw, zu), `LanguageCode`, `DEFAULT_LANGUAGE`, `isLanguageCode()`, `currentLanguage()` (typed signal over ngx-translate's current language).
- `src/app/shared/taglines.ts` `TAGLINES`: imported from `src/assets/i18n/taglines.json`.
- `src/app/shared/contact.ts` `CONTACT`: email, phone, mobile, their hrefs, address lines, maps URL. Shared by the footer, the contact page and the nameplate; the JSON-LD in `index.html` repeats them by hand.
- `SmoothViewportScroller` (`services/smooth-viewport-scroller.ts`): the router's `ViewportScroller`, provided in `AppRoutingModule.forRoot()` under both its own token and `ViewportScroller`. Every fragment navigation glides; `gliding()` says whether a scroll it started is still moving, which is what the section rail reads. See In-page scrolling under Motion.
- `HydrationService` (`services/hydration.service.ts`): `hydrating()` is true while the document is the prerendered HTML (`ng-server-context` on the root element) and `ApplicationRef.whenStable()` has not resolved. `RevealDirective` asks it before hiding anything.
- `RevealDirective` (`directives/reveal.directive.ts`): the scroll-reveal mechanism, `appReveal` with an optional `[appRevealDelay]` in milliseconds for staggering siblings. Section 6 lists where it is applied; adding it elsewhere is a design decision, not a tweak.
- `ClickElsewhereDirective`: outside-click close for the panel and the language menu.

## 6. Motion

Motion is welcome wherever it reveals structure or shows a state changing, and it is disciplined:

- **Finite.** Every animation completes within 5 s of its trigger. Nothing loops, nothing pulses: a blinking lamp in this world is an alarm.
- **Physical.** Short distances (8 to 12px rises, a 4px nudge, a 1px lift), 120 to 900 ms, `--ease-out` for anything that arrives and `--ease-std` for anything that toggles.
- **Absent under `prefers-reduced-motion: reduce`.** Every motion rule sits under `@media (prefers-reduced-motion: no-preference)` (or `motion-safe:`), or is a top-level rule switched off under `reduce` (see the authoring rule under Figure draw-in); `RevealDirective` and `HomeComponent` add no classes, and every hidden start state lives either in a keyframe `from` block or under a class those visitors never get (`.reveal`, `.is-testing`). With animations off, nothing is ever hidden. This is verified in puppeteer with the media feature emulated: every line, card and heading has opacity 1 at first paint.
- **Absent in print.** The shared motion block is `screen`-only, so in print media every `.reveal` element is opaque and every figure line is drawn, whether or not the visitor scrolled to it. Verified with `emulateMediaType('print')`: no `.reveal`, line, tag or marker below opacity 1.
- **Never on content the visitor is already looking at.** On a prerendered page the HTML is on screen before Angular runs. `RevealDirective` therefore leaves alone anything its observer would already count as in view (at least 15% of the element inside the viewport, less the 8% bottom margin) while `HydrationService.hydrating()` is true; an element that only just crosses the fold still gets `.reveal` and draws when scrolled to, so a figure never reads as broken because 20px of it showed at load. The router skips the first view transition for the same reason. Both would otherwise hide painted content and fade it back in, which reads as a blink.

### Scroll reveal

`RevealDirective` (`appReveal`, `[appRevealDelay]` in ms) adds `.reveal` in the browser (opacity 0, `translateY(12px)`) and, on first intersection (threshold 0.15, bottom margin -8%), `.is-revealed`: a 480 ms `--dur-reveal` rise with `--ease-out`, delayed by `--reveal-delay`. Applied to: every `app-feature-section` (its template root), `app-reason-sheet`, `app-cta-band`, the `<figure>` in `app-figure`, the home services cards (80 ms stagger), the industries cells (60 ms), the site index rows (staggered like the cards) and the three footer columns (80 ms). Not on the hero (it has its own load choreography), not on the title block (above the fold) and not on the section rail (it is sticky beside the content and shows state, not arrival). The element a fragment link points into is shown at once, with no rise: the directive watches `Location` (the URL is already set when a page is reached from the home index, and changes in place on a rail or contents-row link) and drops `.reveal` before the router scrolls, because the router measures the target from its transformed box and a section still rising would settle 12px above where it landed.

### Figure draw-in

Inside `app-figure`, the `<figure>`'s reveal starts the drawing. The figure fades but does not rise (ink does not slide), and while it fades:

- Every element with `pathLength="1"` draws: `stroke-dasharray: 1` makes one dash the whole line, and `stroke-dashoffset` runs 1 to 0 over `--dur-figure` (700 ms) with `--ease-out`, delayed by `--i` times `--dur-figure-step` (60 ms). Faces (`fill`ed shapes) fade their fill in over the same run. Figure authors add `pathLength="1"` and `style="--i: n"` to their stroked elements in drawing order, and nothing else: a dashed line must not carry `pathLength` (the dash trick would make it solid); it carries `class="figure-late"` instead and comes on with the tags.
- The accent (`.figure-marker`, `.figure-accent`, `.glyph__marker`), the tags (`.figure-tag`) and `.figure-late` (dashed lines, their arrowheads, anything that must wait for the drawing) fade in over 300 ms once the last line has landed: delay `--draw-end` + 120 ms, where `--draw-end` defaults to 700 ms and the figure sets it (on the svg or a group) to its last `--i` times 60 ms plus 700 ms. This is the one shared rule for "appears after the lines"; a figure does not need a class of its own for it (the automation `_figure.scss` `.figure-late` rule, the about `.figure-dashed` rule and the maintenance `.glyph__projection` fade are local copies of it that predate the shared class and should be removed in favour of it; while the automation copy exists it wins the cascade, and in a production build it is inert, see the authoring rule below). The caption is outside the svg and fades with the figure.
- The revealed state reaches the lines as an inherited custom property (`.figure.is-revealed { --figure-draw: figure-draw }`, consumed by `animation-name`) rather than through the selector, because Chrome does not restyle SVG descendants for an ancestor's class change when the descendant part of the selector is a case-sensitive attribute: `.is-revealed [pathLength="1"]` matches but never applies.
- **Authoring rule for keyframes in a component stylesheet.** Angular's emulated encapsulation renames `@keyframes` to `_ngcontent-…_name` and rewrites every `animation` / `animation-name` that references it, but only when the declaration follows whitespace or a semicolon. A production build minifies the stylesheet before that rewrite, so an `animation` that opens a rule inside an at-rule becomes `{animation:name` and keeps the bare name, pointing at keyframes that no longer exist: the animation silently never runs, and the development build (unminified) hides the difference. Therefore: reference component keyframes from a top-level rule (never as the first declaration inside an `@media` block) and switch them off with `@media (prefers-reduced-motion: reduce) { .x { animation: none; } }`, or declare the keyframes in `src/styles/components.scss`, where names are never rewritten. The header panel (`.site-menu`) and the language popover (`.lang__menu`) follow the first form; `figure-draw` and `figure-fade` are the second.
- Figures with an "in flight" accent (the integration bus record, the process running step, the predictive projection) are meant to move it once along its path over 1.5 s after the draw-in and settle at the documented position, and the maintenance strips to slide their marker in along the baseline once, then everything is static. They live in `src/styles/figure-motion.scss`, where the name is never rewritten, keyed on `.figure.is-revealed`. Verified on a build with `el.getAnimations()` returning the named animation after the reveal. A figure the visitor is already looking at when the page hydrates is marked revealed without ever being hidden, so its motion runs there too; see `RevealDirective`.

### The lamp test

On every visit to the home page (reduced motion excepted), `HomeComponent` decides in its constructor to bind `.is-testing` on the hero and the mimic. It is decided before the first client render so the hydrated DOM already carries the hidden start state rather than showing the finished picture, hiding it, then animating. The hero text rises first: eyebrow at 0 ms, H1 at 80 ms, rule `scaleX` at 240 ms, tagline at 320 ms, buttons at 400 ms, each opacity plus a 12px rise over 480 ms. The mimic draw starts at 300 ms: lines draw over `--dur-draw` (`pathLength="1"` so one dash is the whole line), X1 to X4 fill 120 ms apart, then the S labels appear; the whole choreography is under 1.6 s. After the lamp test a single signal (a 24px dash) travels each feeder from S to the bus once, over 1.2 s and 150 ms apart, and then the mimic is static. Every hidden start value lives in a keyframe `from` block under `.is-testing`, so the prerendered HTML and reduced-motion visitors show the finished, lit state.

### Section rail

The rail's lamp moves when the section in view changes and at no other time: the lamp swaps with its own 120 ms `--dur-1` colour transition, the row's colour eases over `--dur-2`, and the active name thickens over `--dur-2` on Plex Sans's `wght` axis (`font-variation-settings`, which interpolates where `font-weight` would snap; the name's column is sized by the grid, so nothing reflows). There is no rise, no pulse and no blink (a blinking lamp is an alarm). Under reduced motion the swap is instant and the state is identical: the rail is the one lamp on the service and about pages, and it is allowed because its state varies with scroll.

Clicking a rail row starts a glide that crosses every section in between, and the observer reports each one as it passes. Those reports are recorded but not shown: the row that was clicked is held lit until `SmoothViewportScroller.gliding()` goes false, so the lamp settles on the destination instead of running down the list (measured: the `aria-current` sequence for a click on A-05 from the top is `a-01`, `a-05`, not every id between). When the glide ends the hold is dropped and the observer's own answer takes over, so a scroll that was clamped short still tells the truth. How the active section is found is in the component inventory.

### Interactive mimic

Hovering or focusing a service node S-n on the home mimic highlights its feeder, the bus and all four outputs and terminals; hovering or focusing a terminal X-n highlights all four feeders, the bus and its own output. The highlight is `stroke: rgb(var(--rgb-accent))` at `stroke-width: 2.5` with a 200 ms (`--dur-2`) transition, driven by `:has()` on the mimic root (`.mimic:has(.node--s1:is(:hover, :focus-visible)) .feeder--s1`); a browser without `:has()` simply shows no highlight. Accent strokes are otherwise forbidden, and here they are allowed only while the path is hovered or focused, because "this path is selected" is a state. Focus-visible on the SVG anchors is a 2px `accent-text` outline on the node rect.

### In-page scrolling

Every in-page jump glides rather than snapping. `src/styles.scss` sets `scroll-behavior: smooth` on `html` and `body` under `prefers-reduced-motion: no-preference`, which covers the browser's own anchor handling (the mimic's SVG links, a fragment typed in the address bar) and `scrollIntoView` (the skip link). The router does not go through that property, so `SmoothViewportScroller` replaces Angular's `BrowserViewportScroller`:

- It scrolls with `behavior: 'smooth'`, or `'instant'` when the visitor prefers reduced motion, in which case the landing position is identical and only the glide is gone.
- It focuses the heading with `preventScroll: true`. This is the fix that mattered: the built-in scroller focuses the anchor without it, and focus's own scroll-into-view aborts the smooth scroll roughly 400px short (measured on `/automation`, a rail link to A-03 settled at 1152 instead of 1542). Both halves are needed, because the focus is what sends a screen reader and the keyboard to the section.
- It asks for a vertical scroll only. The built-in one passes the element's `rect.left`, which on the rail's grid is 304px, a horizontal scroll no page here can satisfy.
- `gliding()` reports whether a scroll it started is still moving, inferred from the offset coming to rest (Chrome fires no scroll-end event) with a 1200 ms backstop so a clamped target cannot leave it stuck. The section rail reads it.
- Only anchors glide. `scrollToPosition` defaults to `'instant'`, because the router passes `behavior: 'instant'` on the popstate branch only and asks for the top of a newly opened page with no options at all: gliding that would drag the page you are leaving up the screen under the page you opened (measured before the fix: leaving `/automation` at 2000px for `/maintenance` animated over 30 sampled frames; now one instant call, one sampled value).
- Back and forward across in-page fragments land on the heading. `scrollPositionRestoration: 'top'` makes the router ask for `[0, 0]` on popstate before `anchorScrolling` can act, so `scrollToPosition` treats a restore-to-top whose URL names a live element as a restore to that element (measured: Back to `/automation#a-03` was y 0 with the heading 1592px away, now y 1592 with the H2 exactly `--anchor-offset` below the viewport top and `aria-current` on the a-03 row). A restore to a real offset, and a page whose URL carries no fragment, still go exactly where they are told.
- The reduced-motion preference outranks the caller: `behavior: 'smooth'` passed in by any caller still resolves to `'instant'` when the visitor asked for reduced motion.

`RevealDirective` still drops `.reveal` from a fragment target before the scroll is measured; without that the scroller would measure a box still translated 12px and settle that far above the heading. Verified end to end at 1440 and 390, light and dark: every rail link, contents-row link, the skip link, a mimic anchor and a home-index link crossing to another route move over 8 to 16 sampled frames and land with the H2 exactly 80px below the viewport top; under `prefers-reduced-motion: reduce` the same clicks land on the same pixel in one step.

### Route transitions

`AppRoutingModule.forRoot()` returns `provideRouter(routes, withInMemoryScrolling(...), withViewTransitions({ skipInitialTransition: true, onViewTransitionCreated }))` as `ModuleWithProviders`: `RouterModule.forRoot`'s `enableViewTransitions` cannot skip the first transition, and the skip is a one-shot flag inside the providers, so they are built per application (each TestBed gets its own) rather than once per bundle in the decorator. The cross-fade means "the page you leave fades into the page you open", so `onViewTransitionCreated` calls `skipTransition()` when the target URL is already active with `paths: 'exact'` and the fragment and query ignored: a contents-row link changes only the fragment, no page is left, and `anchorScrolling` alone jumps to the heading. `src/styles.scss` fades `::view-transition-old(root)` out over `--dur-route-out` (160 ms, `--ease-std`) and fades `::view-transition-new(root)` in over `--dur-route-in` (240 ms, `--ease-out`) with an 8px rise; under reduced motion every `::view-transition-*` pseudo-element gets `animation: none`. The header carries `view-transition-name: header`, so it keeps its own snapshot and never fades with the page.

### Utility motion

- Header: after 24px of scroll the host carries `.is-scrolled`; the bottom rule becomes `--elevation-header` over `--dur-2`, both properties on `--ease-out` so they arrive together. The scroll handler defers its read to the next animation frame (one layout read per frame however many events arrive) and holds the state through an 8px dead band below the offset (`SCROLLED_HYSTERESIS`), so a scroll resting on the threshold cannot flicker the shadow. Only `border-color` and `box-shadow` change: the height is fixed, so nothing the header does can shift the page. Nav link underline: `scaleX` 0 to 1 from the left on hover over `--dur-2`, in ink; the current page's stays full and is orange.
- Buttons: `.btn--primary` darkens on hover (exists) and lifts 1px over `--dur-1`, landing again on press. `.btn--ghost` and the footer map link nudge their arrow 4px right over `--dur-2`.
- Service cards: on hover the plate edge firms up to `border-strong` (`--dur-1`) and the photo or ladder scales to 1.03 over 500 ms inside its overflow-hidden slot. No shadow, no card transform.
- Colour, border and underline transitions, 120ms. Rocker knob 200ms `--ease-std`; the theme switch itself has no cross-fade, because a global transition flashes every plate. `ThemeService` puts `.theme-swap` on `<html>` for the two frames the palette takes to swap, and `src/styles.scss` switches every transition off under it: without that, every element carrying a colour transition for its own hover runs it at the moment the tokens change (measured at 79 concurrent transitions on one toggle, 0 with it), which reads as the page smearing rather than switching. Mobile panel and language popover slide in 8px over 200ms (`site-menu-in`, `lang-menu-in`: top-level rules with a `reduce` override, per the authoring rule above).

After each navigation to a different path, `AppComponent` moves focus to `main#main` and the router scrolls to top; fragment-only navigation (the contents row, the rail) is left to `anchorScrolling`, which lands the H2 `--anchor-offset` below the viewport top and focuses it, and runs no view transition.

## 7. Accessibility rules a change must keep

- Exactly one H1 per page; heading order never skips (H2 sections, H3 cards and cells). Eyebrows and markers are `<p>` or `<div>`, never headings. Reason-sheet items are `th scope="row"`.
- Landmarks: skip link first, `header > nav[aria-label]`, `main#main[tabindex=-1]`, `footer > nav[aria-label]`, labels translated. The in-page navigation is one `nav[aria-label="On this page"]` at a time: the title block's row below `xl`, the section rail from `xl` (the other is `display: none`, so assistive technology sees one).
- The lamp is never the sole state cue: nav = `aria-current` + underline + lamp; language = `aria-checked` + an inverted fill + a check mark + weight 600 + the trailing code, with no lamp lit on the inverted fill (see Selected language below); rocker = `aria-pressed` + knob position + marks; section rail = `aria-current` + ink text at weight 500 + lamp. Every lamp has a visible text sibling. Every SVG figure is `aria-hidden` with visible text nearby, except the mimic, which is `role="img"` with `<title>` and `<desc>`; its S and X nodes are SVG anchors with an `aria-label` from the same `GLOBAL.*` names the cards and cells show, reachable with Tab and activated with Enter.
- `accent` is never text, border, or a sole icon on light grounds. `border-strong` on anything interactive; `border` is decorative only. Every text pairing stays at or above 4.5:1 in both themes and on the rear panel.
- Focus: `:focus-visible` outline visible on every control in both themes and in forced-colours mode. Panel and menu keyboard paths (Escape closes and returns focus, Tab trapped in the panel, arrows in the menu) are exercised by the specs; keep them green.
- Targets: 44 x 44 minimum everywhere; panel rows 48px; contact rows 56px; footer links padded to 44px.
- Text: no fixed heights on text containers, no `text-overflow: ellipsis`, no `hyphens: auto`, uppercase only via `text-transform` on the two 13px steps. No horizontal scroll at 320px wide or 200% zoom in any of the five locales (Zulu FMCG is 48 characters; French nav must fit at 1180px).
- Media: photos have descriptive `alt` from `IMG.*` keys plus `width`, `height` and `loading="lazy"`. The map iframe has a translated `title` and the address plus "Open in Google Maps" (with an sr-only new-tab note) beside it.
- Language: `<html lang>` follows the selection; the address carries `lang="en"`; email and numbers carry `translate="no"`; each language item carries its own `lang`.
- Theme: `color-scheme` on `:root` and `.dark`; no flash on reload in either theme; the theme class lives on `<html>`, never on `<body>`.

### Selected language

The selected language is the site's hardest "selected" state to read, because five rows of translated words differ only in the words themselves. It therefore carries three cues that are not a colour difference, plus a trailing text cue, so that losing any one of them still leaves the row obvious:

| Cue | Popover (`menuitemradio`) | Segmented panel (`radio`) |
|---|---|---|
| Inverted fill | `bg-ink text-canvas` on `.lang__item.is-selected` | `.btn--secondary[aria-checked='true']`, already in `components.scss` |
| Check mark | `.lang-check`, a 12px stroked glyph in the same 12px column the unlit lamps occupy, so labels stay aligned | same glyph, in the lamp's place |
| Weight | 600 against the siblings' 400 | the chips are all 600, so the fill and check carry it |
| Trailing code | the language code repeated at the row's end, for screen magnifier users | not needed: the chips are short |

The popover's unselected rows deliberately sit at weight 400 (`font-normal`), below the `nav` step's own 500, so the selected row's 600 is a delta the eye resolves rather than a 600-against-500 hairline. This is the one place nav-step text departs from 500.

**The lamp does not light here.** The check mark takes the lit lamp's place in the indicator column; the four unselected rows keep their unlit lamps (`border-strong` ring, 4.78:1 light / 3.95:1 dark against the plate). The reason is measured: an accent lamp on the inverted fill is **2.38:1 in dark and 6.46:1 in light**, and the lit lamp's own ring is `ink`, the very colour of the fill, so the silhouette disappears entirely. On the plate the lit lamp was 5.50:1 dark but only 2.87:1 light, so it never passed the 3:1 non-text minimum in both themes even before the fill existed. Restating the ring in `canvas` from the switcher's stylesheet was tried and does not work: emulated encapsulation does not reach into `app-lamp`'s template, and the rule is silently inert (verified in the browser). Dropping the lit lamp on an inverted fill is therefore the rule, and it applies to the segmented chip too, where the same pairing was already shipping.

Two failure modes were verified separately because they defeat different cues:

- **Achromatopsia / protanopia / deuteranopia** (CDP `Emulation.setEmulatedVisionDeficiency`): the fill, check and weight all survive.
- **`forced-colors: active`**: the OS discards backgrounds, so the fill is lost; the check mark, the weight and the trailing code carry the state. Never let a selected state rest on a background alone.

Every pairing is at or above 4.5:1 for text and 3:1 for non-text in both themes; the lowest are the trailing code at 8.23:1 (dark) and the trigger border at 3.95:1 (dark). A fill of `surface-raised` on the popover plate was rejected: it is only 1.10:1 (light) and 1.14:1 (dark) against `surface`, effectively invisible.

The closed trigger names the current language rather than coding it: a globe, the code, the endonym from `xl` (hidden below it, where the header is tight, but always in the markup), a chevron, and a `border-strong` edge so it reads as a control. The translated `aria-label` stays `"Select language: <endonym>"` and the target stays 44px. Widest locale is Afrikaans at 146px at 1440. Its gap and padding tighten below `xl` (`gap-1 px-1.5`, `xl:gap-1.5 xl:px-2`): at exactly 360px, the `xxs` step where the wordmark appears and the theme rocker grows to 92px, the header tools row has no slack left, and the roomier spacing pushed the document 2px wide enough to scroll. Measured clean at 320, 360, 390, 768, 1024, 1180, 1280 and 1440 in all five locales.

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

- `src/assets/img`: `je-logo.webp` (472 x 596, opaque white; the mark in `app-logo`, on a white plate, and the `logo`/`image` of the LocalBusiness JSON-LD), `design-engineering.webp`, `project-management.webp`, `maintenance-and-general-work.webp` (S1, S3, S4 cards, 4:3 crops with per-image `object-position`; `.dark` dims them with `brightness(0.92)`).
- `src/assets/og`: `og-cover.png` (1200 x 630, the mark on a white plate over the ink ground with the wordmark and tagline inside a 1000 x 500 safe area; the `og:image` / `twitter:image` of every route). Rendered from the logo and the site's own Archivo face, so it is regenerated rather than hand-edited.
- There are no animation assets: every figure is an inline SVG component, so nothing is fetched for illustrations.
- `src/assets/icon`: `favicon.svg` (ink rounded square with an accent astroid lamp, the primary icon) and `favicon.png` (32px fallback).
- Fonts come from `node_modules` via fontsource; nothing is copied into `src/assets`.
- Filenames are kebab-case.

## 10. Open follow-ups

Carried over from the design brief and still open:

1. **Founding year.** `GLOBAL.OUR_STORY_TEXT.0` no longer states an age. Once the client confirms the year, prepend "Just Enable was founded in YYYY." in all five locales.
2. **Native-speaker review** of all af, fr, sw and zu strings added or re-cased in the redesign.
3. **Map click-to-load.** DECIDED 2026-09-10: the client chose to keep the embedded iframe as it is. Measured cost on a mid-range Android over 4G is about 2.15 MB across 113 third-party requests, taking the contact page from roughly 0.2s to 3.6s, because the map sits above the fold so `loading="lazy"` never defers it. Revisit only if the client raises contact-page speed.
4. **Figure captions** (`AUTOMATION.FIGURE_*`, `ABOUT.FIGURE_*`, `MAINTENANCE.GLYPH_*`), their outcome lines (`*_OUTCOME`) and the nine section framing sentences (`GLOBAL.<SECTION>_INTRO`) in af, fr, sw and zu were drafted without a native speaker; include them in the review above.
5. **Real-device pass** at 1024 to 1179px (tablet landscape gets the panel) in French and Zulu, and a mid-range Android profile of the lamp test.
