# Tasks: Landing Page Redesign

**Input**: Design documents from `/specs/004-landing-page-redesign/`
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/ui-contract.md`, `quickstart.md`

**Tests**: Automated tests are not explicitly requested in the feature spec; this plan uses implementation tasks plus manual validation from `specs/004-landing-page-redesign/quickstart.md`.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Phase 1: Setup (Shared Preparation)

**Purpose**: Align implementation targets and validation checklist before code changes.

- [X] T001 Confirm implementation targets and touched files in `specs/004-landing-page-redesign/plan.md`
- [X] T002 [P] Confirm acceptance and accessibility behavior for card controls in `specs/004-landing-page-redesign/contracts/ui-contract.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Introduce shared card action-control scaffolding required by all story implementations.

**CRITICAL**: Complete this phase before starting user story tasks.

- [X] T003 Add persistent bottom-right action control cluster and z-index layering in `src/components/image-grid/ImageCard.jsx` (no overlay bar)
- [X] T004 Add shared click-guard handling for icon controls in `src/components/image-grid/ImageCard.jsx`

**Checkpoint**: Card action overlay foundation is ready for story-specific controls.

---

## Phase 3: User Story 1 - Heart Icon Favorite Toggle (Priority: P1) 🎯 MVP

**Goal**: Replace text favorite control with heart icon controls styled as white glyphs in gray circular backgrounds, using pointer-aware visibility (hover on pointer devices, always visible on touch-only devices), while preserving existing favorite behavior and persistence.

**Independent Test**: On landing page, verify heart controls appear on hover for pointer devices and remain visible on touch-only devices; click heart on any card to toggle outline/filled states and verify favorite persistence after reload.

### Implementation for User Story 1

- [X] T005 [P] [US1] Replace text favorite button content with outline/solid heart SVG states styled as white glyphs in gray circular backgrounds in `src/components/favorites/FavoriteToggle.jsx`
- [X] T006 [US1] Add icon-only favorite control styling with pointer-aware visibility and dynamic `aria-label` values in `src/components/favorites/FavoriteToggle.jsx`
- [X] T007 [US1] Position `FavoriteToggle` in the bottom-right action cluster in `src/components/image-grid/ImageCard.jsx` (no overlay bar)

**Checkpoint**: User Story 1 is independently functional and testable.

---

## Phase 4: User Story 2 - Direct Download Icon on Card (Priority: P2)

**Goal**: Enable one-click, on-card direct download with white-on-gray circular download control, pointer-aware visibility, busy state, and inline auto-dismissing error feedback.

**Independent Test**: Click a card download icon without opening modal; verify download starts, busy state blocks re-click, and failure shows inline error that clears in ~3 seconds.

### Implementation for User Story 2

- [X] T008 [P] [US2] Add per-card `downloadBusy` and `downloadError` state with timeout cleanup in `src/components/image-grid/ImageCard.jsx`
- [X] T009 [US2] Implement direct download handler using `downloadImage(image, null)` in `src/components/image-grid/ImageCard.jsx`
- [X] T010 [P] [US2] Add download icon button (white glyph in gray circular background) with pointer-aware visibility, disabled busy spinner, and `aria-label` in `src/components/image-grid/ImageCard.jsx`
- [X] T011 [US2] Render inline auto-dismiss card download error feedback in `src/components/image-grid/ImageCard.jsx`

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Full-Width Image Cards (Priority: P3)

**Goal**: Remove right-side empty gutter by improving responsive grid column behavior while preserving image crop/fill.

**Independent Test**: Verify no visible right-side empty gutter at 375 px, 768 px, 1280 px, and 1920 px viewport widths.

### Implementation for User Story 3

- [X] T012 [US3] Update grid breakpoint classes to `grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5` in `src/components/image-grid/ImageGrid.jsx`
- [X] T013 [US3] Keep image fill/crop behavior consistent with `object-cover` card sizing in `src/components/image-grid/ImageCard.jsx`

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: User Story 4 - Animated Hero Banner (Priority: P1) 🎯 MVP

**Goal**: Refactor the landing hero into a two-column desktop layout with an upward-scrolling image collage on the right, Playfair Display headline on the left, and a vertical stack on mobile.

**Independent Test**: At viewport ≥ 768 px the hero shows text left / collage right at 50 / 50; collage cards scroll upward continuously. At < 768 px it stacks with text on top and collage below.

### Font & Config Setup (US4)

- [X] T016 [P] [US4] Append `family=Playfair+Display:wght@400;700` to Google Fonts `@import` URL in `src/styles/tailwind.css`
- [X] T017 [US4] Add `playfair: ["Playfair Display", "serif"]` font family token to `tailwind.config.js`

**Checkpoint**: `font-playfair` Tailwind utility is available.

### Hero Layout (US4)

- [X] T018 [P] [US4] Refactor hero `<div>` in `src/pages/landing/LandingPage.jsx` to `grid md:grid-cols-2` layout; add `overflow-hidden` to the right column container
- [X] T019 [US4] Apply `font-playfair` to hero `<h1>` and remove the `.hero-title` Space Grotesk class in `src/pages/landing/LandingPage.jsx`

**Checkpoint**: Two-column desktop layout renders; Playfair Display headline visible.

### Collage Animation (US4)

- [X] T020 [P] [US4] Define curated hero collage image URL constant (8–10 picsum IDs) inline in `src/pages/landing/LandingPage.jsx`
- [X] T021 [US4] Add `@keyframes scroll-up` rule (`translateY(0)` → `translateY(-50%)`, `linear infinite`) to `src/pages/landing/landing.css`
- [X] T022 [P] [US4] Add doubled-list collage container with freeform `rotate`/`translate` card styling and `animate-scroll-up` class in `src/pages/landing/LandingPage.jsx`

**Checkpoint**: User Story 4 is independently functional and testable.

---

## Phase 7: User Story 5 - Light / Dark Mode Toggle (Priority: P2)

**Goal**: Add a theme toggle icon to the navbar; switch the entire site between light and dark via CSS custom property swap; persist to localStorage; prevent FOUC via pre-render head script.

**Independent Test**: Click theme toggle in navbar to switch modes; verify all colors update immediately; reload page and confirm mode persists; verify OS `prefers-color-scheme` is respected on first visit with no saved preference.

### Theme Initialization & Style Setup (US5)

- [X] T023 [P] [US5] Add inline theme initialization script in `<head>` of `index.html` to read localStorage + `prefers-color-scheme` and apply `dark` class before React hydration
- [X] T024 [US5] Define CSS custom properties for dark mode in `html.dark {}` block in `src/styles/tailwind.css` (override `--bg-top`, `--bg-mid`, `--bg-bottom`, `--accent`, `--ink`, `--muted`)

**Checkpoint**: Dark mode CSS variables are ready.

### Theme Toggle Component (US5)

- [X] T025 [P] [US5] Create `src/components/theme/ThemeToggle.jsx` with sun/moon SVG icons and click handler to toggle `dark` class on `<html>` and save to localStorage
- [X] T026 [US5] Add `ThemeToggle` to the far-right of the navbar in `src/components/layout/AppLayout.jsx` (after download button)

**Checkpoint**: User Story 5 is independently functional and testable.

---

## Phase 8: User Story 6 - Site Footer (Priority: P3)

**Goal**: Add a full-width footer with three-column desktop layout (branding, nav, legal) that stacks to single column on mobile; include links to existing pages and placeholder anchors for future pages.

**Independent Test**: At viewport ≥ 768 px footer shows three columns; at < 768 px footer stacks to single centered column. Links to FAQ and About navigate correctly; placeholder links render as anchors.

### Footer Component (US6)

- [X] T027 [US6] Create `src/components/layout/SiteFooter.jsx` with three-column grid layout (branding/tagline left, navigation center, legal right) and mobile stacking
- [X] T028 [US6] Add `SiteFooter` to `AppLayout.jsx` below `<main>` element in `src/components/layout/AppLayout.jsx`
- [X] T029 [US6] Verify footer respects active light/dark theme via CSS variable inheritance in `src/components/layout/SiteFooter.jsx`

**Checkpoint**: User Story 6 is independently functional and testable.

---

## Phase 9: User Story 7 - Tag Filter Row (Priority: P2)

**Goal**: Add 10–12 clickable tag chips below Select All / Clear All controls; single active-tag filter; encode state in URL as `?tag=<tagname>` for shareability; compose with text search filter.

**Independent Test**: Click a tag chip to filter grid; verify chip shows active state; reload page and confirm filter persists via URL param. Click active chip to deactivate. Verify results show images matching both active tag AND text search query.

### Tag Extraction & Component Setup (US7)

- [X] T030 [US7] Extract all unique tags from `src/data/images.js` and derive the top 10–12 by frequency
- [X] T031 [P] [US7] Create `src/components/landing/TagFilterRow.jsx` with clickable tag chips, single active state, horizontal scroll layout, and dynamic `aria-label` values

**Checkpoint**: TagFilterRow component is ready for integration.

### Filter Integration (US7)

- [X] T032 [US7] Update `src/pages/landing/LandingPage.jsx` to import and render `TagFilterRow` below Select All / Clear All controls
- [X] T033 [US7] Wire `TagFilterRow` active state to URL query params via React Router in `src/pages/landing/LandingPage.jsx` (encode as `?tag=<tagname>`)
- [X] T034 [P] [US7] Create or extend filter function to compose tag + text search filters so results match both active tag AND typed query in `src/pages/landing/LandingPage.jsx`

**Checkpoint**: User Story 7 is independently functional and testable.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, regression checks, and release readiness.

- [X] T035 [P] Update manual validation checklist to match final implemented behavior for all seven user stories in `specs/004-landing-page-redesign/quickstart.md`
- [X] T036 Run `npm run build` and verify no errors (all seven user stories compiled)
- [ ] T037 Run full regression quickstart validation across desktop (1280 px, 1920 px) and mobile (375 px, 768 px) breakpoints for all seven user stories and record results in `specs/004-landing-page-redesign/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): no dependencies.
- Foundational (Phase 2): depends on Setup; blocks US1/US2/US3.
- User Story phases (Phases 3–5): depend on Foundational completion. [COMPLETED]
- US4 font setup (T016–T017): no dependency on Phases 2–5; can run in parallel with US1–US3. [COMPLETED]
- US4 hero layout (T018–T019): depends on T016–T017. [COMPLETED]
- US4 collage animation (T020–T022): depends on T018. [COMPLETED]
- US5 (Phase 7): depends on completion of US1–US4 (Phases 3–6); can start parallel with Phases 3–6 if needed.
- US6 (Phase 8): depends on US5 completion (Theme integration into AppLayout).
- US7 (Phase 9): depends on completion of US1–US4; can start parallel after US1–US4 foundation.
- Polish (Phase 10): depends on completion of all seven user stories.

### User Story Dependencies

- US1 (P1): can start immediately after Phase 2. [COMPLETED]
- US2 (P2): can start after Phase 2; functionally independent from US1. [COMPLETED]
- US3 (P3): can start after Phase 2; does not require US1/US2 logic changes. [COMPLETED]
- US4 (P1): independent of US1–US3; font config tasks can start immediately. [COMPLETED]
- US5 (P2): preferably after US4 to integrate ThemeToggle into updated AppLayout; theme CSS must be applied before other components render.
- US6 (P3): depends on US5 for AppLayout integration slot availability.
- US7 (P2): independent of US5/US6; can start after US1–US4 foundation. Can be done in parallel with US5.

### Recommended Delivery Order

**Completed:**
1. US1 (MVP) ✅
2. US2 ✅
3. US3 ✅
4. US4 (hero banner) ✅
5. US5 (theme toggle) ✅
6. US7 (tag filter row) ✅
7. US6 (site footer) ✅

---

## Parallel Opportunities

**Completed Phases** (US1–US4):
- `T002` was parallelizable with `T001`.
- In US1, `T005` was parallelizable with prep tasks, touching only `FavoriteToggle.jsx`.
- In US2, `T008` and `T010` were parallelizable with careful merge sequencing in `ImageCard.jsx`.
- In Polish, `T014` was parallelizable with final code review.
- T016–T017 (font config) were file-independent and parallelizable with US1–US3.

**Pending Phases** (US5–US7):
- T023–T024 (US5 styles) and T025–T026 (US5 component) can sequence independently: styles first, then component.
- T030–T031 (US7 setup) and T032–T034 (US7 integration) can sequence independently: extraction first, then rendering + filtering logic.
- T027–T029 (US6) should follow T026 (US5 navbar integration point) to avoid conflicts in AppLayout.
- US5 (T023–T026) and US7 (T030–T034) can run in parallel as they touch different files and code areas.

### Parallel Example (Pending): User Story 5 Theme Setup

```bash
Task: T023–T024 [US5] in index.html and tailwind.css (sequential: styles first)
Task: T025–T026 [US5] in ThemeToggle.jsx and AppLayout.jsx (wait for T024 complete)
```

### Parallel Example (Pending): User Story 7 Tag Filter Setup

```bash
Task: T030–T031 [US7] in images.js → TagFilterRow.jsx (sequential: extraction first)
Task: T032–T034 [US7] in LandingPage.jsx (can run parallel with T031 if tag list is stubbed)
```

### Blockages to Respect

- T026 (add ThemeToggle to AppLayout) must complete **before** T028 (add SiteFooter to AppLayout) to avoid merge conflicts in the same file.
- T024 (define dark mode CSS) must complete **before** T025 (create ThemeToggle component) to ensure toggle can actually switch themes.
- T032 (render TagFilterRow) can start after LandingPage is finalized from US4 (after T022 complete).

---

## Implementation Strategy

### Completed (US1–US7)

1. ✅ Phase 1 and Phase 2 complete.
2. ✅ US1–US7 implementation tasks completed.
3. ✅ Build passing (`npm run build`: 67 modules transformed, no errors).

### Pending

1. ⏳ T037 manual regression validation across 375/768/1280/1920 breakpoints and recording results in `quickstart.md`.

### Validation Criteria by Story

**Completed:**
- US1 ✅: Heart icon toggles correctly and persists favorites after reload.
- US2 ✅: Direct download starts from card; busy and error states behave correctly.
- US3 ✅: Grid fills horizontal space across defined viewport sizes without distortion.
- US4 ✅: Hero shows 50/50 text/collage on desktop; collage scrolls upward continuously; stacks on mobile; headline renders in Playfair Display.

**Pending:**
- Final manual regression execution and confirmation for T037.
