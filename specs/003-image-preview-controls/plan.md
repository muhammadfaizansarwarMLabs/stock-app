# Implementation Plan: Image Preview Controls and Effects-Aware Download

**Branch**: `003-image-preview-controls` | **Date**: 2026-04-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-image-preview-controls/spec.md`

## Summary

Enhance the existing image preview modal with clearer controls, a comprehensive effects panel, and effects-aware downloads. Specific changes: replace the text close button with a top-right cross icon; add zoom-in/zoom-out icon buttons (10% step, 50%–200% range, center-anchored); add a grouped effects panel below the image preview containing a two-column labeled slider grid (opacity, brightness 0–200%, contrast 0–200%, blur 0–10px, grayscale 0–100%) plus a button row (rotate clockwise in 90° steps, flip horizontal toggle, flip vertical toggle, Reset All button); per-effect reset icons beside every control; and effects-aware download — original file when all controls are default, client-side canvas PNG export at original dimensions when any effect is active. CSS filters are applied first; transforms (rotate first, then flip) are applied second in both live preview and canvas export.

## Technical Context

**Language/Version**: JavaScript (ES2022+) with React 18  
**Primary Dependencies**: React, React Router v6, Tailwind CSS (no mandatory new package expected)  
**Storage**: N/A (session-only modal state in React component state)  
**Testing**: Vitest + React Testing Library; manual verification for visual effects/download output  
**Target Platform**: Modern desktop and mobile browsers (static SPA)  
**Project Type**: Frontend feature extension to existing React single-page application  
**Performance Goals**: Zoom/opacity/filter/transform preview updates stay visually smooth during interaction (CSS `filter` + `transform` applied inline, no canvas required for preview); effects-applied canvas PNG export for a single image completes within a user-acceptable wait  
**Constraints**: No backend; image processing must run client-side; zoom step is 10% per click, range 50%–200%, center-anchored; brightness/contrast 0–200% (default 100%), blur 0–10px (default 0), grayscale 0–100% (default 0%); rotation in 90° clockwise steps (0/90/180/270); flip H and flip V are independent toggles; transform composition order: rotate first then flip, matching CSS transform order; effects-applied export always outputs PNG at original image dimensions; original format preserved only when all controls are at defaults; keyboard accessibility required for all controls; preserve existing modal open/close and favorites behavior  
**Scale/Scope**: Changes localized to modal components and download utilities (2 modified files + 1 required new utility); new `EffectsPanel` sub-component extracted from `ImageModal.jsx` for organisation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Pre-Phase-0 evaluation against `constitution.md`:

- **Static-First Delivery**: PASS. Effects rendering/download are client-side only and require no server.
- **Browsing and Filtering**: PASS. Homepage browsing/filter flows are unchanged.
- **Image Viewing and Download**: PASS. Modal remains central; this feature improves controls and extends download behavior.
- **Favorites Management**: PASS. Favorites flows are untouched.
- **Basic Usability and Accessibility**: PASS with planned controls. All new controls (close, zoom, sliders, rotate, flip, reset) are keyboard-accessible and labeled; effects panel layout uses two-column grid with clear labels and per-effect reset icons.

Post-Phase-1 design re-check:

- PASS. `research.md`, `data-model.md`, `contracts/ui-contract.md`, and `quickstart.md` preserve all constitutional requirements and avoid scope regressions.

## Project Structure

### Documentation (this feature)

```text
specs/003-image-preview-controls/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-contract.md
└── tasks.md             (created by /speckit.tasks)
```

### Source Code (repository root)

**Likely modified files:**

```text
src/
├── components/
│   └── image-modal/
│       ├── ImageModal.jsx           ← modal shell: cross icon close, zoom controls, download handler, effects state
│       └── ImagePreviewPanel.jsx    ← consume all transform/filter props for live preview rendering
└── utils/
    └── download-image.js            ← effects-active detection extended to all 9 controls; routes to canvas export
```

**New files (required):**

```text
src/
├── components/
│   └── image-modal/
│       └── EffectsPanel.jsx         ← self-contained effects panel: 2-col slider grid + button row (rotate/flip/Reset All) + per-effect reset icons
└── utils/
    └── render-image-with-effects.js ← canvas export: CSS filters applied first (brightness, contrast, blur, grayscale, opacity), then rotate+flip transforms (rotate first, flip second), PNG output at original dimensions
```

## Complexity Tracking

No constitution violations identified; complexity tracking table not required.
