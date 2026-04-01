# Data Model: Bulk Image Download with ZIP

**Feature**: 002-bulk-download-zip  
**Date**: 2026-03-31

---

## 1. Selection State

**Owner**: `SelectionContext` (React Context)

```js
// Shape of the context value
{
  // Set of image IDs currently selected by the user
  selectedIds: Set<string>,

  // Toggle one image in/out of the selection
  toggleSelect: (imageId: string) => void,

  // Select all images in a given list (replaces current selection)
  selectAll: (imageIds: string[]) => void,

  // Clear all selections
  clearAll: () => void,

  // Current ZIP job state machine
  zipJob: ZipJob,

  // Initiate ZIP download for the provided image objects
  downloadSelected: (images: ImageRecord[]) => Promise<void>,

  // Dismiss the error banner
  dismissError: () => void,
}
```

**Lifecycle**: Created by `<SelectionProvider>`. Cleared (reset to empty) whenever `location.pathname` changes away from and back to `/`.

---

## 2. ZipJob State Machine

**Purpose**: Tracks the status of the current ZIP assembly + download task. Drives the `<DownloadButton>` visual state and the `<ErrorBanner>`.

```js
// Discriminated union
type ZipJob =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'done' }
  | {
      status: 'error';
      failedCount: number;
      failedTitles: string[];
    }
```

**Transitions:**

```
idle ──[user clicks Download]──► loading
loading ──[all fetches settled + ZIP done]──► done (if 0 failures)
loading ──[all fetches settled + ZIP done, ≥1 failure]──► error
error ──[user dismisses banner]──► idle
done ──[any selection change]──► idle   (auto-reset after successful download)
```

**Note**: The `done` state exists briefly to trigger the blob download side-effect. The context immediately resets to `idle` after the download URL is triggered.

---

## 3. ImageSelectionCard View Model

**Description**: The data shape that `<ImageGrid>` assembles and passes to each `<ImageCard>` for the selection feature.

```js
// Props added to ImageCard for feature 002
{
  isSelected: boolean,
  onToggleSelect: (e: React.SyntheticEvent) => void,
}
```

The `onToggleSelect` handler calls `e.stopPropagation()` internally before delegating to `toggleSelect(imageId)` from context.

---

## 4. ImageRecord (existing, unchanged)

Defined in `src/data/images.js`. Feature 002 reads but does not mutate this structure.

```js
{
  id: string,          // unique identifier
  title: string,       // display name, used for ZIP filename
  imageUrl: string,    // source URL — must be CORS-accessible for fetch
  isPopular: boolean,
}
```

---

## 5. State Ownership Flow

```
AppRouter
└── SelectionProvider          ← owns selectedIds + zipJob
    └── AppLayout
        ├── <nav>
        │   └── DownloadButton ← reads selectedIds.size, zipJob.status
        │                        calls downloadSelected()
        ├── ErrorBanner        ← reads zipJob (shows if status==='error')
        │                        calls dismissError()
        └── <main>
            └── LandingPage    ← reads selectedIds (for Select All/Clear All)
                                 calls selectAll(), clearAll()
                └── ImageGrid  ← reads selectedIds, calls toggleSelect()
                    └── ImageCard (×N) ← receives isSelected, onToggleSelect
```

---

## 6. ZIP Utility Return Value

**Function**: `downloadZip(images: ImageRecord[]) → Promise<ZipResult>`

```js
type ZipResult = {
  ok: boolean,          // true if at least one image was fetched successfully
  failedCount: number,  // number of images that failed to fetch
  failedTitles: string[], // titles of images that failed
}
```

If `ok` is `false` (all fetches failed), no ZIP blob is created or downloaded.
