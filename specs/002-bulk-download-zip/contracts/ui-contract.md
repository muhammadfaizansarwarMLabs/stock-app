# UI Contract: Bulk Image Download with ZIP

**Feature**: 002-bulk-download-zip  
**Date**: 2026-03-31

---

## 1. SelectionContext

**File**: `src/state/selection-context.jsx`

### Context Shape

```js
const SelectionContext = createContext({
  selectedIds: new Set(),
  toggleSelect: (id) => {},
  selectAll: (ids) => {},
  clearAll: () => {},
  zipJob: { status: 'idle' },
  downloadSelected: async (images) => {},
  dismissError: () => {},
});
```

### `useSelection()` Hook

```js
// Usage (any component inside <SelectionProvider>)
const {
  selectedIds,
  toggleSelect,
  selectAll,
  clearAll,
  zipJob,
  downloadSelected,
  dismissError,
} = useSelection();
```

Throws if used outside `<SelectionProvider>`.

### `<SelectionProvider>` Component

```jsx
// Props
<SelectionProvider>
  {children}
</SelectionProvider>
```

- Manages `selectedIds` (Set<string>) and `zipJob` state
- Subscribes to `location.pathname` via `useLocation()`; clears selections on pathname change
- Must be placed inside a `<Router>` so `useLocation()` is available

---

## 2. `downloadZip` Utility

**File**: `src/utils/download-zip.js`

```js
/**
 * Fetches each image by URL, bundles them into a ZIP, and triggers a download.
 * Uses Promise.allSettled so partial failures don't block the successful images.
 *
 * @param {Array<{id: string, title: string, imageUrl: string}>} images
 * @returns {Promise<{ ok: boolean, failedCount: number, failedTitles: string[] }>}
 */
export async function downloadZip(images) { ... }
```

- ZIP filename format: `stock-images-YYYYMMDD-HHMMSS.zip`
- Individual file names inside ZIP: `image.title.replace(/\s+/g, '-').toLowerCase() + '.jpg'`
- If all fetches fail, returns `{ ok: false, failedCount: N, failedTitles: [...] }` and does not trigger a download

---

## 3. `<DownloadButton>` Component

**File**: `src/components/bulk-download/DownloadButton.jsx`

```jsx
// No external props — reads SelectionContext internally
<DownloadButton />
```

### Visual States

| State | Condition | Label | Appearance |
|-------|-----------|-------|------------|
| Disabled | `selectedIds.size === 0` | "Download Selected" | Grey, `cursor-not-allowed`, `opacity-50` |
| Active | `selectedIds.size >= 1` | "Download Selected (N)" | Brand color, hover effect |
| Loading | `zipJob.status === 'loading'` | "Preparing…" | Spinner icon, not clickable |

### Behavior

- On click (when active): calls `downloadSelected(selectedImages)` where `selectedImages` is resolved by the component from context + image data
- Does not accept external props; all state from `useSelection()`
- Placed inside `<AppLayout>`'s navbar, after the FAQ `<Link>`

---

## 4. `<ErrorBanner>` Component

**File**: `src/components/layout/ErrorBanner.jsx`

```jsx
// No external props — reads SelectionContext internally
<ErrorBanner />
```

### Props and Behavior

- Renders nothing when `zipJob.status !== 'error'`
- When `zipJob.status === 'error'`, renders a dismissible alert:
  - `role="alert"` for accessibility
  - Shows count of failed images and their titles
  - × / Close button calls `dismissError()`
  - Positioned: full-width banner below the `<header>` in `<AppLayout>`
  - Color: amber/yellow warning tone (Tailwind `bg-amber-100 text-amber-800 border-amber-300`)

---

## 5. Modified: `<AppLayout>`

**File**: `src/components/layout/AppLayout.jsx`

### Changes

```jsx
// Before (simplified)
<header>
  <nav>
    <Link to="/">Discover</Link>
    <Link to="/favorites">Favorites</Link>
    <Link to="/about">About</Link>
    <Link to="/faq">FAQ</Link>
  </nav>
</header>
<main>{children}</main>

// After
<header>
  <nav>
    <Link to="/">Discover</Link>
    <Link to="/favorites">Favorites</Link>
    <Link to="/about">About</Link>
    <Link to="/faq">FAQ</Link>
    <DownloadButton />           {/* ← NEW: after FAQ */}
  </nav>
</header>
<ErrorBanner />                  {/* ← NEW: between header and main */}
<main>{children}</main>
```

No prop changes to `<AppLayout>` itself.

---

## 6. Modified: `<ImageCard>`

**File**: `src/components/image-grid/ImageCard.jsx`

### New Props

```jsx
// Added props
isSelected: boolean        // whether this card is currently checked
onToggleSelect: function   // called when user taps/clicks the checkbox
```

### Behavior Changes

- Adds an absolutely-positioned `<input type="checkbox">` in the top-left corner
- Checkbox `aria-label`: `"Select {image.title}"`
- On checkbox click: `e.stopPropagation()` then `onToggleSelect(e)`
- When `isSelected === true`: card gets `ring-2 ring-indigo-500 ring-offset-1` class
- Checkbox visibility: `opacity-0 group-hover:opacity-100` on desktop; always visible on mobile via `sm:opacity-100`
- The card's `<Link>` navigation behavior is fully preserved for clicks outside the checkbox area

---

## 7. Modified: `<ImageGrid>`

**File**: `src/components/image-grid/ImageGrid.jsx`

### Changes

- Calls `useSelection()` to read `selectedIds` and `toggleSelect`
- Passes `isSelected` and `onToggleSelect` to each `<ImageCard>`

```jsx
// Before
<ImageCard key={img.id} image={img} />

// After
<ImageCard
  key={img.id}
  image={img}
  isSelected={selectedIds.has(img.id)}
  onToggleSelect={(e) => { e.stopPropagation(); toggleSelect(img.id); }}
/>
```

No external API changes to `<ImageGrid>` itself (existing usage in `LandingPage` unchanged).

---

## 8. Modified: `<LandingPage>`

**File**: `src/pages/landing/LandingPage.jsx`

### Changes

- Calls `useSelection()` to read `selectedIds`, `selectAll`, `clearAll`
- Adds a toolbar row between the hero/search area and the `<ImageGrid>`:

```jsx
// New toolbar (shown only when images are displayed)
<div className="flex items-center gap-3 mb-4">
  <button onClick={() => selectAll(visibleImages.map(i => i.id))}>
    Select All ({visibleImages.length})
  </button>
  <button
    onClick={clearAll}
    disabled={selectedIds.size === 0}
  >
    Clear All
  </button>
</div>
```

- "Select All" operates on `visibleImages` (the currently filtered list), not the full dataset
- "Clear All" is disabled when nothing is selected

---

## 9. Modified: `src/app/router.jsx`

### Changes

- Wraps the component tree with `<SelectionProvider>`:

```jsx
// Before
<Router>
  <AppLayout>...</AppLayout>
</Router>

// After
<Router>
  <SelectionProvider>
    <AppLayout>...</AppLayout>
  </SelectionProvider>
</Router>
```

`<SelectionProvider>` must be inside `<Router>` to use `useLocation()` for pathname-based selection reset.
