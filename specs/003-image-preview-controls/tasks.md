# Tasks: Image Preview Controls and Effects-Aware Download

**Input**: Design documents from `/specs/003-image-preview-controls/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/ui-contract.md, quickstart.md

**Tests**: The specification does not explicitly require a TDD-first workflow, so this breakdown focuses on implementation plus manual and build validation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare shared constants, state shape, and file scaffolding for all effects.

- [X] T001 Update preview transform constants to include all effect defaults: `ZOOM_DEFAULT=100`, `ZOOM_MIN=50`, `ZOOM_MAX=200`, `ZOOM_STEP=10`, `OPACITY_DEFAULT=100`, `BRIGHTNESS_DEFAULT=100`, `CONTRAST_DEFAULT=100`, `BLUR_DEFAULT=0`, `GRAYSCALE_DEFAULT=0`, `ROTATION_DEFAULT=0`, `FLIP_H_DEFAULT=false`, `FLIP_V_DEFAULT=false` in `src/components/image-modal/ImageModal.jsx`
- [X] T002 [P] Icon button styling utilities for modal controls in `src/components/image-modal/ImageModal.jsx`
- [X] T003 [P] Update preview transform prop signature to accept all transform/filter props (`zoom`, `opacity`, `brightness`, `contrast`, `blur`, `grayscale`, `rotation`, `flipH`, `flipV`) in `src/components/image-modal/ImagePreviewPanel.jsx`
- [X] T028 [P] Create `EffectsPanel.jsx` component file scaffold with prop interface (`effects`, `onUpdate`, `onReset`, `onResetAll`) in `src/components/image-modal/EffectsPanel.jsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build shared transform/download foundations required by all user stories. No user story work should begin until this phase is complete.

- [X] T004 `downloadImage(image, effects)` signature extension and default-mode detection in `src/utils/download-image.js`
- [X] T005 [P] Update canvas-based effects export helper to apply all CSS filters (brightness, contrast, blur, grayscale, opacity) then compose transforms (rotate first, flip second) at original dimensions, output PNG blob in `src/utils/render-image-with-effects.js`
- [X] T038 [P] Update `isEffectsActive` detection in `src/utils/download-image.js` to check all 9 controls (zoom, opacity, brightness, contrast, blur, grayscale, rotation, flipH, flipV) against their defaults
- [X] T006 Wire `download-image` utility to route transformed downloads through `render-image-with-effects` when effects are non-default in `src/utils/download-image.js`
- [X] T007 Preserve existing return contract (`{ ok, message? }`) and normalize error messages for both download modes in `src/utils/download-image.js`

**Checkpoint**: Foundation ready. User story implementation can begin.

---

## Phase 3: User Story 1 — Improved Modal Controls (Priority: P1) ✅ Done

**Goal**: Cleaner close control and direct zoom controls in image preview modal.

- [X] T008 [US1] Replace text close button with cross icon button in `src/components/image-modal/ImageModal.jsx`
- [X] T009 [US1] Add `zoom` state (default 100) and bounded increment/decrement handlers (10% step, 50–200%) in `src/components/image-modal/ImageModal.jsx`
- [X] T010 [US1] Add zoom-out and zoom-in icon buttons beside download action in `src/components/image-modal/ImageModal.jsx`
- [X] T011 [US1] Pass `zoom` prop from modal to preview panel in `src/components/image-modal/ImageModal.jsx`
- [X] T012 [US1] Update preview image to apply combined CSS transform string (center-anchored scale from zoom + rotation + flip) in `src/components/image-modal/ImagePreviewPanel.jsx`
- [X] T013 [US1] Keyboard accessibility labels/focus behavior for close and zoom icon controls in `src/components/image-modal/ImageModal.jsx`

**Checkpoint**: User Story 1 functional and independently testable.

---

## Phase 4: User Story 2 — Filter Sliders (Priority: P2)

**Goal**: Opacity, brightness, contrast, blur, and grayscale sliders in a two-column labeled grid inside EffectsPanel, with per-slider reset icons and live preview updates.

**Independent Test**: Open modal; adjust each slider across its full range; verify preview updates immediately and per-slider reset icons restore only that slider's default.

### Implementation for User Story 2

- [X] T014 [US2] Add `opacity` state and change handler in `src/components/image-modal/ImageModal.jsx`
- [X] T029 [US2] Add `brightness`, `contrast`, `blur`, `grayscale` state and change handlers in `src/components/image-modal/ImageModal.jsx`
- [X] T030 [US2] Implement two-column labeled slider grid in `EffectsPanel.jsx` with opacity and brightness sliders + per-slider reset icons in `src/components/image-modal/EffectsPanel.jsx`
- [X] T031 [US2] Add contrast and blur sliders with per-slider reset icons to the two-column grid in `src/components/image-modal/EffectsPanel.jsx`
- [X] T032 [US2] Add grayscale slider with per-slider reset icon to the two-column grid in `src/components/image-modal/EffectsPanel.jsx`
- [X] T016 [US2] Pass `opacity` prop from modal to preview panel in `src/components/image-modal/ImageModal.jsx`
- [X] T033 [US2] Pass `brightness`, `contrast`, `blur`, `grayscale` props from modal to preview panel in `src/components/image-modal/ImageModal.jsx`
- [X] T017 [US2] Update preview image to apply full CSS `filter` string (brightness, contrast, blur, grayscale, opacity) in real time in `src/components/image-modal/ImagePreviewPanel.jsx`
- [X] T018 [US2] Reset all effect state (zoom, opacity, brightness, contrast, blur, grayscale, rotation, flipH, flipV) to defaults on new modal session open in `src/components/image-modal/ImageModal.jsx`

**Checkpoint**: User Story 2 functional independently (filter sliders update live preview and reset cleanly).

---

## Phase 5: User Story 4 — Geometric Transforms: Rotate & Flip (Priority: P2)

**Goal**: Rotate and flip toggle buttons in the EffectsPanel button row; reset controls per-button and Reset All.

**Independent Test**: Click rotate clockwise 4 times and verify image cycles through 0°→90°→180°→270°→0°; toggle flip H twice and verify it returns to original; verify Reset All restores everything.

### Implementation for User Story 4

- [X] T034 [US4] Add `rotation` state (0/90/180/270) and `rotate90cw` handler in `src/components/image-modal/ImageModal.jsx`
- [X] T035 [US4] Add `flipH` and `flipV` toggle states and handlers in `src/components/image-modal/ImageModal.jsx`
- [X] T036 [US4] Implement button row in `EffectsPanel.jsx` with rotate clockwise, flip H, flip V buttons, per-button reset icons in `src/components/image-modal/EffectsPanel.jsx`
- [X] T037 [US4] Add "Reset All" button to button row that fires `onResetAll` callback in `src/components/image-modal/EffectsPanel.jsx`
- [X] T039 [US4] Pass `rotation`, `flipH`, `flipV` props from modal to preview panel in `src/components/image-modal/ImageModal.jsx`
- [X] T040 [US4] Apply combined CSS transform in preview image: rotate first (e.g. `rotate(90deg)`) then flip (`scaleX(-1)`/`scaleY(-1)`) in `src/components/image-modal/ImagePreviewPanel.jsx`
- [X] T041 [US4] Wire `onResetAll` and per-effect `onReset` callbacks in `ImageModal.jsx` and pass down to `EffectsPanel.jsx` in `src/components/image-modal/ImageModal.jsx`
- [X] T042 [US4] Ensure keyboard accessibility for all EffectsPanel controls: rotate/flip/reset buttons labeled, sliders have `aria-label`, active flip state conveyed via `aria-pressed` in `src/components/image-modal/EffectsPanel.jsx`

**Checkpoint**: User Story 4 functional — rotate, flip, reset all work independently.

---

## Phase 6: User Story 3 — Effects-Aware Download Output (Priority: P3)

**Goal**: Download original when all controls default; canvas PNG export capturing all 9 effects when any control changes.

**Independent Test**: Download at default controls → original file; adjust any effect → download → PNG with all effects applied.

### Implementation for User Story 3

- [X] T019 [US3] Update modal download handler to pass full 9-effect payload `{ zoom, opacity, brightness, contrast, blur, grayscale, rotation, flipH, flipV }` to download utility in `src/components/image-modal/ImageModal.jsx`
- [X] T020 [US3] Keep original-download (fetch) path when all controls are at defaults in `src/utils/download-image.js`
- [X] T021 [US3] Route transformed-download path through canvas render helper when any effect is non-default; output PNG at original image dimensions in `src/utils/download-image.js`
- [X] T022 [US3] Use `.png` extension and `{name}-effects.png` filename for effects-applied; keep original filename/extension for default-mode in `src/utils/download-image.js`
- [X] T023 [US3] Surface download failures through modal error text in `src/components/image-modal/ImageModal.jsx`

**Checkpoint**: All user stories independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final layout, mobile responsiveness, accessibility, and verification.

- [X] T024 [P] Verify EffectsPanel two-column grid layout has no overflow on mobile (≥375px) and desktop (≥1280px); adjust Tailwind classes as needed in `src/components/image-modal/EffectsPanel.jsx`
- [X] T025 [P] Final accessibility pass: verify all sliders have accessible labels and value readouts, icon-only buttons have `aria-label`, active flip state uses `aria-pressed` in `src/components/image-modal/EffectsPanel.jsx`
- [ ] T026 Run quickstart manual validation checklist and update verification notes in `specs/003-image-preview-controls/quickstart.md`
- [X] T027 Run build verification (`npm run build`) and resolve any regressions in `package.json` scripts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user stories.
- **Phase 3 (US1)**: Complete (depends Phase 2). T012 needs rework due to expanded transform string.
- **Phase 4 (US2)**: Depends on Phase 2; requires EffectsPanel scaffold from Phase 1 (T028).
- **Phase 5 (US4)**: Depends on Phase 2 and EffectsPanel from Phase 4.
- **Phase 6 (US3)**: Depends on Phase 2; requires full effects state from US1+US2+US4.
- **Phase 7 (Polish)**: Depends on all user story phases complete.

### Within Each Phase

- State and handlers before control wiring.
- Control wiring (EffectsPanel) before render integration (ImagePreviewPanel).
- Render integration before export integration (render-image-with-effects).

### Parallel Opportunities

- T003, T028: scaffold both files in parallel (Phase 1).
- T005, T038: canvas export update and isEffectsActive update run in parallel (Phase 2).
- T029 (new filter states) + T034/T035 (rotate/flip states): state additions in parallel if in separate branches.
- T030+T031+T032 (slider rows): each pair of sliders can be added incrementally to `EffectsPanel.jsx`.
- T024 + T025 (layout + a11y polish): run in parallel.

---

## Implementation Strategy

### MVP Scope (Phases 1–4)

1. Complete Phase 1 (constants + scaffolding).
2. Complete Phase 2 (canvas export + download detection).
3. Rework Phase 3 T012 (combined transform string).
4. Complete Phase 4 (filter sliders + EffectsPanel grid).

### Full Delivery Order

1. Phases 1–4 (filter sliders + layout).
2. Phase 5 (rotate + flip + Reset All).
3. Phase 6 (effects-aware download with all 9 effects).
4. Phase 7 (polish, a11y, build).

### Parallel Team Strategy

1. **Developer A** — modal state management (`ImageModal.jsx`): constants, all state, all handlers, download wiring.
2. **Developer B** — `EffectsPanel.jsx`: 2-col slider grid, button row, Reset All, per-effect reset icons.
3. **Developer C** — `ImagePreviewPanel.jsx` + utilities: CSS filter/transform rendering, `render-image-with-effects.js` canvas export.


## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare modal feature scaffolding and shared constants.

- [X] T001 Define preview transform defaults and limits constants (`ZOOM_DEFAULT = 100`, `ZOOM_MIN = 50`, `ZOOM_MAX = 200`, `ZOOM_STEP = 10`, `OPACITY_DEFAULT = 100`) in `src/components/image-modal/ImageModal.jsx`
- [X] T002 [P] Add icon button styling utilities for modal controls in `src/components/image-modal/ImageModal.jsx`
- [X] T003 [P] Add preview transform prop placeholders (`zoom`, `opacity`) in `src/components/image-modal/ImagePreviewPanel.jsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build shared transform/download foundations required by all user stories.

**CRITICAL**: No user story work should begin until this phase is complete.

- [X] T004 Implement `downloadImage(image, effects)` signature extension and default-mode detection in `src/utils/download-image.js`
- [X] T005 [P] Implement canvas-based effects export helper: draw source image center-anchored at original dimensions with zoom and opacity applied, output as PNG blob in `src/utils/render-image-with-effects.js`
- [X] T006 Wire `download-image` utility to route transformed downloads through `render-image-with-effects` when effects are non-default in `src/utils/download-image.js`
- [X] T007 Preserve existing return contract (`{ ok, message? }`) and normalize error messages for both download modes in `src/utils/download-image.js`

**Checkpoint**: Foundation ready. User story implementation can begin.

---

## Phase 3: User Story 1 - Improved Modal Controls (Priority: P1) 🎯 MVP

**Goal**: Provide cleaner close control and direct zoom controls in image preview modal.

**Independent Test**: Open modal, close via top-right cross icon, reopen and verify plus/minus controls update preview zoom within limits.

### Implementation for User Story 1

- [X] T008 [US1] Replace text close button with icon-style cross button and keep close behavior in `src/components/image-modal/ImageModal.jsx`
- [X] T009 [US1] Add local modal `zoom` state (default `100`) and bounded increment/decrement handlers using 10% step clamped to 50–200% range in `src/components/image-modal/ImageModal.jsx`
- [X] T010 [US1] Add zoom-out and zoom-in icon buttons beside download action in `src/components/image-modal/ImageModal.jsx`
- [X] T011 [US1] Pass `zoom` prop from modal to preview panel in `src/components/image-modal/ImageModal.jsx`
- [X] T012 [US1] Apply center-anchored CSS zoom transform (`transform-origin: center; transform: scale(zoom/100)`) to preview image rendering in `src/components/image-modal/ImagePreviewPanel.jsx`
- [X] T013 [US1] Ensure keyboard accessibility labels/focus behavior for close and zoom icon controls in `src/components/image-modal/ImageModal.jsx`

**Checkpoint**: User Story 1 is functional and independently testable.

---

## Phase 4: User Story 2 - Opacity Adjustment While Previewing (Priority: P2)

**Goal**: Let users adjust preview opacity in real time using a slider.

**Independent Test**: Open modal and move opacity slider across range to verify immediate preview transparency updates and stable boundary behavior.

### Implementation for User Story 2

- [X] T014 [US2] Add local modal `opacity` state and slider change handler in `src/components/image-modal/ImageModal.jsx`
- [X] T015 [US2] Add accessible opacity slider control and label in modal action area in `src/components/image-modal/ImageModal.jsx`
- [X] T016 [US2] Pass `opacity` prop from modal to preview panel in `src/components/image-modal/ImageModal.jsx`
- [X] T017 [US2] Apply opacity rendering style to preview image with live updates in `src/components/image-modal/ImagePreviewPanel.jsx`
- [X] T018 [US2] Reset zoom/opacity to defaults on new modal session lifecycle in `src/components/image-modal/ImageModal.jsx`

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Effects-Aware Download Output (Priority: P3)

**Goal**: Download original image when controls are default and transformed image when effects are applied.

**Independent Test**: Download at default controls to verify original output; adjust zoom/opacity, download again, and verify transformed output.

### Implementation for User Story 3

- [X] T019 [US3] Update modal download handler to pass `{ zoom, opacity }` effects payload to utility in `src/components/image-modal/ImageModal.jsx`
- [X] T020 [US3] Keep original-download path when controls are at defaults in `src/utils/download-image.js`
- [X] T021 [US3] Route transformed-download path through canvas render helper when effects are non-default; output canvas at original image dimensions, exported as PNG in `src/utils/download-image.js`
- [X] T022 [US3] Use `.png` extension and descriptive filename for effects-applied downloads; keep original filename/extension for default-mode downloads in `src/utils/download-image.js`
- [X] T023 [US3] Surface transformed-download failures through existing modal error text in `src/components/image-modal/ImageModal.jsx`

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality and verification across all stories.

- [X] T024 [P] Refine mobile/desktop control spacing and overflow behavior for modal action row in `src/components/image-modal/ImageModal.jsx`
- [X] T025 [P] Final accessibility pass for icon-only controls and slider semantics in `src/components/image-modal/ImageModal.jsx`
- [ ] T026 Run quickstart manual validation checklist and update verification notes in `specs/003-image-preview-controls/quickstart.md`
- [X] T027 Run build verification using scripts in `package.json` (`npm run build`) and resolve regressions in touched files

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2 completion.
- **Phase 4 (US2)**: Depends on Phase 2 completion and uses preview transform plumbing from US1.
- **Phase 5 (US3)**: Depends on Phase 2 completion and uses modal transform state from US1/US2.
- **Phase 6 (Polish)**: Depends on completion of desired user stories.

### User Story Dependencies

- **US1 (P1)**: Can start after foundational phase; no dependency on other stories.
- **US2 (P2)**: Can start after foundational phase; integrates with transform props introduced during US1 work.
- **US3 (P3)**: Can start after foundational phase; depends on available zoom/opacity state and transformed export utility.

### Within Each User Story

- State and handlers before control wiring.
- Control wiring before render integration.
- Render integration before edge-case/error refinement.

### Parallel Opportunities

- Setup tasks `T002` and `T003` can run in parallel.
- Foundational task `T005` can run in parallel with `T004` before `T006` integration.
- Polish tasks `T024` and `T025` can run in parallel.

---

## Parallel Example: User Story 1

```bash
Task T010: Add zoom icon buttons in src/components/image-modal/ImageModal.jsx
Task T012: Apply zoom transform rendering in src/components/image-modal/ImagePreviewPanel.jsx
```

## Parallel Example: User Story 2

```bash
Task T015: Add opacity slider control in src/components/image-modal/ImageModal.jsx
Task T017: Apply opacity rendering style in src/components/image-modal/ImagePreviewPanel.jsx
```

## Parallel Example: User Story 3

```bash
Task T022: Refine transformed output filename behavior in src/utils/download-image.js
Task T023: Ensure modal error messaging for transformed download failures in src/components/image-modal/ImageModal.jsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate close-icon and zoom controls in modal.
4. Demo/deploy MVP increment.

### Incremental Delivery

1. Ship US1 for control usability improvements.
2. Add US2 for opacity preview tuning.
3. Add US3 for effects-aware download fidelity.
4. Finish with cross-cutting polish and build verification.

### Parallel Team Strategy

1. Developer A: modal controls and accessibility (`ImageModal.jsx`).
2. Developer B: preview rendering updates (`ImagePreviewPanel.jsx`).
3. Developer C: download utility and canvas transform export (`download-image.js`, `render-image-with-effects.js`).
