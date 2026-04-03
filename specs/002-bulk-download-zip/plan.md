# Implementation Plan: Bulk Image Download with ZIP

**Branch**: `002-bulk-download-zip` | **Date**: 2026-03-31 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/002-bulk-download-zip/spec.md`

## Summary

Extend the stock image landing page with multi-select checkboxes on image cards, a shared selection state accessible across the page and navbar, and a client-side ZIP download action that fetches selected images and bundles them into a single archive for the user. The "Download Selected" button lives in the navbar (right of FAQ), shows a live count of checked images, and uses a client-side ZIP library. Failed fetches surface as a dismissible inline alert below the navbar.

## Technical Context

**Language/Version**: JavaScript (ES2022+) with React 18  
**Primary Dependencies**: React, React Router v6, Tailwind CSS, JSZip 3.x (new dependency)  
**Storage**: In-memory React Context (resets on navigation); no persistence needed for selections  
**Testing**: Vitest + React Testing Library  
**Target Platform**: Modern desktop and mobile browsers (static SPA)  
**Project Type**: Feature extension to existing static single-page application  
**Performance Goals**: ZIP assembly for up to 50 selected images completes within a reasonable user-perceived wait; partial failures do not block the download of successful images  
**Constraints**: No backend; all ZIP assembly is client-side; CORS on image source must permit fetch; selections reset on page navigation; checkboxes visible on hover (desktop) / always (mobile)  
**Scale/Scope**: Extends existing landing page; 4 new source files + 5 modified files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Pre-Phase-0 evaluation against `constitution.md`:

- **Static-First Delivery**: PASS. ZIP assembly is entirely client-side using a browser-compatible library. No backend is added or required.
- **Browsing and Filtering**: PASS. Checkboxes and selection state do not interfere with the existing title filter or grid layout.
- **Image Viewing and Download**: PASS. The existing single-image modal download is preserved. This feature adds bulk download alongside it.
- **Favorites Management**: PASS. The favorites flow is untouched. SelectionContext is independent of favorites state.
- **Basic Usability and Accessibility**: PASS. Checkboxes have aria-labels. The download button is keyboard-accessible. The error banner uses `role="alert"`. Mobile always shows checkboxes.

Post-Phase-1 design re-check:

- PASS. `research.md`, `data-model.md`, `contracts/ui-contract.md`, and `quickstart.md` preserve all constitutional requirements with no violations.

## Project Structure

### Documentation (this feature)

```text
specs/002-bulk-download-zip/
├── plan.md              ← this file
├── research.md
├── data-model.md
├── quickstart.md
├── checklists/
│   └── requirements.md
├── contracts/
│   └── ui-contract.md
└── tasks.md             (created by /speckit.tasks)
```

### Source Code (repository root)

**New files:**

```text
src/
├── state/
│   └── selection-context.jsx       ← Context, Provider, useSelection() hook
├── utils/
│   └── download-zip.js             ← ZIP assembly + blob download utility
└── components/
    ├── bulk-download/
    │   └── DownloadButton.jsx      ← Navbar ZIP trigger, shows count
    └── layout/
        └── ErrorBanner.jsx         ← Dismissible inline alert
```

**Modified files:**

```text
src/
├── app/
│   └── router.jsx                  ← wrap tree with <SelectionProvider>
├── components/
│   ├── layout/
│   │   └── AppLayout.jsx           ← add <DownloadButton>, <ErrorBanner>
│   └── image-grid/
│       ├── ImageCard.jsx           ← add checkbox overlay, selected ring
│       └── ImageGrid.jsx           ← read context, pass props to cards
└── pages/
    └── landing/
        └── LandingPage.jsx         ← Select All / Clear All toolbar
```

## Complexity Tracking

No constitution violations identified; complexity tracking table not required.
