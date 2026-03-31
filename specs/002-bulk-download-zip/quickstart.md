# Quickstart: Bulk Image Download with ZIP

**Feature**: 002-bulk-download-zip  
**Date**: 2026-03-31

---

## What This Feature Adds

- A **checkbox** on every image card on the landing page (hover-to-show on desktop; always visible on mobile)
- A **"Download Selected (N)"** button in the navbar (to the right of FAQ)
- A **selected image count** badge inside the button, updating in real time
- **Select All** / **Clear All** controls above the image grid
- Clicking the button fetches all checked images at full resolution and packages them into a single **ZIP file** downloaded directly in the browser — no server needed

---

## New Dependency

```bash
npm install jszip
```

JSZip is the only new runtime dependency. It runs entirely in-browser.

---

## New Files

| File | Purpose |
|------|---------|
| `src/state/selection-context.jsx` | React Context + Provider + `useSelection()` hook for shared selection + ZIP job state |
| `src/utils/download-zip.js` | Fetches images concurrently, packages into ZIP, triggers download |
| `src/components/bulk-download/DownloadButton.jsx` | Navbar button: shows count, disabled/loading states |
| `src/components/layout/ErrorBanner.jsx` | Dismissible inline alert for partial-failure notifications |

---

## Modified Files

| File | Change Summary |
|------|----------------|
| `src/app/router.jsx` | Wrap tree with `<SelectionProvider>` |
| `src/components/layout/AppLayout.jsx` | Add `<DownloadButton>` to nav; add `<ErrorBanner>` below header |
| `src/components/image-grid/ImageCard.jsx` | Add checkbox overlay with `stopPropagation`; accept `isSelected` + `onToggleSelect` props |
| `src/components/image-grid/ImageGrid.jsx` | Read `SelectionContext`; pass `isSelected` + `onToggleSelect` to each `ImageCard` |
| `src/pages/landing/LandingPage.jsx` | Add Select All / Clear All toolbar; pass `filteredImages` to `selectAll` |

---

## How It Works

### Selection State Flow

```
SelectionProvider (wraps AppRouter tree)
├── AppLayout → reads context → renders DownloadButton + ErrorBanner
└── LandingPage → reads context → Select All / Clear All
      └── ImageGrid → reads context → passes props to ImageCard
            └── ImageCard → renders checkbox, calls toggleSelect on click
```

### ZIP Download Flow

1. User selects images via checkboxes
2. User clicks "Download Selected (N)" in navbar
3. `triggerDownload(selectedImages)` is called from `SelectionContext`
4. `download-zip.js` fetches all `downloadUrl`s concurrently via `Promise.allSettled()`
5. Successfully fetched blobs are added to a JSZip archive
6. `zip.generateAsync({ type: "blob" })` produces a single ZIP blob
7. Blob URL is created → `<a download>` click triggers browser download
8. If any images failed to fetch → `ErrorBanner` displays count + titles

---

## Running the Dev Server

```bash
npm install       # installs jszip + all existing deps
npm run dev       # starts Vite dev server at http://localhost:5173
```

---

## Verification Checklist

- [ ] Checkbox appears on hover (desktop) and always (mobile) on landing page image cards
- [ ] Clicking checkbox does NOT open the image modal
- [ ] Selected cards show an indigo ring around the border
- [ ] "Download Selected" button in navbar shows count badge when images are selected
- [ ] Button is visually disabled and non-interactive when 0 images are selected
- [ ] Clicking "Select All" selects only visible (filtered) images, not hidden ones
- [ ] Clicking "Clear All" unchecks all images instantly
- [ ] Download triggers a `.zip` file download with correctly named image files inside
- [ ] Selections persist when scrolling or filtering — cleared only on navigation away from `/`
- [ ] Nav to Favorites/About/FAQ then back to Discover clears all selections
- [ ] If a fetch fails for any image, ErrorBanner appears below the navbar with failure details
- [ ] ErrorBanner can be dismissed via the × button
