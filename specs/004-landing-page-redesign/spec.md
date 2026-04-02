# Feature Specification: Landing Page Redesign

**Feature Branch**: `004-landing-page-redesign`  
**Created**: 2026-04-02  
**Status**: Draft  
**Input**: User description: "update the landing page design with red heart and download icons on cards, wider card and page layout, and a larger hero banner with animated trending images on the right and banner text on the left. Add light/dark mode toggle in navbar, a site footer with common links, and a clickable tag filter row on the landing page."

## Clarifications

### Session 2026-04-02

- Q: When should the heart and download icons be visible on each card? → A: Always visible on every card at all times (not hover-only)
- Q: What feedback should the user receive when a card-level download fails? → A: Small inline error message on the card, auto-dismisses after ~3 seconds
- Q: Where on the card should the heart and download icons be positioned? → A: Bottom-right corner of the card image, without a dark overlay bar
- Q: How should the landing page hero banner be structured? → A: Text occupies the left 50% and animated trending images occupy the right 50%
- Q: What kind of images should appear in the banner animation? → A: A curated mix of fashion, portrait, and other trending stock images
- Q: What motion should the banner images use? → A: Multiple images animate upward from bottom to top inside the hero area
- Q: How should the hero banner reflow on smaller screens? → A: Stack vertically on mobile with text on top and animated images below
- Q: How should the hero animation behave for reduced-motion users? → A: Keep the same animation for all users
- Q: What layout structure should the animated hero images use? → A: A freeform collage of overlapping cards all moving upward together
- Q: What display font should be used for the hero banner headline? → A: Playfair Display (Google Fonts, loaded as a new import)

### Session 2026-04-02 (Round 2)

- Q: Where should the light/dark mode toggle appear in the navbar? → A: At the very right end of the navbar, after all navigation links and the download button
- Q: Should the selected theme persist across page reloads? → A: Yes, the chosen theme should be saved and restored on next visit
- Q: Which pages should the site footer appear on? → A: All pages (landing, favorites, about, FAQ)
- Q: What links should the footer include? → A: FAQ, Blog, Contact Us, About, Privacy Policy, Terms of Service; links to pages that don't exist yet can be placeholder anchors
- Q: How many tag chips should show in the tag filter row? → A: 10–12 chips derived from the existing image tag data
- Q: Can multiple tags be active at the same time? → A: No, only one tag active at a time; clicking the active tag deactivates it and restores the full grid
- Q: Should the tag filter compose with the existing text search? → A: Yes, results show images matching both the active tag and the typed query

### Session 2026-04-02 (Round 3)

- Q: How should dark mode be applied across the site? → A: CSS custom property swap — define a `html.dark {}` block in `tailwind.css` overriding the existing CSS variables; no per-component changes needed
- Q: When no saved theme preference exists, should the OS `prefers-color-scheme` be checked? → A: Yes — check OS preference first; default to dark if the OS is dark, otherwise light
- Q: How should the footer content be visually structured? → A: Three-column grid: site branding/tagline left; navigation links (FAQ, About, Blog, Contact) center; legal links (Privacy Policy, Terms of Service) right
- Q: Should the active tag filter state be stored in the URL for shareability? → A: Yes, use `?tag=<tagname>` query parameter so filtered views are shareable and back/forward navigation works
- Q: Should the theme be pre-applied in the HTML `<head>` to prevent a flash of the wrong theme on page load? → A: Yes, use an inline script to read `localStorage` + `prefers-color-scheme` and apply the `dark` class before React hydrates

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Heart Icon Favorite Toggle (Priority: P1)

A user browsing the landing page wants to save an image to favorites. Instead of a text button they see a heart icon pinned to the bottom-right area of the image card. An empty outline heart means "not favorited"; clicking it fills the heart solid red and saves the image. Clicking a filled red heart removes it from favorites and restores the outline.

**Why this priority**: The favorite toggle is an existing core feature whose visual control is being replaced. It directly affects recognition and usability for all users.

**Independent Test**: Load the landing page, locate the heart icon on any card, click it once and verify it becomes a filled red heart, click again and verify it reverts to an outline heart. No other page behavior should change.

**Acceptance Scenarios**:

1. **Given** an image is not favorited, **When** the user views its card, **Then** an outline red heart icon is visible near the bottom-right corner of the card image.
2. **Given** an image is not favorited, **When** the user clicks the heart icon, **Then** the heart becomes filled red and the image is added to favorites.
3. **Given** an image is already favorited, **When** the user views its card, **Then** a filled red heart icon is visible.
4. **Given** an image is already favorited, **When** the user clicks the filled heart, **Then** the heart reverts to outline and the image is removed from favorites.
5. **Given** the page reloads, **When** an image was previously favorited, **Then** the heart icon still appears filled red (persisted state).

---

### User Story 2 — Direct Download Icon on Card (Priority: P2)

A user wants to download an image directly from the landing page grid without first opening the image modal. Each card has a red download icon visible alongside the heart icon in the bottom-right control cluster. Clicking it triggers the same direct download as the existing modal download at default settings (no effects applied).

**Why this priority**: Reduces friction for users who only want to download — they no longer need to open the modal first.

**Independent Test**: Click the download icon on any card without opening the modal; verify the image file downloads to the browser's default downloads folder.

**Acceptance Scenarios**:

1. **Given** the landing page is loaded, **When** the user views any image card, **Then** a red download icon is visible alongside the heart icon near the bottom-right of the card image.
2. **Given** the user clicks the download icon, **When** the download completes, **Then** the original image file is saved (no effects applied, original filename and extension).
3. **Given** the download is in progress, **When** the user looks at the icon, **Then** a visual busy indicator replaces the icon, preventing a second simultaneous download on the same card.
4. **Given** the download fails, **When** the error occurs, **Then** the icon returns to its normal state with no broken UI left behind.

---

### User Story 3 — Full-Width Landing Layout (Priority: P3)

The landing page currently feels constrained. The navbar, hero, and image grid are resized so the page uses the available screen width more effectively, while cards remain visually balanced and image aspect ratios are preserved.

**Why this priority**: Visual polish that improves perceived quality but does not affect functionality.

**Independent Test**: Open the landing page at 375 px, 768 px, 1280 px, and 1920 px viewport widths; verify the navbar, hero, and grid expand to use the screen width effectively and no large empty gutter space remains to the right of the card grid.

**Acceptance Scenarios**:

1. **Given** the landing page is displayed on desktop, **When** it renders, **Then** the navbar, hero section, and grid feel wider and make fuller use of the viewport.
2. **Given** the landing page is displayed on mobile (≤ 640 px), **When** it renders, **Then** the layout still fits the screen without horizontal overflow.
3. **Given** images of varying aspect ratios, **When** they are displayed in the grid, **Then** images are cropped to fill consistently rather than stretching or leaving letterbox gaps.

---

### User Story 4 — Animated Hero Banner (Priority: P1)

A user arriving on the landing page should immediately see a more premium hero section. The hero banner is taller, the headline content sits on the left half, and the right half displays a continuous upward-moving collage of curated trending images so the page feels more dynamic and editorial.

**Why this priority**: The hero section is the first visual impression on the landing page and strongly affects perceived quality and engagement.

**Independent Test**: Load the landing page and verify the hero banner is visibly taller, text is presented on the left half, and multiple curated images animate upward on the right half without overlapping the text area.

**Acceptance Scenarios**:

1. **Given** the landing page is opened on desktop, **When** the hero banner renders, **Then** the banner is noticeably taller than before and splits into a left text area and right animated image area at roughly 50% width each.
2. **Given** the hero banner is visible, **When** the user views the right side of the banner, **Then** a freeform collage of overlapping curated image cards moves continuously upward inside the hero area.
3. **Given** the hero banner headline is shown, **When** the user reads it, **Then** the headline uses a more decorative, premium-looking font than the standard body text.
4. **Given** the hero banner animation is running, **When** the user remains on the page, **Then** the motion stays visually smooth and does not block reading the text on the left.
5. **Given** the landing page is viewed on narrower screens, **When** the hero banner reflows, **Then** the layout stacks vertically with text on top and animated images below, while remaining readable and contained without layout breakage.

---

### User Story 5 — Light / Dark Mode Toggle (Priority: P2)

A user who prefers a dark or light interface wants to switch the entire site's color theme with one click. A theme toggle icon sits at the far right of the navbar on every page. Clicking it switches between light and dark mode instantly and the preference is remembered on the next visit.

**Why this priority**: Dark mode is a widely expected UI feature that improves comfort in low-light environments and signals a polished product.

**Independent Test**: Click the theme toggle icon in the navbar; verify the entire site switches color scheme. Reload the page and verify the same theme is still active.

**Acceptance Scenarios**:

1. **Given** the site is in its default (light) mode, **When** the user views the navbar, **Then** a theme toggle icon is visible at the far right of the navbar after all other controls.
2. **Given** the site is in light mode, **When** the user clicks the toggle icon, **Then** the entire site switches to dark mode and the icon updates to reflect the current state.
3. **Given** the site is in dark mode, **When** the user clicks the toggle icon, **Then** the entire site switches back to light mode.
4. **Given** the user has selected a theme, **When** they reload or revisit the page, **Then** the previously selected theme is restored automatically.
5. **Given** either theme is active, **When** the user navigates between pages, **Then** the selected theme persists across all pages without flashing.

---

### User Story 6 — Site Footer (Priority: P3)

A user who wants to navigate to secondary pages (FAQ, Blog, Contact, legal pages) expects to find them in a footer at the bottom of every page. The footer presents a clean set of grouped links and basic site information.

**Why this priority**: A footer is a standard navigation convention that improves discoverability of secondary content and gives the site a more complete, professional appearance.

**Independent Test**: Scroll to the bottom of any page; verify a footer is present with working links to FAQ, Blog, Contact Us, About, Privacy Policy, and Terms of Service.

**Acceptance Scenarios**:

1. **Given** the user is on any page of the site, **When** they scroll to the bottom, **Then** a footer is visible with navigation links.
2. **Given** the footer is visible, **When** the user looks at it, **Then** it includes links for FAQ, Blog, Contact Us, About, Privacy Policy, and Terms of Service.
3. **Given** the user clicks the FAQ or About link in the footer, **When** the navigation resolves, **Then** they are taken to the corresponding existing page.
4. **Given** the user clicks a link for a page that does not yet exist (Blog, Contact, Privacy, Terms), **When** they click it, **Then** they see a placeholder or the link is visually present without causing a broken navigation error.
5. **Given** either light or dark mode is active, **When** the footer is displayed, **Then** it respects the current theme.

---

### User Story 7 — Tag Filter Row (Priority: P2)

A user browsing the landing page wants to quickly narrow images by category without typing. A horizontal row of 10–12 clickable tag chips appears just below the Select All / Clear All controls. Clicking a chip filters the grid to images that carry that tag. The text search filter and tag filter work together.

**Why this priority**: Tag-based filtering is a fast, discoverable way to narrow results and complements the existing text search for users who prefer browsing by category.

**Independent Test**: Click any tag chip on the landing page; verify only images tagged with that category are shown. Type a keyword in the search box while a tag is active; verify results are narrowed further. Click the active tag chip again; verify all images are restored.

**Acceptance Scenarios**:

1. **Given** the landing page is loaded, **When** the user views the area below the Select All / Clear All row, **Then** a horizontal row of 10–12 tag chips is visible.
2. **Given** no tag is active, **When** the user clicks a tag chip, **Then** the image grid updates to show only images that include that tag, and the chip appears visually highlighted.
3. **Given** a tag chip is active, **When** the user clicks the same chip again, **Then** the tag filter is cleared and the full image list is restored.
4. **Given** a tag chip is active, **When** the user also types in the search box, **Then** the grid shows only images matching both the active tag and the typed text.
5. **Given** a tag chip is active, **When** the user clicks a different tag chip, **Then** the previous tag is deactivated and only the newly clicked tag filter is applied.
6. **Given** the tag chips are displayed, **When** the list of tags is longer than the screen width, **Then** the row scrolls horizontally without wrapping to a second line.

---

### Edge Cases

- What happens when the heart icon is clicked rapidly multiple times — toggle should be idempotent and not produce duplicate favorites entries.
- What happens when a direct card download fails due to a network error — a short inline error label appears on the card and auto-dismisses after ~3 seconds; the download icon then resets to its normal state.
- What happens on very small viewports (< 375 px) — grid should not overflow horizontally.
- What happens when the image list is empty — grid renders with no broken layout.
- What happens if there are not enough suitable trending images for the hero animation — the banner should still render with the best available curated subset and without empty broken slots.
- What happens if the hero animation becomes visually distracting on smaller screens — the layout should remain readable and motion should stay contained within the image half of the banner.
- What happens if the user has a reduced-motion preference enabled — the hero animation still runs with the same upward motion behavior.
- What happens if the user's system has no stored theme preference — the site defaults to light mode.
- What happens if localStorage is unavailable (private browsing) — the theme toggle still works for the session but does not persist.
- What happens if a tag chip is clicked while the image list is empty due to the text filter — the grid remains empty and the tag filter is still shown as active.
- What happens if no images carry a given tag — clicking that chip results in an empty grid state with no broken layout, and the same empty-state feedback used elsewhere is shown.
- What happens on very narrow viewports with many tag chips — the row scrolls horizontally; chips never wrap to a second line.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The "Add to Favorite" text button on each image card MUST be replaced with an outline red heart SVG icon that is always visible on the card (not hover-dependent).
- **FR-002**: The "Favorited" (active) text button on each image card MUST be replaced with a filled solid red heart SVG icon that is always visible on the card (not hover-dependent).
- **FR-003**: The heart icon MUST retain the exact same toggle behavior (add/remove and persist to existing favorites store) as the current text button.
- **FR-004**: Each image card MUST display a download icon button rendered in parallel (side by side, same vertical level) with the heart icon; the download icon MUST be always visible (not hover-dependent).
- **FR-005**: Clicking the download icon MUST trigger a direct download of the original image file at default settings (no effects applied) using the existing download utility.
- **FR-006**: While a card-level download is in progress, the download icon MUST show a busy/loading state and MUST NOT allow a second simultaneous download on the same card.
- **FR-011**: When a card-level download fails, a short inline error message MUST appear on that card and MUST auto-dismiss after approximately 3 seconds, after which the download icon returns to its normal interactive state.
- **FR-007**: The heart icon and download icon MUST be positioned side by side near the bottom-right corner of each card image, always visible, without using a semi-transparent dark overlay bar behind them.
- **FR-008**: The landing page image grid MUST update card and image sizing so that available horizontal space is fully utilized with no visible empty right-side gutter at any common viewport width.
- **FR-009**: Image aspect ratios MUST be preserved — images crop to fill their container, not stretch.
- **FR-010**: All icon-only controls (heart, download) MUST have accessible `aria-label` attributes for screen-reader users.
- **FR-012**: The main landing page hero banner MUST increase in height compared with the current banner so it has a stronger visual presence above the grid.
- **FR-013**: On desktop widths, the hero banner MUST allocate approximately 50% of its width to text content on the left and 50% to animated images on the right.
- **FR-014**: The hero banner MUST display multiple curated images from fashion, portrait, and other trending stock categories in the right-side visual area, arranged as a freeform overlapping card collage.
- **FR-015**: The hero banner collage MUST animate upward from bottom to top in a single continuous contained motion inside the banner, with all cards moving together.
- **FR-016**: The hero banner headline text MUST use Playfair Display, loaded from Google Fonts, as the display typeface — visually distinct from the existing Manrope body and Space Grotesk heading fonts.
- **FR-017**: The hero banner animation MUST remain visually separate from the text area so the text remains readable.
- **FR-018**: The wider landing page treatment MUST extend to the navbar and hero container so the full page feels more expansive on large screens.
- **FR-019**: On smaller screens, the hero banner MUST reflow into a vertical layout with the text section above the animated image section.
- **FR-020**: The hero banner upward image animation MUST remain enabled with the same motion behavior for all users, including users with reduced-motion preferences.
- **FR-021**: A theme toggle icon control MUST be placed at the far-right end of the navbar, after all navigation links and the download button, on every page.
- **FR-022**: Clicking the theme toggle MUST switch the entire site between light mode and dark mode instantly by toggling a `dark` class on the `<html>` element, which activates a `html.dark { }` CSS custom property override block.
- **FR-023**: The active theme MUST be saved to `localStorage` and automatically restored when the user returns to or reloads the site; when no saved preference exists, the initial theme MUST be determined by the OS `prefers-color-scheme` media query (dark OS → dark mode; light or no preference → light mode).
- **FR-024**: The theme toggle icon MUST visually indicate the current state (e.g., sun icon for light mode, moon icon for dark mode).
- **FR-024b**: An inline script in the HTML `<head>` MUST pre-apply the `dark` class based on `localStorage` theme or `prefers-color-scheme` OS preference before the page paints, to prevent a flash of the wrong theme on page load.
- **FR-025**: The site MUST display a footer at the bottom of every page (landing, favorites, about, FAQ).
- **FR-026**: The footer MUST contain links organized in three columns: (1) site name and tagline on the left; (2) navigation links (FAQ, Blog, Contact Us, About) in the center; (3) legal links (Privacy Policy, Terms of Service) on the right.
- **FR-027**: Footer links to existing pages (FAQ, About) MUST navigate to those pages; links to pages that do not yet exist MUST be present in the footer without causing navigation errors.
- **FR-028**: The footer MUST respect the active light/dark theme.
- **FR-029**: A horizontal row of 10–12 clickable tag chips MUST be displayed on the landing page immediately below the Select All / Clear All control row.
- **FR-030**: The tag chips MUST be derived from the existing image tag data present in the project.
- **FR-031**: Clicking a tag chip MUST filter the image grid to show only images that include that tag; the active chip MUST be visually distinguished from inactive chips; the active tag MUST also be encoded in the URL as a `?tag=<tagname>` query parameter.
- **FR-032**: Only one tag chip MAY be active at a time; clicking an already-active chip MUST deactivate it, restore the unfiltered image list, and remove the `?tag=` query parameter from the URL.
- **FR-033**: The tag chip filter MUST compose with the existing text search filter — the grid shows images matching both the active tag and any typed query simultaneously; the URL MUST reflect the active tag (not the query text).

### Key Entities

- **ImageCard**: Visual tile in the landing grid; contains image thumbnail, title, heart toggle, and direct-download action.
- **FavoriteToggle**: Heart icon control managing add/remove from favorites, reads and writes from the existing favorites store.
- **HeroBanner**: The primary landing-page banner region; contains headline copy, supporting text, filter entry point, and an animated visual area.
- **HeroAnimationImage**: Curated image item rendered as an overlapping card within the freeform right-side collage; selected from trending portrait, fashion, and related stock imagery.
- **ThemeToggle**: Navbar icon control that switches the site between light and dark color themes and persists the selection in localStorage.
- **SiteFooter**: Full-width footer component rendered on every page; contains grouped navigation links and basic site branding.
- **TagFilterRow**: Horizontal scrollable row of clickable tag chip buttons on the landing page; manages a single active-tag state that composes with the existing text search filter.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can toggle favorites on the landing page using a single heart icon click — no text button is visible.
- **SC-002**: Users can download any image from the landing page in one click without opening the modal.
- **SC-003**: At all common viewport widths (375 px – 1920 px) the image grid fills horizontal space with no visible empty right-side gutter.
- **SC-004**: Heart and download icons are horizontally aligned near the bottom-right of every card image, visible at all viewport widths, with no dark overlay bar behind them.
- **SC-005**: A failed card download shows an inline error message on the card that auto-dismisses in ~3 seconds, after which the card returns to its normal interactive state with no broken UI.
- **SC-006**: The hero banner clearly presents text on the left half and animated imagery on the right half on desktop layouts.
- **SC-007**: The hero banner shows a freeform collage of overlapping curated image cards animating upward, contained within the right half of the banner without obscuring the hero text.
- **SC-008**: The hero banner appears visibly taller and more prominent than the previous version while remaining usable on mobile.
- **SC-009**: The hero headline is rendered in Playfair Display, visually distinct from the Manrope body and Space Grotesk heading fonts used elsewhere on the page.
- **SC-010**: On smaller screens, the hero banner stacks vertically with the text above the animated imagery and no layout overflow.
- **SC-011**: The hero animation behavior remains unchanged across supported user preference settings, including reduced-motion preferences.
- **SC-012**: A theme toggle icon is visible at the far right of the navbar on every page and switches the site between light and dark mode on click.
- **SC-013**: The user's selected theme is persisted and automatically applied on page reload or next visit; on first visit with no saved preference the site respects the OS `prefers-color-scheme` setting; the theme is pre-applied in the `<head>` so no flash of the wrong theme is visible.
- **SC-014**: A footer is visible at the bottom of every page with a three-column layout (site branding left, navigation center, legal right) that stacks to a single centered column on mobile, and adapts to the active theme.
- **SC-015**: A row of 10–12 tag chips is visible on the landing page below the Select All / Clear All controls.
- **SC-016**: Clicking a tag chip filters the image grid to images bearing that tag; the active chip is visually distinct from inactive chips; the URL updates to `?tag=<tagname>` and can be shared or bookmarked.
- **SC-017**: Clicking an active tag chip deactivates it, restores the full image list, and removes the `?tag=` parameter from the URL.
- **SC-018**: The tag chip filter and text search filter compose correctly — the grid shows only images matching both the active tag and the typed query simultaneously.

## Assumptions

- The existing favorites store and its toggle logic are reused without modification — only the visual control changes.
- The existing `downloadImage` utility (`src/utils/download-image.js`) is used for direct card downloads with a default (no-effects) payload.
- Heart and download icons use inline SVGs (Heroicons style) consistent with the rest of the codebase — no new icon library is introduced.
- Mobile layout is in scope; the grid fill requirement applies to all breakpoints.
- The image modal and its controls remain out of scope.
- The hero animation uses existing stock-image content already available in the project rather than requiring a new remote content source.
- The hero headline uses Playfair Display, loaded via a new Google Fonts import; it is a serif display face distinct from the existing Manrope body and Space Grotesk heading fonts.
- On smaller viewports, the hero banner stacks vertically with text first and animated imagery below.
- Reduced-motion preferences do not alter the hero animation behavior for this feature.
- Dark mode is implemented via a CSS custom property swap: a `html.dark { }` block in `tailwind.css` overrides the existing CSS variables (`--bg-top`, `--bg-mid`, `--bg-bottom`, `--accent`, `--ink`, `--muted`, etc.); no per-component style changes are required.
- If localStorage is unavailable, the theme toggle still functions for the current session without persisting.
- The site defaults to light mode when no stored theme preference exists.
- On first visit (no localStorage value), the initial theme is determined by `prefers-color-scheme`: dark OS → dark mode; light or no-preference OS → light mode.
- Theme initialization via inline `<head>` script prevents Flash of Unstyled Content (FOUC); the script checks `localStorage` for a saved theme, falls back to `prefers-color-scheme`, and applies the `dark` class before page render.
- Footer layout is a three-column grid on desktop (branding/tagline left, navigation center, legal right) that collapses to a single stacked centered column on viewports ≤ 768 px.
- Tag chips are derived from the union of all tags across the existing image dataset; the exact 10–12 chips selected are the most frequently occurring tags.
- Tag filter state is encoded in the URL as a `?tag=<tagname>` query parameter so filtered views are shareable, bookmarkable, and work with browser back/forward navigation.

