# Data Model: Image Preview Controls and Effects-Aware Download

**Feature**: 003-image-preview-controls  
**Date**: 2026-04-01

---

## 1. PreviewTransformState

**Owner**: `ImageModal` local component state

```js
{
  zoom: number,        // current zoom multiplier
  opacity: number,     // current alpha value
  defaults: {
    zoom: number,      // 1.0
    opacity: number    // 1.0
  },
  limits: {
    minZoom: number,   // 0.5
    maxZoom: number,   // 2.0
    zoomStep: number   // 0.1
  }
}
```

**Lifecycle**:

- Initialized when modal mounts.
- Updated by plus/minus buttons and slider.
- Reset on modal close/unmount.

---

## 2. PreviewDownloadMode

Derived entity used at download click time.

```js
"original" | "effects-applied"
```

**Decision rule:**

- `original` when `zoom === defaults.zoom` and `opacity === defaults.opacity`
- `effects-applied` otherwise

---

## 3. DownloadRequest

Transient payload passed to download utility.

```js
{
  image: {
    id: string,
    title: string,
    downloadUrl: string,
    fullImageUrl: string,
    altText: string
  },
  transform: {
    zoom: number,
    opacity: number
  }
}
```

---

## 4. DownloadResult (existing extended shape)

```js
{
  ok: boolean,
  message?: string
}
```

Used by `ImageModal` to show success/failure state after attempted download.

---

## 5. UI Control View Model

Data used for rendering and enabling/disabling modal controls.

```js
{
  canZoomIn: boolean,
  canZoomOut: boolean,
  zoomLabel: string,     // e.g., "110%"
  opacityLabel: string   // e.g., "80%"
}
```

Derived from `PreviewTransformState` on each render.
