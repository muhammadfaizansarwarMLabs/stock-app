# Implementation Plan: Local Image Upload Effects

**Branch**: `005-local-image-upload-effects` | **Date**: 2026-04-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-local-image-upload-effects/spec.md`

## Summary

Add a local-device upload entry point below the landing page title filter, open selected images in the existing image preview modal, reuse existing effect controls for uploaded content, download the effected uploaded image, and show a contextual "Change Image" action beside Download when the modal is displaying uploaded content.

The implementation reuses the current modal + effects pipeline with a source abstraction for stock vs uploaded image, adds upload/change-image state in the router/modal flow, and preserves all existing stock-image behavior and URL-based modal navigation.

## Technical Context

**Language/Version**: JavaScript (ES2022), JSX via React 18  
**Primary Dependencies**: React 18, React Router v6, Vite 5.4, existing in-repo image utilities (`download-image`, `render-image-with-effects`)  
**Storage**: In-memory React state for uploaded image session + browser object URLs (revoked on replacement/close); existing `localStorage` usage unchanged  
**Testing**: Vitest + React Testing Library (targeted unit/integration), plus manual verification via `quickstart.md`  
**Target Platform**: Modern desktop and mobile browsers (static SPA)  
**Project Type**: Frontend web application (single React SPA)  
**Performance Goals**: Modal open after file selection feels immediate (<2s for typical images), preview updates remain responsive, no regressions to existing stock-image modal interactions  
**Constraints**: No backend, no new npm packages, preserve constitution-required flows, maintain accessibility labels and keyboard interactions for new controls  
**Scale/Scope**: Focused UI enhancement touching landing filter area, routing/modal handoff, modal action row, and download source handling (approximately 6-10 files)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Static-First Delivery | PASS | Local file upload handled client-side only; no server dependency added |
| II. Browsing and Filtering | PASS | Existing title filter behavior is preserved; upload control is additive beneath filter |
| III. Image Viewing and Download | PASS | Existing modal remains the viewing surface; download action is extended for uploaded source |
| IV. Favorites Management | PASS | Favorites flows are unchanged for stock images |
| V. Basic Usability and Accessibility | PASS | New buttons require labels, keyboard access, and mobile/desktop support |

Initial gate result: PASS.

## Project Structure

### Documentation (this feature)

```text
specs/005-local-image-upload-effects/
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
├── pages/
│   └── landing/
│       └── LandingPage.jsx                # Add upload action placement below title filter
├── components/
│   ├── filters/
│   │   └── TitleFilter.jsx                # Existing anchor point for placement context
│   └── image-modal/
│       ├── ImageModal.jsx                 # Add uploaded-image mode + Change Image button
│       ├── ImagePreviewPanel.jsx          # Ensure preview supports uploaded source URLs
│       └── EffectsPanel.jsx               # Reused unchanged unless labeling tweaks required
├── app/
│   └── router.jsx                         # Modal source wiring for stock vs uploaded image session
└── utils/
    ├── download-image.js                  # Support downloaded source from uploaded object URL
    └── render-image-with-effects.js       # Reused for effects-applied export

tests/
├── unit/
│   └── [new/updated modal and upload state tests]
├── integration/
│   └── [new landing->modal upload flow tests]
└── contract/
    └── [optional UI contract assertions]
```

**Structure Decision**: Use the existing single-project React SPA structure. Changes remain localized to landing controls, router-modal state, modal actions, and download utility behavior without introducing new top-level modules.

## Phase 0: Research

Research outcomes captured in `research.md` resolve all planning unknowns:

1. Uploaded image handoff strategy from landing page to modal while preserving existing route/modal behavior.
2. Safe browser object URL lifecycle management for upload and change-image operations.
3. Download path decision for uploaded images with effects vs unchanged source.
4. Validation behavior for unsupported file types and canceled picker flows.
5. Accessibility and responsive requirements for new upload/change actions.

All `NEEDS CLARIFICATION` items: NONE.

## Phase 1: Design and Contracts

Artifacts produced:

1. `data-model.md` defines entities for uploaded image source, modal source context, and action visibility state.
2. `contracts/ui-contract.md` defines UI interaction contracts for upload button placement, modal open/change behavior, and download outcomes.
3. `quickstart.md` defines run + manual verification flow for upload, effects, download, and change-image scenarios.

Agent context update:

1. Run `.specify/scripts/bash/update-agent-context.sh copilot` after writing design artifacts.

## Post-Design Constitution Check

Re-check result after Phase 1 design: PASS.

1. Static-first requirement remains intact (local browser APIs only).
2. Core browse/filter, modal, and favorites flows remain preserved.
3. New controls stay additive and accessible.
4. No constitution violations or scope contractions identified.

## Phase 2: Task Planning Preview

Implementation sequencing preview:

1. Add upload trigger below the title filter area on landing page.
2. Add local file validation and object URL generation for selected files.
3. Wire uploaded image session into modal opening flow while preserving stock route behavior.
4. Extend modal action row to show "Change Image" beside Download only for uploaded source.
5. Update download utility to support uploaded source download with effects-applied rendering parity.
6. Implement cancellation and invalid-file safeguards.
7. Add/adjust tests for upload open, effected download, and change-image replacement.
8. Run build/tests and complete quickstart regression checks.

## Complexity Tracking

No constitution violations or special complexity exemptions required.
