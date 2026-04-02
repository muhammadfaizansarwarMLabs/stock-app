# Quickstart: Landing Page Card Redesign

**Feature**: 004-landing-page-redesign  
**Branch**: `004-landing-page-redesign`  
**Date**: 2026-04-02

---

## Prerequisites

- Node.js ≥ 18 installed
- Repo cloned; dependencies installed (`npm install`)
- On branch `004-landing-page-redesign`

---

## Run the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Manual Validation Checklist

### US1 — Heart Icon Favorite Toggle

- [ ] On pointer devices, hover an image card and verify the heart icon appears in the bottom-right action cluster.
- [ ] On touch-only devices, verify the heart icon is visible without hover.
- [ ] Heart control is a white icon inside a gray circular background in both states.
- [ ] Click any heart icon → it changes from outline to filled state. No page navigation occurs.
- [ ] Click the filled heart → it reverts to outline. Image is removed from favorites.
- [ ] Navigate to the Favorites page → only images with filled hearts appear.
- [ ] Reload the page → previously favorited images still show filled hearts (persisted).

### US2 — Direct Download Icon

- [ ] On pointer devices, hover an image card and verify the download icon appears alongside the heart icon in the bottom-right action cluster.
- [ ] On touch-only devices, verify the download icon is visible without hover.
- [ ] Download control is a white icon inside a gray circular background.
- [ ] Click the download icon → browser starts a file download of the original image without opening the modal.
- [ ] While downloading, the icon shows a spinning animation and is non-clickable.
- [ ] After download completes, the icon returns to normal.
- [ ] To simulate a download failure: disconnect network, click download icon → a red error message appears on the card and disappears after ~3 seconds.
- [ ] Clicking the card image area (not the icons) still opens the image modal.

### US3 — Full-Width Grid

- [ ] At 1280 px viewport width: 4 columns fill the full width, no empty right-side space.
- [ ] At 768 px viewport width: 3 columns fill the full width.
- [ ] At 375 px viewport width: 2 columns fill the full width, no horizontal overflow.
- [ ] Images maintain correct proportions (no stretching, cropped to fill).

### US4 — Animated Hero Banner

- [ ] At viewport ≥ 768 px: Hero section shows two columns (text left, collage right) at 50/50 split.
- [ ] The text column displays the headline in Playfair Display font (serif, elegant).
- [ ] The collage column on the right shows an upward-scrolling animation of overlapped images.
- [ ] The collage images scroll continuously without jumping; animation is smooth.
- [ ] At viewport < 768 px: Hero sections stacks vertically (text on top, collage below).
- [ ] Collage adapts to narrow viewports; animation still plays smoothly.

### US5 — Light / Dark Mode Toggle

- [ ] Navbar includes a sun/moon icon button at the far right (after Download button).
- [ ] Clicking the icon toggles the entire site to dark mode (colors invert; backgrounds darken, text lightens).
- [ ] In dark mode, all pages (landing, favorites, about, faq) display dark theme colors.
- [ ] Reload the page → active theme preference persists (localStorage preserved).
- [ ] Clear browser localStorage, then reload → dark mode is applied if OS has `prefers-color-scheme: dark`; light mode if OS prefers light or no preference set.
- [ ] Dark mode is CSS-variable based; no per-component class changes are visible (smooth, consistent theme application).

### US6 — Site Footer

- [ ] Footer appears at the bottom of all pages (landing, favorites, about, faq), below main content.
- [ ] At ≥ 768 px viewport: Footer shows 3 columns (branding left, navigation center, legal right).
- [ ] Branding column displays the site name and tagline.
- [ ] Navigation column shows links: FAQ, Blog, Contact Us, About.
- [ ] Legal column shows links: Privacy Policy, Terms of Service.
- [ ] Clicking FAQ and About links navigates to the correct pages.
- [ ] Blog, Contact Us, Privacy Policy, Terms of Service links are placeholder anchors (do not cause errors).
- [ ] At < 768 px viewport: Footer stacks to a single centered column.
- [ ] Footer respects active light/dark theme (colors change when theme is toggled).

### US7 — Tag Filter Row

- [ ] Landing page displays a horizontal scrollable row of 10–12 tag chips below Select All / Clear All buttons.
- [ ] Tags include topics like "mountains", "forest", "sunset", "architecture", etc.
- [ ] Clicking a tag highlights it and filters the grid to show only images with that tag.
- [ ] Only one tag can be active at a time; clicking another tag switches the filter.
- [ ] Clicking the active tag again deactivates it and shows all images again.
- [ ] The URL updates to show `?tag=<tagname>` when a tag is active.
- [ ] Reloading the page with an active tag preserves the filter (URL state persists).
- [ ] Tag filter combines with text search: results show images matching both the active tag AND any typed query in the title filter.
- [ ] On very narrow viewports (≤ 375 px) the tag row scrolls horizontally; chips never wrap.

### Regression Checks

- [ ] Select All / Clear All bulk controls still work.
- [ ] Title filter still filters the grid.
- [ ] Tag filter + text search composition works correctly (both filters apply simultaneously).
- [ ] Favorites page still shows only favorited images.
- [ ] Opening the image modal from any card still works (click card body area).
- [ ] All pages (landing, favorites, about, faq) render correctly with navbar and footer in all theme/viewport combinations.

---

## Build Verification

```bash
npm run build
```

Expected output: `✓ built in X.XXs` with no errors or warnings.

## Verification Notes

**Build Results (2026-04-02)**:
- Build command: `npm run build` → ✓ 67 modules transformed, `dist/assets/index-Zsgh43q5.css` 27.65 kB, `dist/assets/index-BszYryV1.js` 335.87 kB, built in 5.48s.
- No compile errors reported.

**Code Verification (2026-04-02)**:
- ✅ `index.html`: theme initialization script present (`localStorage` + `prefers-color-scheme` before hydration).
- ✅ `src/styles/tailwind.css`: `html.dark` CSS variable override block present.
- ✅ `src/components/theme/ThemeToggle.jsx`: toggle component exists and persists theme preference.
- ✅ `src/components/layout/AppLayout.jsx`: `ThemeToggle` and `SiteFooter` are wired.
- ✅ `src/components/layout/SiteFooter.jsx`: footer component present.
- ✅ `src/data/images.js`: `getTopTags()` and `getImagesByTag()` helpers present.
- ✅ `src/components/landing/TagFilterRow.jsx`: tag filter row component present.
- ✅ `src/pages/landing/LandingPage.jsx`: tag URL state + tag/text composed filtering wired.

**Manual Validation Status**:
- ⏳ Full interactive regression across 375/768/1280/1920 breakpoints is still required to complete T037.
