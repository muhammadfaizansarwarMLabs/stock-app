# Quickstart: Image Preview Controls and Effects-Aware Download

**Feature**: 003-image-preview-controls  
**Date**: 2026-04-01

---

## 1. Scope

This feature updates the single-image preview modal with:

- Top-right cross icon close control
- Zoom in/out icon buttons beside Download
- Opacity slider for live preview
- Conditional download output:
  - original image when controls are default
  - effects-applied image when zoom/opacity changed

---

## 2. Files to Modify

- `src/components/image-modal/ImageModal.jsx`
- `src/components/image-modal/ImagePreviewPanel.jsx`
- `src/utils/download-image.js`

Optional helper (if separation is preferred):

- `src/utils/render-image-with-effects.js`

---

## 3. Implementation Flow

1. Replace text "Close" button with icon close button while retaining existing close behavior.
2. Add `zoom` and `opacity` modal state with min/max boundaries.
3. Add plus/minus icon buttons that adjust `zoom` by fixed step.
4. Add opacity range input and bind it to preview state.
5. Pass `zoom` and `opacity` to `ImagePreviewPanel` and apply visual transform styles.
6. Update download handler:
   - default state -> use original download path
   - modified state -> use transformed export path via canvas and download blob
7. Keep existing error display path for all failures.

---

## 4. Manual Validation Checklist

- [ ] Open image modal and confirm top-right icon close control is visible.
- [ ] Close icon closes modal via mouse and keyboard.
- [ ] Plus icon increases zoom and preview visibly scales up.
- [ ] Minus icon decreases zoom and preview visibly scales down.
- [ ] Zoom cannot exceed configured max or go below configured min.
- [ ] Opacity slider changes preview transparency in real time.
- [ ] Slider works at boundary values without visual glitches.
- [ ] Download without any effect changes returns original output.
- [ ] Download after changing zoom/opacity returns modified output.
- [ ] Reset controls to defaults then download returns original output again.
- [ ] Download errors show user-visible message in modal.
- [ ] Existing favorites and gallery flows remain unaffected.

---

## 5. Build Verification

Run:

```bash
npm run build
```

Optionally run tests:

```bash
npm test
```
