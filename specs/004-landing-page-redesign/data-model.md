# Data Model: Landing Page Card Redesign

**Feature**: 004-landing-page-redesign  
**Phase**: 1 — Design  
**Date**: 2026-04-02

---

## Entities

### ImageCard (UI Component State)

Represents the local runtime state held per card on the landing page grid.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `image` | `object` (from `images.js`) | — | The image data record (id, title, thumbnailUrl, downloadUrl, altText, tags) |
| `isFavorite` | `boolean` | `false` | Derived from the global favorites store; passed as prop |
| `isSelected` | `boolean` | `false` | Bulk-select state from SelectionContext; passed as prop |
| `downloadBusy` | `boolean` | `false` | Local: true while a direct card download is in progress |
| `downloadError` | `string` | `""` | Local: non-empty string when a download failed; auto-clears after 3 s |

**No new persistent entities are introduced.** The favorites store, image data, and selection state are all existing — this feature only adds local transient UI state (`downloadBusy`, `downloadError`) to the card component.

---

### FavoriteToggle (UI Component)

| Field | Type | Description |
|-------|------|-------------|
| `isFavorite` | `boolean` (prop) | Current favorite state for this image |
| `onToggle` | `function` (prop) | Callback to flip favorite state; caller-owned |

**Change**: Rendered output only. The prop interface is **unchanged**. The button text (`"Add Favorite"` / `"Favorited"`) is replaced with SVG heart icons. All behavior (stopPropagation, aria-label) is preserved.

---

### ImageGrid (UI Component)

| Field | Type | Description |
|-------|------|-------------|
| `images` | `array` | Filtered list of image records to display |
| `favoriteIds` | `Set<string>` | IDs of all favorited images |
| `onToggleFavorite` | `function` | Callback to toggle a single image's favorite state |

**Change**: Grid Tailwind class updated to add `sm:grid-cols-3` breakpoint. No prop or data changes.

---

## State Transitions

### Card Download State Machine

```
IDLE
  │ user clicks download icon
  ▼
BUSY (downloadBusy=true, downloadError="")
  │ download succeeds              │ download fails
  ▼                                ▼
IDLE (downloadBusy=false)     ERROR (downloadBusy=false, downloadError="<msg>")
                                   │ 3 seconds elapse (auto-dismiss)
                                   ▼
                              IDLE (downloadError="")
```

### Heart Toggle State Machine

```
UNFAVORITED (isFavorite=false) ──click──► FAVORITED (isFavorite=true)
FAVORITED   (isFavorite=true)  ──click──► UNFAVORITED (isFavorite=false)
```

State is owned by the parent (`LandingPage` → `AppRouter`) and persisted by the existing favorites store. No change to this logic.

---

## Validation Rules

- `downloadBusy` blocks a second download click on the same card (enforced in handler).
- `downloadError` is always a short display string (≤ 40 characters) or empty.
- Heart state is idempotent: toggling already-favorited returns same result (handled by existing `toggleFavorite` store function).
