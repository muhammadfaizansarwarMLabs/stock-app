# Research: Local Image Upload Effects

**Feature**: 005-local-image-upload-effects  
**Phase**: 0 - Research & Unknowns Resolution  
**Date**: 2026-04-03

## 1. Upload Placement and UX Entry Point

**Decision**: Place a dedicated `Upload Image` button directly beneath the existing `Filter by title` control block on the landing page.

**Rationale**: The requirement explicitly anchors placement below title filtering. This location is discoverable, contextually related to image browsing actions, and avoids disrupting existing bulk-select controls.

**Alternatives considered**:
- Add upload action inside the navbar: rejected because requirement calls for placement below filter input.
- Add upload action inside modal only: rejected because modal must open *from* uploaded selection.

## 2. Modal Reuse Strategy for Uploaded Images

**Decision**: Reuse the existing `ImageModal` component and pass a normalized image object that can represent either stock image sources or uploaded image sources.

**Rationale**: The modal already implements zoom/effects controls and download handling. Reusing it preserves behavior consistency and minimizes implementation risk.

**Alternatives considered**:
- Create a second modal specifically for uploads: rejected due to duplicated effects UI and inconsistent behavior risk.
- Replace route modal with in-place inline panel: rejected because current app already standardizes on modal preview UX.

## 3. Uploaded File Lifecycle

**Decision**: Use browser object URLs (`URL.createObjectURL(file)`) for uploaded image preview/download source, and revoke prior object URLs when image is replaced or modal/upload session is cleared.

**Rationale**: Object URLs are the standard browser-native approach for local file preview without backend uploads. Explicit revoke prevents memory leaks in repeated change-image workflows.

**Alternatives considered**:
- Convert to base64 Data URL via `FileReader`: rejected due to larger memory overhead and unnecessary conversion.
- Persist upload in localStorage/IndexedDB: rejected as out of scope and not required by spec.

## 4. Download Behavior for Uploaded Sources

**Decision**: Keep existing download policy: if effects are active, render/export effects-applied PNG; if no effects are active, download the current image source directly. For uploaded images, direct source is the local object URL.

**Rationale**: This aligns uploaded behavior with existing stock-image modal expectations and ensures "what user sees" parity when effects are applied.

**Alternatives considered**:
- Always export PNG for uploaded images: rejected because it changes unchanged-download behavior and increases processing unnecessarily.
- Always re-fetch uploaded file blob before download: rejected because local object URL is already a valid source.

## 5. Change Image Action Visibility and Behavior

**Decision**: Show `Change Image` only when current modal source is uploaded, position it beside Download in the modal action row, and keep current image unchanged if file selection is canceled.

**Rationale**: This matches explicit requirement wording and keeps stock-image modal controls clean.

**Alternatives considered**:
- Show Change Image for all modal images: rejected because requirement limits it to uploaded image context.
- Close modal before changing file: rejected due to extra friction and broken editing continuity.

## 6. Input Validation and Error Handling

**Decision**: Validate selected files using MIME type (`image/*`) and guard against empty/canceled selections. Display a clear user-facing validation message for unsupported files.

**Rationale**: Prevents invalid modal states and satisfies FR-010/FR-009 expectations.

**Alternatives considered**:
- Validate only by file extension: rejected as less reliable than MIME checks.
- Silently ignore invalid files: rejected because spec requires clear user feedback.

## 7. Mobile Navbar Behavior

**Decision**: Add a dedicated mobile navbar toggle for viewport widths `<=768px` to show/hide nav links, with menu state auto-collapsing immediately after any navigation link selection.

**Rationale**: The clarified spec requires explicit mobile toggle behavior and predictable state reset on route navigation.

**Alternatives considered**:
- Keep navbar always expanded on mobile: rejected due to limited space and overlap risk.
- Keep menu open after navigation: rejected per clarification and weaker UX continuity.

## 8. Mobile Modal Presentation

**Decision**: Use a full-screen modal overlay on mobile (`<=768px`) with internal scrolling for preview/effects/actions and lock background page scroll while open.

**Rationale**: Full-screen mode avoids clipped controls on small screens and ensures primary actions remain reachable.

**Alternatives considered**:
- Keep desktop-style centered dialog on mobile: rejected due to cramped controls and overflow risk.
- Bottom-sheet modal: rejected as unnecessary UX divergence from current flow.

## 9. Accessibility and Responsive Guardrails

**Decision**: Preserve semantic button controls for `Upload Image`, `Change Image`, and navbar toggle (`aria-expanded`, touch/keyboard operable), and enforce no horizontal overflow in header/modal mobile states.

**Rationale**: Constitution principle V mandates keyboard-accessible controls and usable desktop/mobile behavior.

**Alternatives considered**:
- Icon-only unlabeled controls: rejected due to lower discoverability and accessibility risk.
- Rely only on visual collapse without accessible state: rejected due to assistive tech ambiguity.

## Summary of Decisions

| Topic | Decision |
|------|----------|
| Upload location | Below title filter input |
| Modal strategy | Reuse existing `ImageModal` with normalized source object |
| File preview source | `URL.createObjectURL(file)` with explicit revoke lifecycle |
| Download behavior | Existing effects-aware logic retained for uploaded sources |
| Change image visibility | Only when uploaded image is active; shown beside Download |
| Validation | MIME-based `image/*` checks with user-facing invalid file message |
| Mobile navbar | Toggle/collapse behavior at `<=768px`; auto-close on link selection |
| Mobile modal | Full-screen overlay at `<=768px` with internal scroll + background scroll lock |
| Accessibility | Labeled buttons, keyboard support, responsive layout retained |
