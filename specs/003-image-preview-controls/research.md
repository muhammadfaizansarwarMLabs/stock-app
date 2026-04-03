# Research Notes: Image Preview Controls and Effects-Aware Download

**Feature**: 003-image-preview-controls  
**Date**: 2026-04-01  
**Status**: Complete

---

## 1. Close Control Design

### Decision: Replace text close button with an icon-only button using an "X" glyph

**Rationale**: The request explicitly requires a cross icon. Keeping it as a native `<button>` with an accessible label preserves keyboard support and discoverability while reducing visual noise.

**Alternatives considered:**

- Text-only "Close" button: rejected because it does not match requested UX.
- Icon without accessible label: rejected for accessibility reasons.

---

## 2. Zoom State Model

### Decision: Step-based zoom with bounded min/max values in local modal state

**Rationale**: Plus/minus buttons map naturally to deterministic zoom increments. Boundaries prevent broken preview rendering and keep controls predictable.

**Proposed defaults:**

- Default zoom: `1.0`
- Step: `0.1`
- Min: `0.5`
- Max: `2.0`

**Alternatives considered:**

- Freeform numeric input: rejected as over-complex for this modal flow.
- Pinch/gesture-only zoom: rejected because explicit button controls are required.

---

## 3. Opacity Control

### Decision: Range slider with normalized values from 0.1 to 1.0

**Rationale**: Sliders are the most direct control for continuous opacity. A near-zero lower bound avoids rendering confusion that can occur with fully invisible preview at exactly `0`.

**Alternatives considered:**

- Preset opacity chips (25%, 50%, 75%, 100%): rejected because it is less precise.
- Text input percent: rejected for poorer interaction speed.

---

## 4. Effects-Aware Download Strategy

### Decision: Use client-side canvas rendering only when transforms differ from defaults

**Rationale**: Requirement needs original output when unchanged and transformed output when changed. Conditional logic keeps original-path behavior unchanged and only incurs canvas work when necessary.

**Flow:**

1. If `zoom===1` and `opacity===1`, call existing original download behavior.
2. Otherwise, render image to a canvas with applied zoom/opacity and export as blob for download.

**Alternatives considered:**

- Always render through canvas: rejected to avoid unnecessary processing and potential quality changes in default case.
- Server-side image processing: rejected due to static-first constraint.

---

## 5. Canvas Rendering Pattern

### Decision: Draw image centered in canvas, apply global alpha for opacity, and scale via transform around center

**Rationale**: This keeps output aligned with visual preview expectations and avoids clipping from top-left-only scaling.

**Alternatives considered:**

- CSS-only effects and screenshot APIs: rejected as brittle and browser-dependent.
- SVG pipeline: rejected as unnecessary complexity for raster source images.

---

## 6. Error Handling

### Decision: Reuse modal error message channel for both original and transformed download failures

**Rationale**: Existing UI already has an error text area tied to download attempts. Extending that path keeps behavior consistent and avoids additional alert components.

**Alternatives considered:**

- Separate error surfaces for each download mode: rejected as redundant and potentially confusing.
