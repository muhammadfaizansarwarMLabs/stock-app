# Research Notes: Bulk Image Download with ZIP

**Feature**: 002-bulk-download-zip  
**Date**: 2026-03-31  
**Status**: Complete

---

## 1. Client-Side ZIP Assembly

### Decision: JSZip 3.x

**Rationale**: JSZip is the de-facto standard for client-side ZIP generation in browsers. It requires no backend, works with ArrayBuffer/Blob inputs, and generates a complete ZIP blob that triggers a browser download via a temporary object URL.

**Key API surface used:**

```js
import JSZip from 'jszip';

const zip = new JSZip();
zip.file('image-name.jpg', arrayBuffer);
const blob = await zip.generateAsync({ type: 'blob' });
```

**Alternatives considered:**

| Library | Verdict | Reason rejected |
|---------|---------|-----------------|
| `fflate` | Viable | Less familiar, similar API surface — JSZip preferred for ecosystem familiarity |
| `zip.js` | Viable | More complex streaming API than needed |
| Native `CompressionStream` | Too low-level | No ZIP support in current browsers |

---

## 2. Concurrent Image Fetching

### Decision: `Promise.allSettled()`

**Rationale**: `Promise.all()` would reject immediately if any single image fetch fails, preventing a partial ZIP. `Promise.allSettled()` lets all fetches run to completion, giving us both successes (for the ZIP) and failures (for the error banner), without blocking the overall download.

**Pattern:**

```js
const results = await Promise.allSettled(
  images.map(img => fetch(img.imageUrl).then(r => r.arrayBuffer()))
);
const failed = results.filter(r => r.status === 'rejected');
const ok = results.filter(r => r.status === 'fulfilled');
```

**Failure tolerance**: If all fetches fail, no ZIP is created and the error banner lists all failed image titles.

---

## 3. CORS Compatibility

**picsum.photos** (the mock image source) sends permissive CORS headers (`Access-Control-Allow-Origin: *`). Fetching picsum URLs from a browser JS context is safe without a proxy.

**Important**: If the app is ever migrated to a real image CDN, CORS headers must be verified before the ZIP download feature will work in production.

---

## 4. React Context vs. Prop-Drilling

### Decision: React Context (`SelectionContext`)

**Rationale**: Selection state must be readable and writable from at minimum two separate subtrees: the navbar (for `<DownloadButton>`) and the landing page (for `<ImageGrid>` and `<LandingPage>` Select All toolbar). Prop-drilling through `AppLayout` → `AppRouter` would require lifting state to the router level and threading it through every layout and page component. A dedicated Context keeps the coupling low and makes the state self-contained.

**Provider placement**: `<SelectionProvider>` wraps the entire app inside `AppRouter`, so it is available to both the navbar and the page tree without creating a separate provider per route.

---

## 5. Checkbox and Link Coexistence

### Decision: `stopPropagation()` + absolutely-positioned overlay

**Problem**: `<ImageCard>` is currently a full-card `<Link>`. A checkbox inside a link receives the link's click unless stopped.

**Solution**: The checkbox is absolutely positioned in the top-left corner of the card. Its `onChange` / `onClick` call `e.stopPropagation()` to prevent the click from bubbling to the `<Link>`. This preserves the navigation behavior for the rest of the card area.

---

## 6. ZIP File Naming

**Pattern**: `stock-images-{timestamp}.zip` — e.g., `stock-images-20260331-143200.zip`

**Rationale**: Using a timestamp keeps filenames unique across downloads and makes it easy to find archives in the user's Downloads folder. The prefix is descriptive enough for non-technical users.

**Individual image filenames inside the ZIP**: derived from the image title: `image.title.replace(/\s+/g, '-').toLowerCase() + '.jpg'` — consistent with the existing single-image download utility.

---

## 7. Selection Reset on Navigation

### Decision: `useEffect` watching `pathname`

**Spec requirement (FR-009)**: Selections reset when the user navigates away from the landing page and returns.

**Implementation**: `SelectionContext` subscribes to `location.pathname` via `useLocation()`. When pathname changes, it clears the selection set. This means:
- `/` → `/favorites` → `/` : selections are cleared
- Filtering on `/` : selections are NOT cleared (pathname unchanged)
- Downloading then staying on `/` : selections are NOT cleared (as per FR-015)

---

## 8. Download Button States

| State | Trigger | Visual |
|-------|---------|--------|
| Disabled | 0 images selected | Grey, not clickable |
| Active | ≥1 image selected | Branded color, shows count badge |
| Loading | Fetch + ZIP in progress | Spinner, "Preparing…" label, not clickable |
| Done | ZIP download triggered | Returns to Active or Disabled depending on count |

The "loading" state is important to prevent double-clicks during the async fetch + ZIP generation phase.

---

## 9. Error Banner Behavior

- Appears below the navbar when one or more image fetches fail during ZIP preparation.
- Lists the titles of failed images.
- Dismissible via an × button.
- Does **not** auto-dismiss, so users have time to read and act.
- If all images succeed (no failures), no banner appears.
- Banner shows even if some images succeeded — the ZIP is still downloaded for the successful ones.
