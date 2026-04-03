# Tasks: Local Image Upload Effects

**Input**: Design documents from `/specs/005-local-image-upload-effects/`  
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/ui-contract.md`, `quickstart.md`

**Tests**: Automated tests are not explicitly requested in the feature spec; this task list prioritizes implementation plus manual verification from `specs/005-local-image-upload-effects/quickstart.md`.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Align scope and prepare shared upload-modal utilities.

- [X] T001 Confirm feature scope, edge cases, and acceptance criteria in `specs/005-local-image-upload-effects/spec.md`
- [X] T002 [P] Confirm technical approach and touched files in `specs/005-local-image-upload-effects/plan.md`
- [X] T003 [P] Create uploaded image normalization helpers (id/title/alt/tags mapping) in `src/utils/uploaded-image-source.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build shared upload source state + lifecycle handling that all user stories depend on.

**CRITICAL**: Complete this phase before any user story work.

- [X] T004 Add uploaded image session state and cleanup lifecycle in `src/app/router.jsx`
- [X] T005 Add object URL revoke utility for replace/close flows in `src/utils/uploaded-image-source.js`
- [X] T006 Add router modal source resolution for stock vs uploaded image sources in `src/app/router.jsx`
- [X] T007 Add shared file validation helper for `image/*` MIME checks in `src/utils/uploaded-image-source.js`

**Checkpoint**: Uploaded-source plumbing is ready and user story implementation can begin.

---

## Phase 3: User Story 1 - Upload and Open in Preview Modal (Priority: P1) 🎯 MVP

**Goal**: Let user upload from device below title filter and open the selected image in the existing preview modal.

**Independent Test**: Click upload below title filter, choose a valid image, and verify existing modal opens with that image; cancel picker and verify no state changes.

### Implementation for User Story 1

- [X] T008 [P] [US1] Add upload control UI directly below title filter in `src/pages/landing/LandingPage.jsx`
- [X] T009 [US1] Wire upload control to hidden file input and picker trigger behavior in `src/pages/landing/LandingPage.jsx`
- [X] T010 [US1] Implement upload selection handler (valid file -> normalized uploaded source) in `src/pages/landing/LandingPage.jsx`
- [X] T011 [US1] Connect upload selection to modal-open route state in `src/app/router.jsx`
- [X] T012 [US1] Add invalid file and canceled selection no-op handling with user-visible message in `src/pages/landing/LandingPage.jsx`

**Checkpoint**: User Story 1 is independently functional and testable.

---

## Phase 4: User Story 2 - Apply Effects to Uploaded Image (Priority: P1)

**Goal**: Reuse existing modal effects controls so uploaded images can be edited exactly like stock images.

**Independent Test**: With uploaded image open, adjust effect controls and verify live preview updates; reset controls and verify original uploaded appearance returns.

### Implementation for User Story 2

- [X] T013 [P] [US2] Ensure uploaded source shape matches `ImageModal` expectations in `src/utils/uploaded-image-source.js`
- [X] T014 [US2] Update modal source handling for uploaded preview metadata (title/alt/tags fallback) in `src/components/image-modal/ImageModal.jsx`
- [X] T015 [US2] Ensure preview reload/reset behavior works when modal image source changes in `src/components/image-modal/ImagePreviewPanel.jsx`
- [X] T016 [US2] Ensure uploaded-source modal flow preserves existing effects panel behavior in `src/components/image-modal/EffectsPanel.jsx`

**Checkpoint**: User Stories 1 and 2 work independently.

---

## Phase 5: User Story 3 - Download and Change Uploaded Image (Priority: P2)

**Goal**: Download effected uploaded image and provide `Change Image` beside Download when uploaded source is active.

**Independent Test**: Upload image, apply effects, download result, click Change Image to replace source, and verify cancel leaves current preview unchanged.

### Implementation for User Story 3

- [X] T017 [US3] Add `Change Image` action beside Download only for uploaded modal sources in `src/components/image-modal/ImageModal.jsx`
- [X] T018 [US3] Implement in-modal change-image picker + replacement workflow in `src/components/image-modal/ImageModal.jsx`
- [X] T019 [US3] Revoke previous uploaded object URL on successful change-image replacement in `src/components/image-modal/ImageModal.jsx`
- [X] T020 [US3] Extend download utility for uploaded object URL sources while preserving effects-aware export behavior in `src/utils/download-image.js`
- [X] T021 [P] [US3] Ensure effects renderer compatibility for uploaded source URLs and error messaging in `src/utils/render-image-with-effects.js`
- [X] T022 [US3] Hide upload-only modal actions for stock-image sessions in `src/components/image-modal/ImageModal.jsx`

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, regressions, and documentation updates.

- [X] T023 [P] Add manual validation steps for upload/change-image/download edge cases in `specs/005-local-image-upload-effects/quickstart.md`
- [X] T024 Run production build verification and capture result notes in `specs/005-local-image-upload-effects/quickstart.md`
- [ ] T025 Run full quickstart regression (desktop + mobile) and record outcomes in `specs/005-local-image-upload-effects/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Phase 1 and blocks all user story work.
- **Phase 3 (US1)**: Depends on Phase 2 completion.
- **Phase 4 (US2)**: Depends on Phase 2 completion; can start after US1 foundation is merged.
- **Phase 5 (US3)**: Depends on US1 and US2 completion because it extends modal action/download behavior for uploaded sources.
- **Phase 6 (Polish)**: Depends on all user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Starts after foundational phase; no dependency on other stories.
- **US2 (P1)**: Starts after foundational phase and uses US1 uploaded-source path.
- **US3 (P2)**: Starts after US1/US2 because it relies on uploaded modal context and effects behavior.

### Within Each User Story

- Source normalization before UI wiring.
- Modal source open path before effects and download refinements.
- Change-image replacement before cleanup/error hardening.
- Complete and manually validate each story before proceeding.

### Parallel Opportunities

- Setup tasks `T002` and `T003` can run in parallel.
- Foundational tasks `T005` and `T007` can run in parallel while `T004/T006` proceed.
- In US1, `T008` and `T011` can run in parallel before final wiring in `T010`.
- In US2, `T013` and `T015` can run in parallel.
- In US3, `T020` and `T021` can run in parallel.
- In polish, `T023` can run in parallel with build execution in `T024`.

---

## Parallel Example: User Story 1

```bash
# Parallel UI and routing prep for US1
Task: T008 [US1] Add upload control UI in src/pages/landing/LandingPage.jsx
Task: T011 [US1] Connect upload selection to modal-open route state in src/app/router.jsx
```

---

## Parallel Example: User Story 2

```bash
# Parallel source-shape and preview behavior updates for US2
Task: T013 [US2] Ensure uploaded source shape for ImageModal in src/utils/uploaded-image-source.js
Task: T015 [US2] Ensure preview reset/reload on source change in src/components/image-modal/ImagePreviewPanel.jsx
```

---

## Parallel Example: User Story 3

```bash
# Parallel download pipeline hardening for US3
Task: T020 [US3] Extend uploaded-source download behavior in src/utils/download-image.js
Task: T021 [US3] Ensure renderer compatibility for uploaded URLs in src/utils/render-image-with-effects.js
```

---

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate upload->modal-open flow before continuing.

### Incremental Delivery

1. Deliver US1 (upload + open modal).
2. Deliver US2 (effects parity for uploaded source).
3. Deliver US3 (download effected uploaded image + change image action).
4. Complete polish and regression checks.

### Parallel Team Strategy

1. Developer A: landing upload UI + picker flow (`LandingPage.jsx`).
2. Developer B: modal source and action behavior (`ImageModal.jsx`, `ImagePreviewPanel.jsx`).
3. Developer C: download/render pipeline updates (`download-image.js`, `render-image-with-effects.js`).

---

## Notes

- `[P]` tasks are file-independent and parallel-safe.
- `[US#]` labels map each implementation task to a specific user story.
- Each story has independent validation criteria from `spec.md`.
- Keep stock image modal/favorites flows unchanged while implementing uploaded-source behavior.
