# Tasks: Bulk Image Download with ZIP

**Input**: Design documents from `/specs/002-bulk-download-zip/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/ui-contract.md, quickstart.md

**Tests**: No explicit TDD or automated-test requirement was requested in the feature specification, so this task list focuses on implementation and manual validation via quickstart scenarios.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add dependency and scaffold new feature files.

- [X] T001 Add JSZip dependency for client-side archive generation in `package.json`
- [X] T002 [P] Create selection context scaffold in `src/state/selection-context.jsx`
- [X] T003 [P] Create ZIP utility scaffold in `src/utils/download-zip.js`
- [X] T004 [P] Create navbar download trigger component scaffold in `src/components/bulk-download/DownloadButton.jsx`
- [X] T005 [P] Create dismissible alert component scaffold in `src/components/layout/ErrorBanner.jsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build shared selection and ZIP infrastructure required by all user stories.

**CRITICAL**: No user story work should begin until this phase is complete.

- [X] T006 Implement `SelectionProvider` state, context API, and `useSelection()` guard in `src/state/selection-context.jsx`
- [X] T007 [P] Implement `downloadZip(images)` with `Promise.allSettled`, ZIP filename generation, and blob download in `src/utils/download-zip.js`
- [X] T008 Wire `downloadSelected`, `zipJob` transitions, and error-dismiss behavior inside `src/state/selection-context.jsx`
- [X] T009 Integrate `<SelectionProvider>` inside router tree (inside `<Router>`) in `src/app/router.jsx`
- [X] T010 Add navbar placement for `<DownloadButton />` and inline `<ErrorBanner />` mount points in `src/components/layout/AppLayout.jsx`

**Checkpoint**: Foundation ready. User story implementation can begin.

---

## Phase 3: User Story 1 - Select Images and Download as ZIP (Priority: P1) 🎯 MVP

**Goal**: Let users select image cards and download selected full-resolution images as one ZIP.

**Independent Test**: On landing page, select 3+ images, click download, verify ZIP downloads and includes selected items; verify loading state and partial-failure alert behavior.

### Implementation for User Story 1

- [X] T011 [P] [US1] Add selectable checkbox UI, selected-ring styling, and click isolation (`stopPropagation`) in `src/components/image-grid/ImageCard.jsx`
- [X] T012 [US1] Connect card selection handlers from context and pass `isSelected`/`onToggleSelect` props in `src/components/image-grid/ImageGrid.jsx`
- [X] T013 [US1] Implement download action state handling (disabled/loading/click guard) in `src/components/bulk-download/DownloadButton.jsx`
- [X] T014 [US1] Resolve selected image records and invoke `downloadSelected(selectedImages)` from navbar control in `src/components/bulk-download/DownloadButton.jsx`
- [X] T015 [US1] Render partial-failure dismissible alert (`role="alert"`) from `zipJob` error state in `src/components/layout/ErrorBanner.jsx`

**Checkpoint**: User Story 1 is functional and independently testable.

---

## Phase 4: User Story 2 - View Selected Image Count (Priority: P2)

**Goal**: Show live selected-image count next to the navbar download control.

**Independent Test**: Toggle selections and confirm displayed count increments/decrements immediately and shows zero when nothing is selected.

### Implementation for User Story 2

- [X] T016 [US2] Display real-time `selectedIds.size` text/count badge next to "Download Selected" in `src/components/bulk-download/DownloadButton.jsx`
- [X] T017 [US2] Ensure non-landing routes keep button visible but non-functional/disabled while count presentation remains consistent in `src/components/bulk-download/DownloadButton.jsx`

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Select All / Clear All (Priority: P3)

**Goal**: Allow fast bulk selection management for visible filtered images.

**Independent Test**: Apply a title filter, click Select All to select only visible cards, then Clear All to reset all selections.

### Implementation for User Story 3

- [X] T018 [US3] Add Select All and Clear All toolbar controls above the grid in `src/pages/landing/LandingPage.jsx`
- [X] T019 [US3] Wire Select All to current filtered/visible IDs and Clear All to global deselection in `src/pages/landing/LandingPage.jsx`
- [X] T020 [US3] Ensure selection persistence across filtering but reset on route navigation using pathname effect in `src/state/selection-context.jsx`

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality pass across all stories.

- [X] T021 [P] Refine responsive checkbox visibility behavior (desktop hover vs mobile always-visible) in `src/components/image-grid/ImageCard.jsx`
- [X] T022 [P] Improve accessibility labels and keyboard focus states for checkbox, toolbar, and download controls in `src/components/image-grid/ImageCard.jsx`
- [ ] T023 Run end-to-end manual quickstart validation scenarios and update notes in `specs/002-bulk-download-zip/quickstart.md`
- [X] T024 Run build verification and resolve any integration regressions for touched files via `npm run build`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2 completion.
- **Phase 4 (US2)**: Depends on Phase 2 completion; can be developed after US1 core wiring is present.
- **Phase 5 (US3)**: Depends on Phase 2 completion; uses selection context and landing-page filtered list.
- **Phase 6 (Polish)**: Depends on completion of desired user stories.

### User Story Dependencies

- **US1 (P1)**: Starts after foundational phase; no dependency on other stories.
- **US2 (P2)**: Starts after foundational phase; relies on selection state exposed by context.
- **US3 (P3)**: Starts after foundational phase; relies on selection context and landing-page filtered list.

### Within Each User Story

- UI wiring before action orchestration.
- Context-backed actions before route-specific behavior refinements.
- Story checkpoint validation before moving to next priority.

### Parallel Opportunities

- Phase 1 tasks `T002`, `T003`, `T004`, `T005` can run in parallel.
- Phase 2 tasks `T007` can run in parallel with context implementation once interfaces are agreed.
- Polish tasks `T021` and `T022` can run in parallel.

---

## Parallel Example: User Story 1

```bash
Task T011: Add selectable checkbox UI in src/components/image-grid/ImageCard.jsx
Task T013: Implement download action state handling in src/components/bulk-download/DownloadButton.jsx
```

## Parallel Example: User Story 2

```bash
Task T016: Add selected count presentation in src/components/bulk-download/DownloadButton.jsx
Task T017: Enforce route-aware disabled behavior in src/components/bulk-download/DownloadButton.jsx
```

## Parallel Example: User Story 3

```bash
Task T018: Add Select All / Clear All toolbar in src/pages/landing/LandingPage.jsx
Task T020: Finalize pathname reset behavior in src/state/selection-context.jsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate ZIP download flow with partial-failure behavior.
4. Demo/deploy MVP.

### Incremental Delivery

1. Deliver US1 for core value.
2. Add US2 for count feedback.
3. Add US3 for bulk convenience.
4. Finish with Phase 6 polish and build verification.

### Parallel Team Strategy

1. Team aligns on context API from Phase 2.
2. Developer A: `ImageCard` + `ImageGrid` tasks.
3. Developer B: `DownloadButton` + `ErrorBanner` tasks.
4. Developer C: `LandingPage` toolbar + quickstart validation.
