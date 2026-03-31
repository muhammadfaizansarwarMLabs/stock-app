# Research: Bulk Image Download with ZIP

**Feature**: 002-bulk-download-zip  
**Date**: 2026-03-31

---

## 1. Client-Side ZIP Creation with JSZip

**Decision**: Use JSZip v3.x for browser-side ZIP assembly.

**Rationale**: JSZip is the most widely-used, well-maintained library for client-side ZIP creation in the browser. It supports `Promise`-based APIs, handles binary blobs directly, and produces standards-compliant ZIP files without any server involvement. The `generateAsync({ type: "blob" })` method outputs a `Blob` that can be converted to an object URL for download — the same pattern already used in `download-image.js`.

**Alternatives considered**:
- `fflate` (faster, smaller, also popular) — valid alternative; rejected because JSZip has more complete documentation and the performance difference is irrelevant for ≤20-image batches.
- Native `CompressionStream` API — lacks ZIP container support natively (only deflate/gzip streams); would require manual ZIP format implementation.
- Server-side ZIP — rejected outright; violates Static-First constitution principle.

**Key API usage**:
```js
import JSZip from "jszip";
const zip = new JSZip();
zip.file("image-name.jpg", blobOrArrayBuffer);
const zipBlob = await zip.generateAsync({ type: "blob" });
```

---

## 2. Concurrent Image Fetching

**Decision**: Use `Promise.allSettled()` to fetch all selected images concurrently, tolerating individual failures.

**Rationale**: `Promise.all()` fails fast on the first rejection — unacceptable for bulk download where one bad image should not block others. `Promise.allSettled()` waits for all promises and returns a results array with `status: "fulfilled" | "rejected"` per item, allowing the ZIP to be built from successful fetches while collecting failures for the error banner.

**Pattern**:
```js
const results = await Promise.allSettled(
  selectedImages.map(img => fetch(img.downloadUrl).then(r => r.blob()))
);
const failed = results.filter(r => r.status === "rejected");
```

---

## 3. CORS Compatibility with picsum.photos

**Decision**: picsum.photos fully supports CORS — `fetch()` from any origin is allowed.

**Rationale**: picsum.photos is specifically designed for use in demos and development. Its CDN (Fastly/jsDelivr-backed) sends `Access-Control-Allow-Origin: *` headers. Confirmed via documented API behavior. No proxy or workaround needed.

**Risk**: None — if picsum.photos is unreachable (network error), the `Promise.allSettled` pattern handles it gracefully and the error banner notifies the user.

---

## 4. React State Architecture: Context vs Prop Drilling

**Decision**: Use React Context (`SelectionContext`) provided at the `AppRouter` level.

**Rationale**: Selection state must be readable by two independent subtrees:
1. `AppLayout` → navbar `DownloadButton` (count, disabled, loading, trigger download)
2. `LandingPage` → `ImageGrid` → `ImageCard` (checkbox state per image), plus Select All / Clear All controls

Prop drilling selection through `AppLayout` would require `AppLayout` to accept and pass through props it has no semantic ownership over, breaking the component's single-responsibility. Context is the established React pattern for cross-cutting UI state (the app already uses this approach conceptually for `favorites` at the `AppRouter` level).

**Context shape**:
```js
{
  selectedIds: Set<string>,
  toggleSelect: (imageId: string) => void,
  selectAll: (imageIds: string[]) => void,
  clearAll: () => void,
  downloadStatus: "idle" | "loading" | "done" | "error",
  failedCount: number,
  dismissError: () => void,
  triggerDownload: (images: Image[]) => Promise<void>
}
```

**Alternatives considered**:
- Zustand / Redux — overkill for a single feature's ephemeral state with no persistence.
- Prop drilling through AppLayout — breaks component responsibility boundaries.
- Lifting state to `App.jsx` — `AppRouter` is already the top-level state owner (for `favorites`); consistent to extend that pattern here.

---

## 5. Checkbox Inside `<Link>` — Click Isolation

**Decision**: Render checkbox as an absolutely-positioned `<button role="checkbox">` (or `<label><input type="checkbox">`) inside the card, calling `e.stopPropagation()` and `e.preventDefault()` on click to prevent the `<Link>` from navigating.

**Rationale**: The existing `ImageCard` is a `<Link>` wrapping the entire card, so any click on a child element would trigger navigation by default. `stopPropagation()` on the checkbox click prevents the event from bubbling to the Link. Using a native `<input type="checkbox">` inside a `<label>` is preferred for accessibility (inherits keyboard support and screen reader labeling for free).

**Tailwind visibility pattern**:
```jsx
// Always visible on mobile (< md), hover-to-show + stays on if selected on desktop (md+):
className={`absolute top-2 left-2 z-10 md:opacity-0 md:group-hover:opacity-100 transition-opacity
  ${isSelected ? "md:opacity-100" : ""}`}
```

---

## 6. ZIP File Naming

**Decision**: Slugify each image title (`title.replace(/\s+/g, "-").toLowerCase()`) and append `.jpg`. The same pattern already exists in `download-image.js`. ZIP archive filename: `stock-gallery-{timestamp}.zip`.

**Rationale**: Human-readable filenames inside the ZIP are far more useful than IDs like `1015.jpg`. Timestamp in archive name prevents repeated downloads from silently overwriting the same file.

---

## 7. Selection Reset on Navigation

**Decision**: Subscribe to React Router's `location.pathname` in `SelectionContext` (or in `LandingPage` via `useEffect`) and call `clearAll()` when the path changes away from `/`.

**Rationale**: Spec FR-012 requires selections to reset on navigation. The cleanest implementation is a `useEffect` in `SelectionContext` that watches `useLocation().pathname` and clears state on change away from `/`.

**Note**: `useLocation` requires the component to be inside the Router, which is true for `SelectionProvider` since it wraps the content inside `AppRouter` (which is inside `<BrowserRouter>`).
