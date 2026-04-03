# UI Contract: Local Image Upload Effects

**Feature**: 005-local-image-upload-effects  
**Phase**: 1 - Design  
**Date**: 2026-04-03

## Component Contracts

### `AppLayout` Responsive Navbar

**Responsive contract**:
- At viewport widths `<=768px`, navbar renders a toggle control to expand/collapse nav links.
- At widths `>768px`, navbar remains visible without mobile toggle dependency.

**Behavior contract**:
1. Toggle button updates menu visibility state and exposed expanded/collapsed semantics.
2. Selecting any nav link while mobile menu is expanded auto-collapses the menu immediately.
3. Mobile menu interactions remain keyboard and touch operable.

### `LandingPage` Upload Entry

**Location contract**:
- `Upload Image` button is rendered directly below the title filter block (`Filter by title` input area).

**Behavior contract**:
1. Click opens native file picker constrained to images.
2. Selecting a valid image opens existing preview modal with uploaded image source.
3. Cancel selection leaves page state unchanged.
4. Invalid file selection shows a clear user-facing validation message.

### `ImageModal` Uploaded Mode

**Input contract**:
- Modal receives normalized `image` object with `isUploaded` discriminator.

**Behavior contract**:
1. Existing effects controls apply exactly the same as stock image mode.
2. Download action uses current effect snapshot and source image.
3. `Change Image` button appears beside Download only when `image.isUploaded === true`.
4. Clicking `Change Image` reopens image picker and swaps modal source on valid selection.
5. Canceling Change Image keeps current preview unchanged.

### `ImageModal` Responsive Mode

**Responsive contract**:
- At viewport widths `<=768px`, modal renders full-screen and allows internal scrolling for preview/effects/actions.
- At widths `>768px`, modal retains existing desktop dialog-style layout.

**Behavior contract**:
1. Mobile full-screen modal prevents background page scrolling while open.
2. Primary actions (Close, Download, Change Image when uploaded) remain reachable without horizontal overflow.
3. Orientation changes keep controls usable and visible.

### `downloadImage` Utility

**Behavior contract**:
1. If effects are active, export effects-applied PNG from current source URL.
2. If effects are default, download current source directly.
3. Works for remote stock URL and local uploaded object URL.

## Interaction Contracts

### Upload to Modal

1. User clicks `Upload Image`.
2. System opens picker.
3. User selects valid image.
4. System generates object URL and opens existing modal with uploaded image.

### Change Image in Modal

1. Uploaded image modal is active.
2. User clicks `Change Image` (next to Download).
3. System opens picker.
4. On valid file selection: modal updates to new image and revokes previous URL.
5. On cancel: no changes.

### Effects + Download

1. User modifies one or more effects.
2. User clicks Download.
3. System produces file matching current preview output.

## Accessibility Contract

- `Upload Image` and `Change Image` are keyboard-focusable buttons with clear text labels.
- Mobile navbar toggle is keyboard-focusable and exposes expanded/collapsed state.
- File-picker-trigger controls have visible focus styling consistent with existing controls.
- Validation errors are announced as user-visible inline messages in upload/modal context.

## Responsive Contract

- Upload control remains visible and usable on mobile and desktop.
- Navbar toggle + collapsible menu behavior applies at `<=768px`, with auto-close on link selection.
- Modal switches to full-screen mode at `<=768px`; desktop dialog behavior remains unchanged.
- Modal action row (Zoom controls, Download, Change Image) wraps gracefully on narrow viewports.
- No horizontal overflow introduced by new action placement.
