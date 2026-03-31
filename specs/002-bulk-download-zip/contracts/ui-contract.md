# UI Contract: Bulk Image Download with ZIP

**Feature**: 002-bulk-download-zip  
**Date**: 2026-03-31

This document defines the component interface contracts (props, context shape, utility signatures) for the new and modified components in this feature.

---

## SelectionContext

**Location**: `src/state/selection-context.jsx`

### Context Value Shape

```ts
{
  // Selection state
  selectedIds: Set<string>
  toggleSelect: (imageId: string) => void
  selectAll: (imageIds: string[]) => void
  clearAll: () => void

  // ZIP job state
  downloadStatus: "idle" | "loading" | "done" | "error"
  failedCount: number
  failedTitles: string[]
  triggerDownload: (images: Image[]) => Promise<void>
  dismissError: () => void
}
```

### `useSelection()` Hook

```ts
// Throws if called outside SelectionProvider
function useSelection(): SelectionContextValue
```

---

## `<SelectionProvider>` Component

**Location**: `src/state/selection-context.jsx`

```ts
Props: {
  children: ReactNode
}
```

Wraps the application subtree and provides `SelectionContext`. Automatically clears `selectedIds` when `location.pathname` changes away from `"/"`.

---

## `<DownloadButton>` Component

**Location**: `src/components/bulk-download/DownloadButton.jsx`  
**Used in**: `AppLayout` navbar

```ts
Props: none  // reads from SelectionContext via useSelection()
```

**Rendered states**:

| Condition | Button text | Button state |
|-----------|-------------|--------------|
| `selectedIds.size === 0` | `Download Selected` | `disabled`, muted appearance |
| `downloadStatus === "loading"` | `Downloading…` (with spinner) | `disabled`, loading appearance |
| `selectedIds.size > 0` (idle) | `Download Selected (N)` | enabled, primary style |

**Accessibility**:
- `aria-label="Download N selected images as ZIP"`
- `aria-disabled="true"` when 0 selected or loading
- `aria-busy="true"` when loading

---

## `<ErrorBanner>` Component

**Location**: `src/components/layout/ErrorBanner.jsx`  
**Used in**: `AppLayout` below the `<header>`

```ts
Props: none  // reads from SelectionContext via useSelection()
```

**Renders**: A dismissible amber/red alert when `failedCount > 0` after a download.  
**Hidden**: When `failedCount === 0` or after dismiss.

Content: `"{N} image(s) could not be included in the download: {title1}, {title2}…"` + dismiss `×` button.

**Accessibility**:
- `role="alert"` for screen reader announcement
- Dismiss button: `aria-label="Dismiss error"`

---

## Modified `<AppLayout>` Component

**Location**: `src/components/layout/AppLayout.jsx`

```ts
Props: {
  children: ReactNode  // unchanged
}
```

**Changes**: Reads `SelectionContext` internally (via `useSelection()`). Renders `<DownloadButton>` at the end of the `<nav>` (after FAQ link). Renders `<ErrorBanner>` between `<header>` and `<main>`.

---

## Modified `<ImageCard>` Component

**Location**: `src/components/image-grid/ImageCard.jsx`

```ts
Props: {
  image: Image            // unchanged
  isFavorite: boolean     // unchanged
  onToggleFavorite: () => void  // unchanged
  isSelected: boolean     // NEW — drives checkbox checked state and selected border
  onToggleSelect: () => void    // NEW — called when checkbox toggles
}
```

**Checkbox visibility**:
- Mobile (`< md`): always visible (`opacity-100`)
- Desktop (`≥ md`): hidden (`opacity-0`), shown on `group-hover` or when `isSelected === true`

**Selected visual state**:
- Card gets a colored ring when `isSelected`: `ring-2 ring-indigo-500`

---

## Modified `<ImageGrid>` Component

**Location**: `src/components/image-grid/ImageGrid.jsx`

```ts
Props: {
  images: Image[]
  favoriteIds: Set<string>
  onToggleFavorite: (imageId: string) => void
  emptyTitle: string
  emptyMessage: string
  // selectedIds and onToggleSelect sourced from SelectionContext internally
}
```

**Change**: Reads `selectedIds` and `toggleSelect` from `SelectionContext` directly. Passes `isSelected` and `onToggleSelect` to each `ImageCard`.

---

## Modified `<LandingPage>` Component

**Location**: `src/pages/landing/LandingPage.jsx`

```ts
Props: {
  favoriteIds: Set<string>      // unchanged
  onToggleFavorite: () => void  // unchanged
}
```

**New UI elements added**:
- "Select All" button: calls `selectAll(filteredImages.map(i => i.id))`
- "Clear All" button: calls `clearAll()`
- Both are rendered in a toolbar row between the hero card and the image grid

---

## `download-zip.js` Utility

**Location**: `src/utils/download-zip.js`

```ts
type ZipResult = {
  ok: boolean
  failedCount: number
  failedTitles: string[]
}

async function downloadZip(images: Image[]): Promise<ZipResult>
```

**Behavior**:
1. Fetches all `image.downloadUrl` concurrently via `Promise.allSettled()`
2. Adds successfully fetched blobs to a JSZip instance as `{slugifiedTitle}.jpg`
3. Calls `zip.generateAsync({ type: "blob" })`
4. Creates a temporary object URL and triggers download via `<a>` click
5. Revokes the object URL after click
6. Returns `{ ok: true/false, failedCount, failedTitles }`

ZIP archive filename: `stock-gallery-{Date.now()}.zip`
