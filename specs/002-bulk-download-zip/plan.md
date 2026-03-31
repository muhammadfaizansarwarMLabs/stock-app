# Implementation Plan: Bulk Image Download with ZIP

**Branch**: `002-bulk-download-zip` | **Date**: 2026-03-31 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/002-bulk-download-zip/spec.md`

## Summary

Add a multi-image bulk download feature to the landing page: each image card gets a checkbox (hover-to-show on desktop, always visible on mobile), a "Download Selected (N)" button appears in the navbar to the right of FAQ, and clicking it fetches all selected full-resolution images and packages them into a ZIP file using JSZip, triggering an automatic browser download. Selection state is shared via React Context so both the landing page (checkboxes, Select All / Clear All) and the navbar (button + count) can access it without prop-drilling through the entire tree.

## Technical Context

**Language/Version**: JavaScript (ES2022) / React 18.3  
**Primary Dependencies**: React Router v6.30, Tailwind CSS v3.4, Vite 5.4, JSZip 3.x (new addition)  
**Storage**: None — selection state is in-memory only; no persistence required  
**Testing**: Vitest 2.x + React Testing Library  
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge); static file hosting  
**Project Type**: Static SPA (single-page application)  
**Performance Goals**: ZIP preparation for ≤20 images must complete without UI freeze; fetch operations run concurrently via `Promise.all`  
**Constraints**: No backend; all ZIP assembly must run client-side; CORS must be supported by picsum.photos (it is); selection state must reset on route navigation away from `/`  
**Scale/Scope**: ~109 images in dataset; selection of up to all images must not crash the browser

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Static-First Delivery | ✅ PASS | JSZip runs entirely in-browser; no server needed |
| II. Browsing and Filtering | ✅ PASS | Filtering behavior unchanged; Select All respects active filter |
| III. Image Viewing and Download | ✅ PASS | Existing single-image download preserved; bulk download adds to it |
| IV. Favorites Management | ✅ PASS | Favorites state and UI unaffected |
| V. Basic Usability and Accessibility | ✅ PASS | Checkboxes must have `aria-label`; button must have `aria-disabled` when empty; keyboard-accessible |
| Scope Gate: Modal open must not break | ✅ PASS | Checkbox click will call `stopPropagation()` to prevent Link navigation |

**Post-design re-check**: No violations introduced. Complexity Tracking table not required.

## Project Structure

### Documentation (this feature)

```text
specs/002-bulk-download-zip/
├── plan.md             ← this file
├── research.md         ← Phase 0 output
├── data-model.md       ← Phase 1 output
├── quickstart.md       ← Phase 1 output
├── contracts/
│   └── ui-contract.md  ← Phase 1 output
└── tasks.md            ← Phase 2 output (/speckit.tasks — NOT created by /speckit.plan)
```

### Source Code Changes

```text
src/
├── app/
│   └── router.jsx                          MODIFY — wrap tree with SelectionProvider; reset selection on route change
├── components/
│   ├── image-grid/
│   │   ├── ImageCard.jsx                   MODIFY — add checkbox overlay (stopPropagation, selection state)
│   │   └── ImageGrid.jsx                   MODIFY — pass isSelected + onToggleSelect to each ImageCard
│   ├── layout/
│   │   ├── AppLayout.jsx                   MODIFY — add DownloadButton to nav; add ErrorBanner slot below header
│   │   └── ErrorBanner.jsx                 NEW — dismissible inline error alert
│   └── bulk-download/
│       └── DownloadButton.jsx              NEW — navbar button showing count badge + loading state
├── pages/
│   └── landing/
│       └── LandingPage.jsx                 MODIFY — add Select All / Clear All toolbar; wire selection context
├── state/
│   └── selection-context.jsx               NEW — SelectionContext, SelectionProvider, useSelection hook
└── utils/
    └── download-zip.js                     NEW — fetch all images concurrently + JSZip packaging + blob download

package.json                                MODIFY — add jszip dependency
```

**Structure Decision**: Single-project SPA. All new code lives in `src/` alongside existing modules. New `bulk-download/` component folder keeps the navbar button isolated. New `selection-context.jsx` follows the existing `favorites-store.js` pattern for shared state.

## Complexity Tracking

> No constitution violations — table not required.
