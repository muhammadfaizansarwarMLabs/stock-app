# UI Contract: Landing Page Card Redesign

**Feature**: 004-landing-page-redesign  
**Phase**: 1 — Design  
**Date**: 2026-04-02

---

## Component Contracts

### `FavoriteToggle` — updated rendering contract

**File**: `src/components/favorites/FavoriteToggle.jsx`

**Props contract (unchanged)**:
```ts
{
  isFavorite: boolean;   // true = favorited, false = not favorited
  onToggle: () => void;  // called on click (stopPropagation applied internally)
}
```

**Rendered output contract**:
- When `isFavorite = false`: renders an icon-only `<button>` with an **outline red heart SVG** and `aria-label="Add to favorites"`.
- When `isFavorite = true`: renders an icon-only `<button>` with a **filled solid red heart SVG** and `aria-label="Remove from favorites"`.
- The button MUST call `event.preventDefault()` and `event.stopPropagation()` on click to prevent card navigation.
- Icon color: `text-red-500` in both states. Hover: `hover:text-red-600`.
- Icon size: `size-5` (20 × 20 px).

---

### `ImageCard` — updated + direct download added

**File**: `src/components/image-grid/ImageCard.jsx`

**Props contract (unchanged)**:
```ts
{
  image: ImageObject;             // { id, title, thumbnailUrl, downloadUrl, altText, tags }
  isFavorite: boolean;
  onToggleFavorite: (id) => void;
  isSelected?: boolean;           // default false
  onToggleSelect?: () => void;    // default no-op
}
```

**New local state**:
- `downloadBusy: boolean` — blocks second download; shows spinner on download icon.
- `downloadError: string` — shown as inline overlay text; auto-clears after 3 s.

**Rendered output contract**:

1. **Card structure** (unchanged wrappers):
   - `<article>` with `relative group card-surface overflow-hidden` — unchanged.
   - `<Link>` covering card — unchanged (`z-10`).
   - Selection checkbox top-left — unchanged (`z-20`).

2. **Image** (unchanged `h-48 w-full object-cover`).

3. **NEW: Bottom overlay bar** — `absolute bottom-0 inset-x-0 z-20 flex items-center justify-between px-3 py-2 bg-black/40`:
   - Left side: **Download button** — icon-only, `aria-label="Download {image.title}"`.
     - Normal state: ArrowDownTray Heroicons 20/solid SVG, `text-white size-5`.
     - Busy state: spinner (`animate-spin rounded-full border-2 border-white border-t-transparent size-5`).
     - `disabled` when `downloadBusy = true`.
   - Right side: **`<FavoriteToggle>`** (with heart icon after this update).
   - When `downloadError` is non-empty: a `<p role="alert">` appears centered/below in the bar with `text-xs text-red-300`.

4. **Below image card body** (unchanged): title, tags.

---

### `ImageGrid` — updated grid class

**File**: `src/components/image-grid/ImageGrid.jsx`

**Change only**:
```diff
-<section className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
+<section className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
```

All other props, rendering, and behavior are identical.

---

## Interaction Contracts

### Heart icon click
1. `event.preventDefault()` — prevents `<Link>` from navigating.
2. `event.stopPropagation()` — prevents event bubbling to card.
3. `onToggle()` is called — favorites state updates globally.

### Download icon click
1. `event.preventDefault()` + `event.stopPropagation()` — same as above.
2. If `downloadBusy` is `true`, return early (no-op).
3. Set `downloadBusy = true`, `downloadError = ""`.
4. Await `downloadImage(image, null)` (default effects = no effects).
5. Set `downloadBusy = false`.
6. If `result.ok === false`: set `downloadError = result.message ?? "Download failed."`.
7. Error auto-clears via `useEffect` watching `downloadError` after 3000 ms.

---

## Visual Specifications

| Element | Tailwind classes | Notes |
|---------|-----------------|-------|
| Bottom overlay bar | `absolute bottom-0 inset-x-0 z-20 flex items-center justify-between px-3 py-2 bg-black/40` | Semi-transparent dark bar |
| Heart icon (unfavorited) | `size-5 text-red-400 hover:text-red-500` | Outline SVG |
| Heart icon (favorited) | `size-5 text-red-500` | Solid SVG |
| Download icon (normal) | `size-5 text-white hover:text-slate-200` | ArrowDownTray solid |
| Download icon (busy) | `size-5 animate-spin rounded-full border-2 border-white border-t-transparent` | Spinner replaces icon |
| Error text | `text-xs text-red-300` | Role=alert, auto-dismiss 3 s |
| Grid section | `grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` | Fills horizontal space |
