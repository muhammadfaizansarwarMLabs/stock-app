# Research: Landing Page Card Redesign

**Feature**: 004-landing-page-redesign  
**Phase**: 0 — Research & Unknowns Resolution  
**Date**: 2026-04-02

---

## 1. Heart Icon — SVG Approach

**Decision**: Use inline Heroicons SVGs (outline heart for unfavorited, solid filled heart for favorited), red-colored via Tailwind `text-red-500`.

**Rationale**: Consistent with the entire codebase which uses inline Heroicons SVGs for all icon-only controls (close button in ImageModal, zoom buttons, etc.). No new dependency is introduced.

**Alternatives considered**:
- External icon library (react-icons, lucide-react): rejected — adds a dependency for a use case already covered inline.
- CSS-only heart shapes: rejected — fragile and inconsistent with rest of codebase.

**SVGs to use**:
- Outline heart: Heroicons 20/outline `heart` path
- Solid heart: Heroicons 20/solid `heart` path

---

## 2. FavoriteToggle Component — Replacement Strategy

**Decision**: Replace the text button internals in `src/components/favorites/FavoriteToggle.jsx` directly. The component signature and prop contract (`isFavorite`, `onToggle`) remain unchanged — only the rendered JSX changes.

**Rationale**: `FavoriteToggle` is used in `ImageCard` on the landing page and in `FavoritesList`/`FavoritesPage`. Keeping the interface stable means no prop changes ripple to callers. Only the visual output changes from text pill to heart icon.

**Alternatives considered**:
- Create a new `HeartToggle` component: rejected — unnecessary duplication; the existing `FavoriteToggle` component already has the right contract.
- Pass icon variant as a prop: rejected — over-engineering; heart icon is the desired UI for all usages.

---

## 3. Direct Download on Card — State Management

**Decision**: Add local `useState` for `busy` (boolean) and `error` (string) inside `ImageCard`. Call `downloadImage(image, null)` (no effects) on click. Auto-clear error after 3 s with `setTimeout` + cleanup on unmount.

**Rationale**: Download state is per-card, not shared. Local state is the correct scope. The existing `downloadImage` utility already handles the default (no-effects) path and returns `{ ok, message? }`.

**Alternatives considered**:
- Lift download state to parent grid: rejected — no cross-card communication needed.
- Context-based download queue: rejected — overkill for single-card-at-a-time download.

---

## 4. Icon Overlay Bar — Implementation Pattern

**Decision**: Add a `<div>` with `absolute bottom-0 inset-x-0 flex justify-between items-center px-3 py-2 bg-black/40` overlaying the card image. Place heart on the right, download on the left (or both right — see FR-007 for side-by-side requirement). Use `z-20` so icons sit above the `<Link>` overlay (`z-10`) while still allowing click propagation to be stopped explicitly.

**Rationale**: The existing `ImageCard` already uses the `relative` + `absolute` pattern for the selection checkbox and the card-covering `<Link>`. The pattern is proven and consistent. `z-20` is already used for the checkbox control in the same file.

**Key detail**: Both icon buttons must call `event.preventDefault()` + `event.stopPropagation()` to prevent the card `<Link>` from navigating to the modal on icon click.

**Alternatives considered**:
- Place icons in the card's metadata div below the image: rejected — spec (FR-007) explicitly requires bottom-of-image overlay bar.
- Use CSS `pointer-events: none` on the link and rely on button capture: rejected — brittle cross-browser behavior.

---

## 5. Grid Fill Strategy — Responsive Columns

**Decision**: Swap the current fixed column grid (`grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`) in `ImageGrid` to use `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` combined with `w-full` card sizing. This fills horizontal space because Tailwind grid columns stretch equally.

**Rationale**: The current grid already uses equal-width columns. The empty space issue is caused by too few columns at mid-range viewport widths (between `lg` and `xl`). Adding a `sm` breakpoint column tier fills the gap. Optionally, `auto-fill` with `minmax` could be used but is harder to reason about and test at specific breakpoints.

**Image height**: Current `h-48` is kept. Images use `object-cover` so they fill the fixed height. No letterboxing.

**Alternatives considered**:
- `grid-cols-[repeat(auto-fill,minmax(240px,1fr))]`: flexible but cannot guarantee specific column counts at tested breakpoints; harder to QA.
- Masonry layout: rejected — out of spec scope and introduces complex layout logic.

---

## 6. Error Auto-Dismiss Timing

**Decision**: 3000ms `setTimeout`. Clear timeout ref in `useEffect` cleanup to avoid memory leaks on card unmount during a countdown.

**Pattern**:
```js
useEffect(() => {
  if (!downloadError) return;
  const t = setTimeout(() => setDownloadError(""), 3000);
  return () => clearTimeout(t);
}, [downloadError]);
```

**Rationale**: Simple, idiomatic React, no extra library required. Cleanup prevents memory leak if the user navigates away while the error is displayed.

---

## Summary of All Decisions

| Unknown | Decision |
|---------|----------|
| Heart icon source | Inline Heroicons SVGs, `text-red-500` |
| FavoriteToggle change scope | Replace JSX internals only; keep prop contract |
| Download state scope | Local `useState` inside `ImageCard` |
| Overlay position/styling | `absolute bottom-0 inset-x-0 bg-black/40` |
| Link navigation prevention | `stopPropagation` + `preventDefault` on icon buttons |
| Grid fill at mid-viewports | Add `sm:grid-cols-3` breakpoint |
| Error dismiss | `setTimeout(3000)` with `useEffect` cleanup |
</content>
</invoke>