# UI Contract: Image Preview Controls and Effects-Aware Download

**Feature**: 003-image-preview-controls  
**Date**: 2026-04-01

---

## 1. `ImageModal` Public Behavior

**File**: `src/components/image-modal/ImageModal.jsx`

### Existing prop

```jsx
<ImageModal image={image} />
```

No prop shape changes are required for this feature.

### Internal state additions

```js
const [zoom, setZoom] = useState(1);
const [opacity, setOpacity] = useState(1);
```

### New controls in action area

- `Close` icon button (top-right) with `aria-label="Close image modal"`
- `Zoom out` icon button (minus)
- `Zoom in` icon button (plus)
- `Opacity` slider (`input[type="range"]`)
- `Download` button (existing control, extended behavior)

### Download behavior contract

```js
if (zoom === 1 && opacity === 1) {
  // Original path
  downloadImage(image)
} else {
  // Effects-applied path
  downloadImage(image, { zoom, opacity })
}
```

Error text in modal must be shown for failures in both paths.

---

## 2. `ImagePreviewPanel` Render Contract

**File**: `src/components/image-modal/ImagePreviewPanel.jsx`

### Updated props

```jsx
<ImagePreviewPanel
  image={image}
  zoom={zoom}
  opacity={opacity}
/>
```

### Rendering rules

- `zoom` controls visual image scale.
- `opacity` controls visual alpha.
- Both effects update immediately as state changes.

---

## 3. `downloadImage` Utility Contract

**File**: `src/utils/download-image.js`

### Updated function signature

```js
/**
 * @param {Object} image
 * @param {{ zoom?: number, opacity?: number }} [effects]
 * @returns {Promise<{ ok: boolean, message?: string }>}
 */
export async function downloadImage(image, effects)
```

### Rules

- With no effects or default effects, download original image as before.
- With non-default effects, generate transformed output client-side and download that output.
- Preserve return shape for existing call sites.

---

## 4. Accessibility Contract

- Close/zoom controls must be keyboard operable (`button` elements).
- Icon-only controls must include explicit `aria-label` text.
- Slider must have an associated visible label and/or accessible name.
- Error message remains text visible in modal action region.
