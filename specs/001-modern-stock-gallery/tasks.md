# Tasks: Modern Stock Images Experience

**Input**: Design documents from `/specs/001-modern-stock-gallery/`
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: No TDD or mandatory automated test-first requirement was explicitly requested in the specification. Tasks include implementation and validation steps aligned to acceptance scenarios.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize static React + Tailwind project scaffolding and baseline app shell.

- [X] T001 Initialize React static app dependencies in package.json
- [X] T002 Configure Tailwind and PostCSS setup in tailwind.config.js and postcss.config.js
- [X] T003 [P] Create base source folder structure and placeholder files in src/app/.gitkeep
- [X] T004 [P] Define base global styles and Tailwind imports in src/styles/tailwind.css
- [X] T005 Create app entry wiring and root render in src/main.jsx
- [X] T006 Create top-level app component shell in src/App.jsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build shared routing, data, and utility primitives required by all user stories.

**⚠️ CRITICAL**: No user story implementation starts before this phase is complete.

- [X] T007 Configure application routes and navigation shell in src/app/router.jsx
- [X] T008 [P] Create embedded mock image dataset in src/data/images.js
- [X] T009 [P] Create embedded FAQ dataset in src/data/faq.js
- [X] T010 [P] Create embedded About content dataset in src/data/about.js
- [X] T011 Implement favorites localStorage state manager in src/state/favorites-store.js
- [X] T012 [P] Implement title filter utility in src/utils/filter-images.js
- [X] T013 [P] Implement robust image download helper with error return states in src/utils/download-image.js
- [X] T014 Create shared responsive layout and top navigation component in src/components/layout/AppLayout.jsx

**Checkpoint**: Foundation complete; user stories can proceed.

---

## Phase 3: User Story 1 - Discover Popular Images (Priority: P1) 🎯 MVP

**Goal**: Deliver a standout landing page with popular images grid and title filtering.

**Independent Test**: Load `/`, confirm popular image grid appears, apply title filter, and verify matching/no-results behavior.

### Implementation for User Story 1

- [X] T015 [P] [US1] Create landing page route component in src/pages/landing/LandingPage.jsx
- [X] T016 [P] [US1] Create reusable title filter input component in src/components/filters/TitleFilter.jsx
- [X] T017 [P] [US1] Create image card component with accessible metadata in src/components/image-grid/ImageCard.jsx
- [X] T018 [US1] Create responsive image grid component and empty-state rendering in src/components/image-grid/ImageGrid.jsx
- [X] T019 [US1] Compose landing page with popular-images selection and title filtering logic in src/pages/landing/LandingPage.jsx
- [X] T020 [US1] Apply sleek responsive visual treatment for landing hero and grid layout in src/pages/landing/landing.css
- [X] T021 [US1] Wire landing route into app router and layout navigation in src/app/router.jsx

**Checkpoint**: User Story 1 is independently functional and demo-ready as MVP.

---

## Phase 4: User Story 2 - Inspect and Download in Modal (Priority: P2)

**Goal**: Enable same-route modal with large image preview and download action.

**Independent Test**: From landing grid, click image to open modal, verify same-route overlay behavior, download image, and close modal to prior page state.

### Implementation for User Story 2

- [X] T022 [P] [US2] Create modal shell with keyboard and pointer close behaviors in src/components/image-modal/ImageModal.jsx
- [X] T023 [P] [US2] Create large-preview content component with image metadata in src/components/image-modal/ImagePreviewPanel.jsx
- [X] T024 [US2] Implement same-route background-location modal routing behavior in src/app/router.jsx
- [X] T025 [US2] Connect landing image-card selection state to modal open action in src/pages/landing/LandingPage.jsx
- [X] T026 [US2] Add modal download action integration using shared download helper in src/components/image-modal/ImageModal.jsx
- [X] T027 [US2] Implement recoverable download error feedback UI in src/components/image-modal/ImageModal.jsx

**Checkpoint**: User Story 2 works independently with stable open/close/download flows.

---

## Phase 5: User Story 3 - Save Favorites and Read Info Pages (Priority: P3)

**Goal**: Provide favorites add/remove with persistence plus About and FAQ pages.

**Independent Test**: Add/remove favorites from image surfaces, refresh and confirm persistence, open `/favorites`, `/about`, and `/faq` from navigation.

### Implementation for User Story 3

- [X] T028 [P] [US3] Create reusable favorite toggle control component in src/components/favorites/FavoriteToggle.jsx
- [X] T029 [US3] Integrate favorite toggle actions on landing image cards in src/components/image-grid/ImageCard.jsx
- [X] T030 [US3] Create favorites page route and list rendering in src/pages/favorites/FavoritesPage.jsx
- [X] T031 [US3] Create favorites list component with remove action in src/components/favorites/FavoritesList.jsx
- [X] T032 [US3] Wire favorites route and persisted state hydration in src/app/router.jsx
- [X] T033 [P] [US3] Create About page from embedded content in src/pages/about/AboutPage.jsx
- [X] T034 [P] [US3] Create FAQ page from embedded FAQ entries in src/pages/faq/FaqPage.jsx
- [X] T035 [US3] Add favorites, About, and FAQ navigation links in src/components/layout/AppLayout.jsx

**Checkpoint**: User Story 3 is independently functional without breaking earlier stories.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality, accessibility, and readiness checks across all stories.

- [X] T036 [P] Improve keyboard accessibility labels and focus states for shared controls in src/components/layout/AppLayout.jsx
- [X] T037 [P] Tune mobile-first spacing, typography, and breakpoint behavior across pages in src/styles/tailwind.css
- [X] T038 Add consistent empty/error state messaging component for landing, modal, and favorites flows in src/components/layout/FeedbackState.jsx
- [X] T039 [P] Document local setup and validation steps for this feature in specs/001-modern-stock-gallery/quickstart.md
- [X] T040 Run full quickstart manual validation checklist and record results in specs/001-modern-stock-gallery/checklists/requirements.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Starts immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user story phases.
- **Phase 3 (US1)**: Depends on Phase 2.
- **Phase 4 (US2)**: Depends on Phase 2 and integrates with US1 image selection surface.
- **Phase 5 (US3)**: Depends on Phase 2 and integrates with shared grid/layout surfaces.
- **Phase 6 (Polish)**: Depends on completion of target user stories.

### User Story Dependencies

- **US1 (P1)**: No dependency on other user stories.
- **US2 (P2)**: Builds on shared image presentation from US1 but remains independently testable once integrated.
- **US3 (P3)**: Uses shared image and routing surfaces from US1/US2 but remains independently testable.

### Within Each User Story

- Shared components before page composition.
- Page composition before router integration.
- Router integration before end-to-end story validation.

---

## Parallel Opportunities

- Setup: `T003` and `T004` can run in parallel.
- Foundational: `T008`, `T009`, `T010`, `T012`, and `T013` can run in parallel after `T007`.
- US1: `T015`, `T016`, and `T017` can run in parallel.
- US2: `T022` and `T023` can run in parallel.
- US3: `T028`, `T033`, and `T034` can run in parallel.
- Polish: `T036`, `T037`, and `T039` can run in parallel.

---

## Parallel Example: User Story 1

```bash
# Parallelizable US1 tasks:
Task T015: Create landing page route component in src/pages/landing/LandingPage.jsx
Task T016: Create reusable title filter input component in src/components/filters/TitleFilter.jsx
Task T017: Create image card component with accessible metadata in src/components/image-grid/ImageCard.jsx
```

## Parallel Example: User Story 2

```bash
# Parallelizable US2 tasks:
Task T022: Create modal shell with keyboard and pointer close behaviors in src/components/image-modal/ImageModal.jsx
Task T023: Create large-preview content component with image metadata in src/components/image-modal/ImagePreviewPanel.jsx
```

## Parallel Example: User Story 3

```bash
# Parallelizable US3 tasks:
Task T028: Create reusable favorite toggle control component in src/components/favorites/FavoriteToggle.jsx
Task T033: Create About page from embedded content in src/pages/about/AboutPage.jsx
Task T034: Create FAQ page from embedded FAQ entries in src/pages/faq/FaqPage.jsx
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1 and Phase 2.
2. Deliver Phase 3 (US1) as MVP.
3. Validate US1 independently via landing grid + filter behavior.

### Incremental Delivery

1. Add US2 modal/preview/download flow.
2. Validate same-route modal behavior and download error handling.
3. Add US3 favorites + informational pages.
4. Finish with Phase 6 polish and full quickstart validation.

### Parallel Team Strategy

1. Team completes Setup + Foundational together.
2. Then split by stories/components:
   - Developer A: US1 landing/filter stack.
   - Developer B: US2 modal/download stack.
   - Developer C: US3 favorites/about/faq stack.
3. Merge at checkpoints and run full validation in Phase 6.
