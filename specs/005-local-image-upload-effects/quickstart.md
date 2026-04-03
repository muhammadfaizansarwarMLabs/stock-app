# Quickstart: Local Image Upload Effects

**Feature**: 005-local-image-upload-effects  
**Branch**: `005-local-image-upload-effects`  
**Date**: 2026-04-03

## Prerequisites

- Node.js 18+
- Dependencies installed: `npm install`
- On branch `005-local-image-upload-effects`

## Run the App

```bash
npm run dev
```

Open `http://localhost:5173`.

## Manual Validation Checklist

### US1 - Upload and Open in Modal

- [ ] On landing page, confirm `Upload Image` button is visible below `Filter by title`.
- [ ] Click `Upload Image` and select a valid image (`.jpg`, `.png`, `.webp` etc.) from device.
- [ ] Confirm existing preview modal opens with selected uploaded image.
- [ ] Cancel file picker and verify no modal opens and UI remains unchanged.

### US2 - Apply Effects to Uploaded Image

- [ ] With uploaded image open in modal, adjust at least one effect (zoom/opacity/brightness/contrast/blur/grayscale/rotate/flip).
- [ ] Confirm preview updates immediately.
- [ ] Use reset controls and verify preview returns to original uploaded image appearance.

### US3 - Download and Change Image

- [ ] With uploaded image in modal and effects active, click `Download`.
- [ ] Verify downloaded file visually matches modal preview.
- [ ] Confirm `Change Image` button is visible beside `Download` while uploaded image is active.
- [ ] Click `Change Image`, choose another valid image, and verify modal swaps to new image.
- [ ] Click `Change Image` and cancel picker; verify currently shown uploaded image remains unchanged.

### Error and Edge Validation

- [ ] Try selecting non-image file; verify clear validation message and no modal replacement.
- [ ] Click `Change Image`, select a non-image file, and verify current preview remains unchanged.
- [ ] Change image multiple times; confirm no stale/previous image flashes and interactions remain stable.
- [ ] Re-select the same image file and verify replacement still works.
- [ ] Attempt upload flow on mobile viewport (375 px) and desktop viewport (1280 px); verify controls remain usable and layout does not overflow.

### Regression Checks

- [ ] Stock image modal open via image card still works.
- [ ] Stock image modal does not show `Change Image`.
- [ ] Existing title filter, favorites, and download flows remain functional.

## Build Verification

```bash
npm run build
```

Expected: successful Vite build with no errors.

## Verification Notes

- Build command: `npm run build` on 2026-04-03 -> success (`68 modules transformed`, built in `2.94s`).
- Full manual regression across all quickstart checklist items is still pending.
