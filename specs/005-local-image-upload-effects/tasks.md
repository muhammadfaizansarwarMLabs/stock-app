# Tasks: Local Image Upload Effects + Mobile Responsiveness

**Input**: Design documents from `/specs/005-local-image-upload-effects/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/ui-contract.md`, `quickstart.md`

**Tests**: Automated tests are not explicitly requested in the specification; tasks focus on implementation and manual validation from `quickstart.md`.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Phase 1: Setup (Project Alignment)

**Purpose**: Confirm implementation scope, touched files, and responsive behavior targets before coding.

- [X] T001 Confirm clarified requirements and acceptance scenarios in `specs/005-local-image-upload-effects/spec.md`
- [X] T002 [P] Reconcile implementation scope and file map in `specs/005-local-image-upload-effects/plan.md`
- [X] T003 [P] Confirm responsive contract and breakpoint behavior (`<=768px`) in `specs/005-local-image-upload-effects/contracts/ui-contract.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build shared upload session and responsive state infrastructure required by all user stories.

**CRITICAL**: Complete this phase before any user story work.

- [X] T004 Create/verify uploaded image source helpers (normalize + MIME validation + revoke) in `src/utils/uploaded-image-source.js`
- [X] T005 Implement uploaded session state lifecycle and cleanup on route/unmount in `src/app/router.jsx`
- [X] T006 [P] Add modal source resolution for stock vs uploaded images in `src/app/router.jsx`
- [X] T007 [P] Add mobile navbar menu state scaffold and close handler plumbing in `src/components/layout/AppLayout.jsx`
- [X] T008 Add mobile modal viewport-mode + scroll-lock foundation in `src/components/image-modal/ImageModal.jsx`

**Checkpoint**: Shared upload and responsive infrastructure is ready.

---

## Phase 3: User Story 1 - Upload and Open in Preview Modal (Priority: P1) 🎯 MVP

**Goal**: Let users upload an image from below the title filter and open it in the existing preview modal.

**Independent Test**: On landing page, click upload below title filter, choose valid image, modal opens with uploaded image; cancel leaves state unchanged.

### Implementation for User Story 1

- [X] T009 [P] [US1] Add upload action UI directly below title filter in `src/pages/landing/LandingPage.jsx`
- [X] T010 [US1] Wire upload button to hidden file input and picker trigger in `src/pages/landing/LandingPage.jsx`
- [X] T011 [US1] Implement file selection handler (valid image -> normalized uploaded source) in `src/pages/landing/LandingPage.jsx`
- [X] T012 [US1] Navigate uploaded selection into modal route state in `src/pages/landing/LandingPage.jsx`
- [X] T013 [US1] Add invalid-file and canceled-selection handling with inline feedback in `src/pages/landing/LandingPage.jsx`

**Checkpoint**: US1 is independently functional.

---

## Phase 4: User Story 2 - Apply Effects to Uploaded Image (Priority: P1)

**Goal**: Ensure uploaded images use the same effects and preview behavior as stock images.

**Independent Test**: Upload image, adjust effects, preview updates immediately; reset returns image to original uploaded appearance.

### Implementation for User Story 2

- [X] T014 [P] [US2] Ensure uploaded image metadata fallback (title/alt/tags) is rendered safely in `src/components/image-modal/ImagePreviewPanel.jsx`
- [X] T015 [US2] Ensure preview reload/reset behavior on uploaded source change in `src/components/image-modal/ImagePreviewPanel.jsx`
- [X] T016 [US2] Keep effects state handling parity between stock and uploaded sources in `src/components/image-modal/ImageModal.jsx`
- [X] T017 [US2] Verify effects controls continue to operate without source-specific branching in `src/components/image-modal/EffectsPanel.jsx`

**Checkpoint**: US2 is independently functional.

---

## Phase 5: User Story 4 - Responsive Navbar and Modal on Mobile (Priority: P1)

**Goal**: Provide mobile navbar toggle behavior and full-screen modal mode for viewport widths `<=768px` while preserving desktop behavior.

**Independent Test**: At `<=768px`, navbar toggle opens/closes menu and auto-closes on link selection; modal opens full-screen with internal scroll and locked background scroll.

### Implementation for User Story 4

- [X] T018 [US4] Add mobile navbar toggle button with accessible expanded/collapsed semantics in `src/components/layout/AppLayout.jsx`
- [X] T019 [US4] Implement responsive nav container visibility for mobile toggle state in `src/components/layout/AppLayout.jsx`
- [X] T020 [US4] Auto-collapse mobile menu when a nav link is selected in `src/components/layout/AppLayout.jsx`
- [X] T021 [US4] Keep desktop navbar behavior unchanged above `768px` in `src/components/layout/AppLayout.jsx`
- [X] T022 [US4] Implement full-screen modal presentation for mobile viewport (`<=768px`) in `src/components/image-modal/ImageModal.jsx`
- [X] T023 [US4] Implement internal modal scrolling and prevent horizontal overflow in `src/components/image-modal/ImageModal.jsx`
- [X] T024 [US4] Lock/unlock background page scrolling while mobile full-screen modal is open in `src/components/image-modal/ImageModal.jsx`
- [X] T025 [P] [US4] Ensure modal action rows remain reachable and wrap correctly on narrow widths in `src/components/image-modal/ImageModal.jsx`

**Checkpoint**: US4 is independently functional.

---

## Phase 6: User Story 3 - Download and Change Uploaded Image (Priority: P2)

**Goal**: Allow downloading effected uploaded images and changing uploaded source from within modal.

**Independent Test**: Upload image, apply effect, download result, change image beside Download, and confirm cancel keeps current preview.

### Implementation for User Story 3

- [X] T026 [US3] Show `Change Image` action beside Download only for uploaded modal sessions in `src/components/image-modal/ImageModal.jsx`
- [X] T027 [US3] Implement in-modal `Change Image` picker flow and source replacement in `src/components/image-modal/ImageModal.jsx`
- [X] T028 [US3] Revoke prior object URL on successful uploaded image replacement in `src/components/image-modal/ImageModal.jsx`
- [X] T029 [P] [US3] Ensure download behavior preserves effects output for uploaded and stock sources in `src/utils/download-image.js`
- [X] T030 [P] [US3] Ensure renderer handles uploaded object URLs and remote URLs correctly in `src/utils/render-image-with-effects.js`
- [X] T031 [US3] Keep stock-image modal actions unchanged (no upload-only actions) in `src/components/image-modal/ImageModal.jsx`

**Checkpoint**: US3 is independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, documentation sync, and regression confidence.

- [X] T032 [P] Update manual validation checklist for responsive navbar/modal and upload flow in `specs/005-local-image-upload-effects/quickstart.md`
- [X] T033 Run production build and record verification notes in `specs/005-local-image-upload-effects/quickstart.md`
- [ ] T034 Run full manual regression across desktop/mobile scenarios and capture outcomes in `specs/005-local-image-upload-effects/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Starts immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 and blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2.
- **Phase 4 (US2)**: Depends on Phase 2 and uses US1 upload source behavior.
- **Phase 5 (US4)**: Depends on Phase 2 and can run in parallel with US2 if staffed.
- **Phase 6 (US3)**: Depends on US1 + US2 foundation and modal behaviors.
- **Phase 7 (Polish)**: Depends on all story phases completing.

### User Story Dependencies

- **US1 (P1)**: No dependency on other stories after foundational phase.
- **US2 (P1)**: Depends on uploaded-source modal entry from US1.
- **US4 (P1)**: Depends on foundational responsive state setup only.
- **US3 (P2)**: Depends on US1 + US2 modal/upload flow readiness.

### Within Each User Story

- Source/state setup before UI wiring.
- UI wiring before edge-case handling.
- Behavior parity before responsive polish.
- Validate each story independently before moving forward.

### Parallel Opportunities

- `T002` and `T003` can run in parallel.
- `T006` and `T007` can run in parallel after `T005` starts.
- `T009` and `T012` can run in parallel before final US1 glue.
- `T014` and `T015` can run in parallel.
- `T025` can run in parallel with `T023`.
- `T029` and `T030` can run in parallel.
- `T032` and `T033` can run in parallel.

---

## Parallel Example: User Story 1

```bash
Task: T009 [US1] Add upload action UI in src/pages/landing/LandingPage.jsx
Task: T012 [US1] Navigate uploaded selection into modal route state in src/pages/landing/LandingPage.jsx
```

## Parallel Example: User Story 2

```bash
Task: T014 [US2] Metadata fallback in src/components/image-modal/ImagePreviewPanel.jsx
Task: T015 [US2] Preview reload/reset in src/components/image-modal/ImagePreviewPanel.jsx
```

## Parallel Example: User Story 4

```bash
Task: T019 [US4] Responsive nav container visibility in src/components/layout/AppLayout.jsx
Task: T025 [US4] Modal action row mobile wrapping in src/components/image-modal/ImageModal.jsx
```

## Parallel Example: User Story 3

```bash
Task: T029 [US3] Effects-aware uploaded download behavior in src/utils/download-image.js
Task: T030 [US3] Uploaded URL renderer compatibility in src/utils/render-image-with-effects.js
```

---

## Implementation Strategy

### MVP First (P1 upload path)

1. Complete Phase 1 and Phase 2.
2. Complete US1 (Phase 3) and validate upload -> modal open.
3. Add US2 effects parity.
4. Add US4 responsive behavior for mobile usability.

### Incremental Delivery

1. Deliver US1.
2. Deliver US2.
3. Deliver US4.
4. Deliver US3.
5. Complete polish and manual regression.

### Parallel Team Strategy

1. Developer A: Upload flow (`LandingPage.jsx`, `router.jsx`).
2. Developer B: Modal behavior (`ImageModal.jsx`, `ImagePreviewPanel.jsx`).
3. Developer C: Download/render utilities (`download-image.js`, `render-image-with-effects.js`).

---

## Notes

- `[P]` tasks are parallel-safe (different files, no blocking dependency).
- `[US#]` labels map work to user stories for traceability.
- Keep stock-image browsing/favorites behavior intact while adding upload and responsive enhancements.
- Use `specs/005-local-image-upload-effects/quickstart.md` as the final manual validation source of truth.
