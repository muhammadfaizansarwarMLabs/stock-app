# Data Model: Bulk Image Download with ZIP

**Feature**: 002-bulk-download-zip  
**Date**: 2026-03-31

---

## Entities

### SelectionState

Represents the set of images currently checked by the user on the landing page. Lives entirely in memory — no persistence, resets on navigation away from `/`.

| Field | Type | Description |
|-------|------|-------------|
| `selectedIds` | `Set<string>` | Set of `image.id` strings that are currently checked |

**Derived values**:
- `selectedCount` = `selectedIds.size`
- `isSelected(id)` = `selectedIds.has(id)`
- `hasSelection` = `selectedIds.size > 0`

**Mutations**:
| Operation | Input | Effect |
|-----------|-------|--------|
| `toggleSelect(imageId)` | `string` | Adds `imageId` if absent; removes if present |
| `selectAll(imageIds)` | `string[]` | Adds all provided IDs to the set (union, preserves existing) |
| `clearAll()` | — | Replaces set with empty `Set` |
| `resetOnNavigation()` | — | Called when `location.pathname !== "/"` |

---

### ZipJob

Represents the state of an in-progress or completed ZIP packaging operation.

| Field | Type | Values | Description |
|-------|------|--------|-------------|
| `status` | `string` | `"idle" \| "loading" \| "done" \| "error"` | Current phase of the ZIP operation |
| `failedCount` | `number` | `0..n` | Number of images that could not be fetched |
| `failedTitles` | `string[]` | — | Human-readable titles of failed images (for error banner) |

**State machine**:
```
idle ──[triggerDownload()]──► loading
loading ──[all fetches settled, zip generated]──► done (failedCount = 0)
loading ──[all fetches settled, some failed]──► done (failedCount > 0) → shows error banner
loading ──[zip generation throws]──► error
done ──[dismissError() or new triggerDownload()]──► idle
error ──[dismissError()]──► idle
```

**Note**: `done` with `failedCount > 0` still triggers the ZIP download for the successful images — partial success is not treated as an error from the download perspective. The error banner is a secondary notification. `status` returns to `"idle"` automatically after the download is triggered so the button resets.

---

### ImageSelectionCard (derived view model)

The per-card view model passed from `ImageGrid` → `ImageCard`, extending the existing `image` prop:

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| `image` | `Image` | `images.js` | The image data record |
| `isFavorite` | `boolean` | `favoriteIds` set | Existing favorites prop |
| `isSelected` | `boolean` | `selectedIds` set (new) | Whether this card's checkbox is checked |
| `onToggleFavorite` | `function` | `AppRouter` | Existing callback |
| `onToggleSelect` | `function` | `SelectionContext` (new) | New callback for checkbox toggle |

---

## State Ownership & Flow

```
AppRouter
  └── SelectionProvider (wraps everything below)
        ├── AppLayout (reads SelectionContext → DownloadButton in nav)
        │     └── ErrorBanner (reads SelectionContext → failedCount, dismissError)
        └── LandingPage (reads SelectionContext → Select All / Clear All)
              └── ImageGrid (passes isSelected + onToggleSelect per card)
                    └── ImageCard (checkbox, stopPropagation)
```

---

## File Naming Convention (inside ZIP)

Each image in the ZIP archive is named:

```
{slugified-title}.jpg
```

Where `slugifiedTitle = image.title.replace(/\s+/g, "-").toLowerCase()`

The ZIP archive filename: `stock-gallery-{Date.now()}.zip`

This is consistent with the existing `download-image.js` slugify pattern.
