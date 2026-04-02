# Implementation Plan: Landing Page Redesign

**Branch**: `004-landing-page-redesign` | **Date**: 2026-04-02 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/004-landing-page-redesign/spec.md`

## Summary

Seven user stories across four parallel areas of change:

1. **Card controls (US1, US2)** — Replace the text favorite button with inline heart SVG icons (outline / filled). Add a matching download icon. Both use white icon glyphs inside gray circular backgrounds, appear on hover for pointer devices, and stay visible on touch-only devices; controls remain at the bottom-right of the card image with no background overlay.
2. **Grid and page width (US3)** — Widen the page shell, navbar, and grid so the landing page fills the viewport on large screens. Cards grow taller and the column breakpoints are revised.
3. **Animated hero banner (US4)** — Refactor the hero section into a two-column desktop layout: text on the left half, a freeform upward-scrolling image collage on the right half. On smaller screens the two sections stack vertically.
4. **Hero typography (US4)** — Add Playfair Display via Google Fonts for the hero headline, keeping Manrope and Space Grotesk for all other text.
5. **Light / Dark mode (US5)** — Add a theme toggle icon at the far right of the navbar; switch the entire site between light and dark via CSS custom property swap in `html.dark {}`; persist to localStorage; apply via pre-render head script to avoid FOUC; respect OS `prefers-color-scheme` on first visit.
6. **Site footer (US6)** — Add a three-column footer (branding left, nav center, legal right) to all pages; include links to existing pages (FAQ, About) and placeholder anchors for unbuilt pages (Blog, Contact, Privacy, Terms); footer adapts to active theme.
7. **Tag filter row (US7)** — Add 10–12 clickable tag chips below the Select All / Clear All controls on landing page; single active-tag filter; clicking active chip deactivates it; tag state encoded in URL as `?tag=<tagname>` for shareability; composable with text search.

## Technical Context

**Language/Version**: JavaScript (ES2022), JSX via React 18  
**Primary Dependencies**: React 18, React Router v6, Tailwind CSS v3.4, Vite 5.4  
**Storage**: `localStorage` (theme + tag state), existing `favorites-store.js` (no new changes to core logic)  
**Testing**: Vitest + React Testing Library, with manual validation in `quickstart.md`  
**Target Platform**: Static SPA for desktop and mobile browsers  
**Project Type**: Web application (single React SPA)  
**Performance Goals**: No measurable regressions; hero animation is CSS-only (`@keyframes` + `translate`); theme applied via head script to avoid FOUC; smooth transitions  
**Constraints**: No new npm packages; Playfair Display + existing Google Fonts via `@import`; inline SVG icons only; pointer-aware control visibility (hover on pointer devices, always visible on touch-only devices); CSS custom property swap for dark mode (no Tailwind `dark:` utilities)  
**Scale/Scope**: ~12 files modified, 2 new CSS rules (keyframe + dark mode), 2 new fonts/colors in config, 1 head script inline, 3 new components (ThemeToggle, SiteFooter, TagFilterRow)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Static-First Delivery | PASS | No backend changes; Google Fonts + localStorage only |
| II. Browsing and Filtering | PASS | Grid filter (tag + text) preserved; composition specified |
| III. Image Viewing and Download | PASS | Modal flow unchanged; card download added |
| IV. Favorites Management | PASS | Favorite behavior unchanged; heart icon replaces text control |
| V. Basic Usability and Accessibility | PASS | All icon-only controls have `aria-label`; hero + navbar + footer responsive; dark mode respects OS; tag filter accessible |

Initial gate result: PASS.

## Project Structure

### Documentation (this feature)

```text
specs/004-landing-page-redesign/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── styles/
│   └── tailwind.css                    ← Playfair Display @import, hero keyframe, CSS dark mode variables
├── pages/
│   └── landing/
│       ├── LandingPage.jsx             ← hero two-column layout, tag filter row, composition logic
│       └── landing.css                 ← @keyframes scroll-up animation
├── components/
│   ├── favorites/
│   │   └── FavoriteToggle.jsx          ← heart SVG icons (white-on-gray circular control)
│   ├── image-grid/
│   │   ├── ImageCard.jsx               ← pointer-aware icon visibility, white-on-gray controls, no overlay, error state
│   │   └── ImageGrid.jsx               ← responsive column breakpoints
│   ├── layout/
│   │   ├── AppLayout.jsx               ← navbar: sticky, theme toggle at far right
│   │   └── SiteFooter.jsx              ← NEW: three-column footer (branding, nav, legal)
│   ├── theme/
│   │   └── ThemeToggle.jsx             ← NEW: sun/moon icon, localStorage + prefers-color-scheme
│   └── landing/
│       └── TagFilterRow.jsx            ← NEW: 10–12 tag chips, single active state, URL ?tag param
index.html                              ← inline <script> in <head> for theme pre-apply (FOUC prevention)
tailwind.config.js                      ← add playfair font token
```

**New Components**:
- `ThemeToggle.jsx` — navbar icon control managing theme state
- `SiteFooter.jsx` — full-width footer with three-column layout
- `TagFilterRow.jsx` — horizontal scrollable tag chips with URL state

**Architectural Decisions**:
- Dark mode via CSS custom property swap (`html.dark {}`) in `tailwind.css`, not Tailwind `dark:` utilities
- Theme initialized via inline script in `<head>` to read localStorage + `prefers-color-scheme` before paint
- Tag filter state in URL query param (`?tag=<tagname>`) for shareability + back/forward support
- Footer layout: three-column desktop → single stacked column on mobile (≤ 768 px)

## Phase 0: Research

Research decisions are documented in `research.md` and resolve all clarifications:

### Card Controls (US1 & US2)

1. Heart icon visuals use inline Heroicons-style SVGs with white icon glyphs in both states, rendered inside gray circular control backgrounds.
2. Download icon uses ArrowDownTray Heroicons solid SVG with white icon glyph, also rendered inside a gray circular control background.
3. Icons are positioned `absolute bottom-3 right-3 z-20 flex gap-2 items-center` — no background overlay bar; visibility is hover-revealed on pointer devices.
4. `FavoriteToggle` keeps the same prop contract (`isFavorite`, `onToggle`).
5. Download state (`downloadBusy`, `downloadError`) is local `useState` inside `ImageCard`.
6. Both icon buttons call `stopPropagation` + `preventDefault` to block the card `<Link>`.
7. Download errors auto-dismiss after 3 s via `useEffect` + `setTimeout` with cleanup.
8. On touch-only devices (no hover capability), both controls remain visible by default for discoverability and accessibility.

### Grid & Page Width (US3)

8. Grid breakpoints: `grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5`.
9. Card image height scales with breakpoint: `h-64 md:h-72 xl:h-80`.
10. Page shell: `max-w-[1800px] px-5 md:px-8 2xl:px-12`.

### Animated Hero Banner (US4)

11. The hero section in `LandingPage.jsx` is refactored to a `flex md:grid md:grid-cols-2` layout.
12. Left column: existing text content (headline, subtext, filter input).
13. Right column: `overflow-hidden` container holding the freeform upward-scrolling collage.
14. Collage implementation: an inner `<div>` containing a curated image list **doubled** (original + copy) so the scroll loop is seamless. A CSS `@keyframes scroll-up` animates `translateY(0)` → `translateY(-50%)` on `linear infinite`.
15. Collage images are a hardcoded curated constant of 8–10 picsum portrait/fashion-style URLs (same CDN already used), defined inline in `LandingPage.jsx`.
16. Cards in the collage use `rotate` and `translate` utility classes to create the freeform overlapping visual.
17. On `< md` breakpoints the grid collapses; the collage div is shown below the text.

### Typography (US4)

18. Playfair Display is appended to the existing Google Fonts `@import` in `tailwind.css`.
19. A new `playfair` font family token is added to `tailwind.config.js`.
20. The hero `<h1>` uses `font-playfair` to render in Playfair Display. The existing `.hero-title` Space Grotesk class is replaced on the hero headline only.

### Dark Mode (US5)

21. Dark mode is implemented via CSS custom property swap: a `html.dark {}` block in `tailwind.css` overrides the existing CSS variables (`--bg-top`, `--bg-mid`, `--bg-bottom`, `--accent`, `--ink`, `--muted`).
22. No per-component class changes needed; all existing code uses CSS variables and automatically adapts.
23. Theme toggle icon (sun/moon) is added to the far-right end of the navbar (after download button).
24. Theme state is saved to `localStorage` when the user clicks the toggle.
25. A small inline `<script>` in the HTML `<head>` reads `localStorage` + checks `prefers-color-scheme` on page load and applies the `dark` class before React hydrates, preventing FOUC.
26. On first visit with no saved preference, the site respects the OS `prefers-color-scheme` media query: dark OS → dark mode; light or no-preference → light mode.

### Site Footer (US6)

27. A new `SiteFooter` component is created and rendered at the bottom of all pages (AppLayout wrapper).
28. Footer uses a three-column desktop grid layout: branding/tagline left, navigation center (FAQ, Blog, Contact Us, About), legal right (Privacy Policy, Terms of Service).
29. On mobile (≤ 768 px) the footer stacks to a single centered column.
30. Links to existing pages (FAQ, About) navigate correctly; links to unbuilt pages (Blog, Contact, Privacy, Terms) use placeholder anchors (`#`).
31. Footer respects the active light/dark theme via the same CSS variable swap.

### Tag Filter Row (US7)

32. A new `TagFilterRow` component is added to the landing page just below the Select All / Clear All controls.
33. The row displays 10–12 tag chips derived from the union of all tags in the existing image dataset.
34. Clicking a chip filters the grid to show only images carrying that tag; the chip appears visually highlighted (active state).
35. Only one tag can be active at a time; clicking the active chip deactivates it and restores the full unfiltered grid.
36. The active tag is encoded in the URL as `?tag=<tagname>`, making filtered views shareable and enabling back/forward navigation.
37. The tag filter composes with the text search filter: results show images matching both the active tag AND any typed query.
38. On very narrow viewports the tag row scrolls horizontally; chips never wrap to a second line.

## Phase 1: Design and Contracts

Artifacts produced:

1. `data-model.md`: Defines UI entities (ImageCard, FavoriteToggle, HeroBanner, ThemeToggle, SiteFooter, TagFilterRow) and their state models.
2. `contracts/ui-contract.md`: Defines visual contracts for all components including theme toggle behavior, footer layout and responsive stacking, tag filter interaction and URL state.
3. `quickstart.md`: Defines setup and manual verification steps for all seven user stories.

Agent context update requirement:

1. Run `.specify/scripts/bash/update-agent-context.sh copilot` after plan output is finalized.

## Post-Design Constitution Check

Re-check result after Phase 1 artifacts: PASS.

1. No principles violated.
2. Hero animation is CSS-only; dark mode is CSS variable swap only; no external libraries, no runtime impact on core logic.
3. Playfair Display and theme initialization are static assets + one head script.
4. All layouts (navbar, hero, grid, footer, tag row) are responsive and accessible; mobile workflows fully supported.
5. Tag filter URL state integrates with existing Router without architectural changes.

## Phase 2: Task Planning Preview

Planned implementation sequencing divided into priority groups:

**Group A — Card controls (US1 & US2, P1 / P2)** [COMPLETED]
1. Replace `FavoriteToggle.jsx` text button with heart SVG icons styled as white glyphs in gray circular backgrounds; update `aria-label`.
2. Update `ImageCard.jsx`: remove overlay bar; move icon cluster to `absolute bottom-3 right-3`; add download icon, `downloadBusy`/`downloadError` state, auto-dismiss logic, and pointer-aware visibility rules (hover on pointer devices, always visible on touch-only devices).

**Group B — Grid & page width (US3, P3)** [COMPLETED]
3. Update `ImageGrid.jsx` responsive column breakpoints.
4. Verify `AppLayout.jsx` navbar and `tailwind.css` page shell width are consistent with wider layout.

**Group C — Animated hero banner (US4, P1)** [COMPLETED]
5. Append Playfair Display to Google Fonts `@import` in `tailwind.css`; add `playfair` font token in `tailwind.config.js`.
6. Refactor `LandingPage.jsx` hero section to two-column layout; apply `font-playfair` to `<h1>`.
7. Add `@keyframes scroll-up` in `landing.css`; add collage container with doubled image list and `animate-scroll-up` class.
8. Define curated hero image URL constants inline in `LandingPage.jsx`.

**Group D — Theme toggle (US5, P2)** [PENDING]
9. Add inline theme initialization script in `index.html` `<head>` (reads localStorage + prefers-color-scheme, applies `dark` class).
10. Create `src/components/theme/ThemeToggle.jsx` with sun/moon icon; add onClick handler to toggle `dark` class on `<html>` and save to localStorage.
11. Add ThemeToggle to the far-right of the navbar in `AppLayout.jsx`.
12. Define dark mode CSS custom properties in `src/styles/tailwind.css` under `html.dark {}` rule.

**Group E — Site footer (US6, P3)** [PENDING]
13. Create `src/components/layout/SiteFooter.jsx` with three-column grid layout (branding, nav, legal) and mobile stacking.
14. Add SiteFooter to `AppLayout.jsx` below `<main>`.
15. Verify footer respects active theme (inherits dark mode via CSS variables).

**Group F — Tag filter row (US7, P2)** [PENDING]
16. Extract all unique tags from `src/data/images.js` and derive the top 10–12 by frequency.
17. Create `src/components/landing/TagFilterRow.jsx` with clickable tag chips, single active state, and URL syncing.
18. Update `LandingPage.jsx` to import and render TagFilterRow below Select All / Clear All.
19. Update `filterImagesByTitle` or create new filter function to support composition of tag + text search.
20. Wire TagFilterRow active state to URL query params via React Router.

**Group G — Validation** [PENDING]
21. `npm run build` — must pass with no errors.
22. Manual quickstart validation across desktop (1280 px, 1920 px) and mobile (375 px, 768 px) for all seven user stories.

## Complexity Tracking

No constitution violations or exceptional complexity accepted. Section intentionally empty.
