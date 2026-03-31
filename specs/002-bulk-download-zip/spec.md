# Feature Specification: Bulk Image Download with ZIP

**Feature Branch**: `002-bulk-download-zip`  
**Created**: 2026-03-31  
**Status**: Draft  
**Input**: User description: "i want to build a download all button on the main landing page just after FAQ that will allow us to download multiple selected images as a zip file. there should be a check box on left top corner of each image(card) on landing page to select the image to download. the count of selected images also should be show beside the download all button."

## Clarifications

### Session 2026-03-31

- Q: Are checkboxes always visible on image cards or only on hover/focus? → A: Visible on hover on desktop; always visible on mobile (responsive logic)
- Q: Where is the "Download Selected" button positioned? → A: Fixed in the navbar, to the right of the FAQ nav link
- Q: Does "Select All" apply to filtered visible images or the full dataset? → A: Only currently visible (filtered) images
- Q: Are selections cleared or retained after a successful ZIP download? → A: Selections remain checked after download
- Q: How are image fetch failures during ZIP preparation communicated to the user? → A: Inline alert shown below the navbar, persists until dismissed

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Select Images and Download as ZIP (Priority: P1)

A user browsing the landing page wants to download several images at once. They check individual images using the checkbox on each card, then click the "Download Selected" button to receive a single ZIP archive containing all selected full-resolution images.

**Why this priority**: This is the core purpose of the feature. Without selection and ZIP download, the feature has no value.

**Independent Test**: Can be fully tested by selecting 3+ images on the landing page, clicking "Download Selected", and verifying a ZIP file is downloaded containing the correct images.

**Acceptance Scenarios**:

1. **Given** the landing page is loaded with images, **When** the user checks the checkbox on two or more image cards, **Then** those images are visually marked as selected (checkbox filled/checked state).
2. **Given** one or more images are selected, **When** the user clicks the "Download Selected" button, **Then** a ZIP file is downloaded to the user's device containing all selected images at full resolution.
3. **Given** no images are selected, **When** the user views the "Download Selected" button, **Then** the button is disabled and shows a visual indicator that no images are selected.
4. **Given** images are selected, **When** the download begins, **Then** the user sees a loading or progress indicator while the ZIP is being prepared.

---

### User Story 2 - View Selected Image Count (Priority: P2)

A user wants to know at a glance how many images they have selected before initiating the download.

**Why this priority**: Provides essential real-time feedback that gives the user confidence before triggering the download.

**Independent Test**: Can be tested independently by selecting images and verifying the count next to the "Download Selected" button updates in real time.

**Acceptance Scenarios**:

1. **Given** the landing page is open with no images selected, **When** the user looks at the download area, **Then** the count shows "0 selected" or the button is visually inactive.
2. **Given** the user selects 3 images, **When** the count is observed, **Then** it shows "3 selected" (or equivalent).
3. **Given** the user unchecks a previously selected image, **When** the count is observed, **Then** it decrements immediately.

---

### User Story 3 - Select All / Clear All (Priority: P3)

A user wants to quickly select every visible image or clear all selections without clicking each checkbox individually.

**Why this priority**: Convenience enhancement. The core flow works without it, but it greatly speeds up bulk-download workflows.

**Independent Test**: Can be tested independently by clicking "Select All", verifying all checkboxes become checked and the count reflects the total, then clicking "Clear All" and verifying all checkboxes uncheck.

**Acceptance Scenarios**:

1. **Given** no images are selected, **When** the user clicks "Select All", **Then** all **currently visible** image checkboxes become checked (respecting any active title filter) and the count reflects the number of visible images.
2. **Given** some images are selected, **When** the user clicks "Clear All", **Then** all checkboxes are unchecked and the count returns to zero.

---

### Edge Cases

- What happens when the user selects a single image and clicks "Download Selected"? → A ZIP containing one image is downloaded (consistent behavior).
- What happens if an image file fails to fetch during ZIP preparation? → The download proceeds with successfully fetched images and the user is notified of any failures.
- What happens when the user navigates away mid-selection? → Selections are cleared on navigation (no persistence required).
- What happens if the browser blocks the download? → A user-visible error message is shown.
- How does the system handle selecting all 100+ images at once? → A progress/spinner indicator is shown; the operation completes without errors.
- What happens if the user clicks "Download Selected" while a previous download is still in progress? → The button remains in loading state and a second download is not triggered.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The landing page image cards MUST display a checkbox in the top-left corner of each card. On desktop, the checkbox appears on card hover (and remains visible while the card is selected); on mobile/touch viewports, the checkbox is always visible at all times.
- **FR-002**: Clicking the checkbox MUST toggle the selected state of the image without opening the image modal.
- **FR-003**: Selected image cards MUST display a clear visual distinction (e.g., highlighted border or overlay) to distinguish them from unselected cards.
- **FR-004**: A "Download Selected" button and selected-image count MUST be displayed in the main navigation bar, positioned to the right of the FAQ nav link. It MUST be visible on all pages but only functional (enabled) when on the landing page with images selected.
- **FR-005**: A count of currently selected images MUST be displayed adjacent to the "Download Selected" button and update in real time as selections change.
- **FR-006**: When at least one image is selected and the download button is clicked, the system MUST fetch all selected images at full resolution and package them into a single ZIP file for download.
- **FR-007**: The ZIP file MUST be automatically downloaded to the user's device when preparation is complete.
- **FR-008**: The "Download Selected" button MUST be visually disabled and non-interactive when no images are selected.
- **FR-009**: A loading/progress state MUST be shown on the download button while the ZIP is being prepared.
- **FR-010**: If any individual image fetch fails during ZIP preparation, the system MUST continue packaging the remaining images, trigger the ZIP download for the successful ones, and then display a dismissible inline alert below the navbar (e.g., "2 images could not be included in the download"). The alert persists until the user dismisses it.
- **FR-011**: Clicking a checkbox on an image card MUST NOT trigger the modal open action.
- **FR-012**: Image selections MUST be preserved while the user scrolls or filters by title on the landing page; selections reset on navigation away from the page.
- **FR-013**: The feature MUST include a "Select All" control that checks all **currently visible** image cards (i.e., those matching the active title filter, or all images if no filter is active). It MUST NOT select images hidden by the active filter.
- **FR-014**: The feature MUST include a "Clear All" / "Deselect All" control to uncheck all selected images at once.
- **FR-015**: After a successful ZIP download completes, the selection state MUST remain unchanged — checkboxes stay checked so the user can re-download or review their selection. The user clears selections manually via the "Clear All" control.

### Key Entities

- **SelectionState**: A set of image IDs currently checked/selected by the user on the landing page. Maintained in memory, not persisted.
- **ZipJob**: The in-progress operation of fetching selected images and packaging them into a downloadable ZIP archive, with status (idle, loading, done, error).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can select any combination of images and receive a correctly packaged ZIP file in a time proportional to the number and size of selected images.
- **SC-002**: The selected image count updates instantaneously (no perceptible delay) as checkboxes are toggled.
- **SC-003**: The download button is clearly disabled and visually distinct when zero images are selected, preventing accidental empty downloads.
- **SC-004**: Selecting and downloading up to 20 images completes without browser errors or crashes on a standard connection.
- **SC-005**: 100% of images included in the ZIP are the correct full-resolution files matching the selected cards.
- **SC-006**: Users can complete the full select-and-download flow without any external instructions — the UI must be self-explanatory.
- **SC-007**: The checkbox on each card does not interfere with opening the image modal (click targets are distinct).

## Assumptions

- ZIP packaging is performed entirely client-side in the browser using a JavaScript library (e.g., JSZip) — no server or backend is required, consistent with the existing static site architecture.
- Images are fetched at full resolution from their `downloadUrl` (picsum.photos). The image host supports CORS and will not block browser fetches.
- The "Download Selected" button and count are placed in the main navigation bar to the right of the FAQ nav link — consistent with the user's explicit placement request. The button is always visible in the nav but disabled when no images are selected or when the user is not on the landing page.
- ZIP file names inside the archive are derived from the image title (slugified) for human-readability.
- No ZIP password, encryption, or compression level configuration is required.
- The browser download is triggered via a temporary object URL — no server upload or external storage needed.
- Selections do not persist across navigations or page refreshes (session-only, in-memory state).
- The bulk selection and download feature applies only to the landing page image grid, not the Favorites page.
