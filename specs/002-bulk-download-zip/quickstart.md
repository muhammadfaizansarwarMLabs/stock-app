# Quickstart: Bulk Image Download with ZIP

**Feature**: 002-bulk-download-zip  
**Date**: 2026-03-31

---

## 1. New Dependency

```bash
npm install jszip
```

JSZip 3.x is the only new dependency. It provides client-side ZIP file generation in the browser.

---

## 2. New Files to Create

| File | Purpose |
|------|---------|
| `src/state/selection-context.jsx` | React Context + Provider + `useSelection()` hook for shared selection and ZIP job state |
| `src/utils/download-zip.js` | Fetches selected images with `Promise.allSettled()`, assembles ZIP via JSZip, triggers blob download |
| `src/components/bulk-download/DownloadButton.jsx` | Navbar button showing count, triggers download, shows loading state |
| `src/components/layout/ErrorBanner.jsx` | Dismissible inline alert for partial/full fetch failures |

---

## 3. Files to Modify

| File | Change Summary |
|------|---------------|
| `src/app/router.jsx` | Wrap app tree with `<SelectionProvider>` (inside `<Router>`) |
| `src/components/layout/AppLayout.jsx` | Add `<DownloadButton>` after FAQ nav link; add `<ErrorBanner>` between `<header>` and `<main>` |
| `src/components/image-grid/ImageCard.jsx` | Add absolutely-positioned checkbox overlay; `isSelected` ring style; accept `isSelected` + `onToggleSelect` props |
| `src/components/image-grid/ImageGrid.jsx` | Read `useSelection()`, pass `isSelected` + `onToggleSelect` to each `ImageCard` |
| `src/pages/landing/LandingPage.jsx` | Add Select All / Clear All toolbar above `<ImageGrid>` |

---

## 4. How It Works

```
User checks image checkboxes
        │
        ▼
SelectionContext.toggleSelect(id)
  └─ Updates selectedIds Set
  
User clicks "Download Selected (N)" button
        │
        ▼
SelectionContext.downloadSelected(selectedImages)
  └─ Sets zipJob = { status: 'loading' }
  └─ Calls downloadZip(images)
        │
        ├─ fetch(imageUrl) × N  [Promise.allSettled]
        ├─ Add successful ArrayBuffers to JSZip
        ├─ zip.generateAsync({ type: 'blob' })
        └─ Trigger blob download as stock-images-YYYYMMDD-HHMMSS.zip
        │
        ▼
  If partial/full failures → sets zipJob = { status: 'error', failedTitles }
  If all success → sets zipJob = { status: 'idle' }

User navigates away and back
        │
        ▼
SelectionContext clears selectedIds (pathname change detected via useLocation)
```

---

## 5. Key Implementation Notes

- `<SelectionProvider>` **must** be inside `<Router>` so `useLocation()` is available for pathname-based reset.
- The checkbox in `<ImageCard>` must call `e.stopPropagation()` to prevent the surrounding `<Link>` from navigating.
- `<DownloadButton>` resolves the actual image objects from context + the images list — it cannot use `selectedIds` alone (needs `imageUrl` for fetch).
- ZIP filenames for individual images use the slug pattern: `title.replace(/\s+/g, '-').toLowerCase() + '.jpg'` (consistent with existing single-image download).
- The error banner appears even when some images succeed — the ZIP is still downloaded for successful ones, and the banner lists only the failures.

---

## 6. Verification Checklist

After implementation, manually verify:

- [ ] Checkboxes appear on hover on desktop, always on mobile
- [ ] Checking an image shows a visual ring highlight around the card
- [ ] The count in "Download Selected (N)" updates in real time
- [ ] "Download Selected" is disabled and visually greyed out when no images are selected
- [ ] "Download Selected" shows a loading spinner/label during ZIP generation
- [ ] A ZIP file is downloaded with the correct images inside
- [ ] Individual filenames in the ZIP match the image titles (slugified)
- [ ] "Select All" selects only the currently filtered/visible images
- [ ] "Clear All" deselects all images and is disabled when nothing is selected
- [ ] Navigating to Favorites and back clears all selections
- [ ] Filtering (title search) does not clear selections
- [ ] Selections are preserved after a successful download
- [ ] If a fetch fails, the error banner appears below the navbar listing failed image titles
- [ ] The error banner can be dismissed with the × button
- [ ] The existing single-image modal download still works
- [ ] The existing favorites flow is unaffected
- [ ] Build passes: `npm run build`
