# Feature Specification: Local Image Upload Effects

**Feature Branch**: `005-local-image-upload-effects`  
**Created**: 2026-04-03  
**Status**: Draft  
**Input**: User description: "I want to add a button just below the Filter by title input to upload image from laptop/device, open uploaded image in the same preview modal used for stock images, let user apply effects and download the effected image, and show a Change Image button beside Download when uploaded image is open. Also make the site responsive for mobile devices, especially the navbar and modal."

## Clarifications

### Session 2026-04-03

- Q: After selecting a nav link on mobile, should the expanded navbar auto-close or stay open? → A: Auto-close immediately after any nav link is selected.
- Q: What mobile modal layout pattern should be used? → A: Use a full-screen modal on mobile with internal scrolling.
- Q: What breakpoint should trigger mobile navbar toggle and full-screen modal behavior? → A: Apply mobile behavior at <=768px.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Upload and Open in Preview Modal (Priority: P1)

A user wants to upload a personal image from their device directly from the landing page controls and immediately edit it in the same preview modal already used for stock images.

**Why this priority**: This is the core entry point for the feature. Without upload and modal opening, no editing or download value is delivered.

**Independent Test**: On the landing page, click the upload button under the title filter, select a valid image file, and verify the image opens in the existing preview modal.

**Acceptance Scenarios**:

1. **Given** the landing page is visible, **When** the user looks below the "Filter by title" input, **Then** an upload image button is visible and enabled.
2. **Given** the upload button is visible, **When** the user chooses a supported image file from their device, **Then** the selected image opens in the existing image preview modal.
3. **Given** the user cancels file selection, **When** the chooser closes, **Then** no modal opens and the page remains unchanged.

---

### User Story 2 - Apply Effects to Uploaded Image (Priority: P1)

After uploading, a user wants to use the same effect controls available in the modal to visually adjust their uploaded image before downloading.

**Why this priority**: Effects are the main reason for opening the modal on uploaded content and are essential to user value.

**Independent Test**: Upload an image, adjust at least one effect control in the modal, and verify the preview updates to reflect the change.

**Acceptance Scenarios**:

1. **Given** an uploaded image is open in the preview modal, **When** the user changes effect controls, **Then** the modal preview updates immediately.
2. **Given** an uploaded image is open in the preview modal, **When** the user resets controls to defaults, **Then** the preview returns to the original uploaded appearance.

---

### User Story 3 - Download and Change Uploaded Image (Priority: P2)

While editing an uploaded image, a user wants to download the effected result and optionally switch to a different uploaded image without leaving the modal flow.

**Why this priority**: Download is the completion action, and "Change Image" reduces friction when trying multiple uploads.

**Independent Test**: Upload an image, apply effects, download it, then click "Change Image" beside Download and select a new file; verify the new image replaces the prior one in modal preview.

**Acceptance Scenarios**:

1. **Given** an uploaded image with one or more effect changes is open in the modal, **When** the user clicks Download, **Then** the downloaded file reflects the currently previewed effects.
2. **Given** an uploaded image is open in the modal, **When** the modal actions are shown, **Then** a "Change Image" button appears beside the Download action.
3. **Given** the user clicks "Change Image", **When** they select a new supported image file, **Then** the modal preview updates to the new uploaded image.
4. **Given** the user clicks "Change Image" and cancels file selection, **When** the chooser closes, **Then** the current uploaded image remains in preview.

---

### User Story 4 - Responsive Navbar and Modal on Mobile (Priority: P1)

A mobile user wants the navigation and preview modal to be fully usable on small screens, including a toggle button to show and hide navbar links.

**Why this priority**: Mobile responsiveness is critical for usability and prevents key actions from being blocked or hidden on smaller devices.

**Independent Test**: Open the site on a mobile viewport, verify a navbar toggle button appears and can open/close the nav links, then open the image modal and verify all controls and actions remain visible and usable without layout breakage.

**Acceptance Scenarios**:

1. **Given** the viewport is mobile-sized (<=768px), **When** the header renders, **Then** the navbar shows a toggle button to expand and collapse navigation links.
2. **Given** the mobile navbar is collapsed, **When** the user taps the toggle button, **Then** the navigation links become visible and accessible.
3. **Given** the mobile navbar is expanded, **When** the user taps the toggle button again, **Then** the navigation links are hidden.
4. **Given** an image modal is open on a mobile viewport, **When** the user views preview and controls, **Then** the modal content fits the viewport with usable scrolling and no clipped critical actions.
5. **Given** the user resizes between desktop and mobile widths, **When** layout mode changes, **Then** navbar and modal adapt without overlapping, broken alignment, or inaccessible buttons.
6. **Given** the mobile navbar is expanded, **When** the user selects any navigation link, **Then** the menu closes immediately after navigation is triggered.
7. **Given** the viewport is mobile-sized (<=768px), **When** the image modal opens, **Then** it uses a full-screen layout and keeps preview/actions accessible via internal scrolling.

### Edge Cases

- User selects a non-image file type from the device chooser.
- User selects a very large image file and preview loading takes longer than usual.
- User uploads an image, applies effects, then chooses a new image; prior effect state handling must be consistent and predictable.
- User tries to download before the uploaded image preview is fully ready.
- User starts changing image repeatedly and cancels one or more file chooser attempts.
- User closes the modal during an upload-change workflow and reopens it from upload control.
- Mobile navbar is expanded and the user navigates to another route; menu state should reset predictably.
- Mobile navbar toggle is activated repeatedly; layout must remain stable without flicker or overlap.
- Modal is opened on very small screens (e.g., 320px width) and all primary actions must remain reachable.
- Device orientation changes while modal is open; preview and controls must remain usable.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display an "Upload Image" action directly below the existing "Filter by title" input on the landing page.
- **FR-002**: The system MUST allow users to choose an image file from their device when the "Upload Image" action is used.
- **FR-003**: After successful file selection, the system MUST open the selected image in the same preview modal experience used for stock images.
- **FR-004**: The preview modal MUST allow users to apply the existing image effect controls to uploaded images in the same way as stock images.
- **FR-005**: The preview displayed for uploaded images MUST reflect the active effect settings before download.
- **FR-006**: When downloading an uploaded image from the modal, the system MUST output the effected version currently shown in preview.
- **FR-007**: When an uploaded image is the active modal image, the system MUST show a "Change Image" action beside the Download action.
- **FR-008**: The "Change Image" action MUST allow selecting a new device image and replace the currently uploaded modal image with the new selection.
- **FR-009**: If the user cancels any upload or change-image file selection, the system MUST keep the current state unchanged.
- **FR-010**: If the selected file is not a supported image, the system MUST show a clear user-facing validation message and MUST NOT open or replace the modal image.
- **FR-011**: The upload and change-image flow MUST work on both desktop and mobile form factors.
- **FR-012**: Upload-specific controls (including "Change Image") MUST only appear when relevant to uploaded images and MUST NOT disrupt the existing stock-image preview workflow.
- **FR-013**: The header/navbar MUST be responsive across supported viewport sizes, including mobile breakpoints.
- **FR-014**: On mobile viewports, the navbar MUST provide a toggle button that expands and collapses navigation links.
- **FR-015**: The navbar toggle control MUST expose clear accessible state (for example, expanded/collapsed semantics) and remain keyboard/touch operable.
- **FR-016**: On mobile viewports, the image modal MUST render as a full-screen overlay (viewport-sized) with internal scrolling for preview and controls.
- **FR-017**: Modal content MUST avoid horizontal overflow on mobile viewports and maintain readable spacing/typography.
- **FR-018**: Existing desktop navbar and modal behavior MUST remain functionally unchanged while adding responsive mobile behavior.
- **FR-019**: When a mobile nav link is selected from an expanded menu, the menu MUST auto-collapse immediately.
- **FR-020**: When the full-screen mobile modal is open, background page scrolling MUST be prevented until the modal closes.
- **FR-021**: Mobile navbar toggle behavior and full-screen modal behavior MUST apply at viewport widths <=768px.

### Key Entities *(include if feature involves data)*

- **Uploaded Image**: A user-selected local image file intended for modal preview, effects adjustment, and download.
- **Preview Session**: The active modal state containing the current image source (stock or uploaded), effect settings, and action availability.
- **Modal Action State**: Context that determines when Download and "Change Image" are shown and enabled.
- **Navigation Menu State**: UI state indicating whether mobile navigation links are expanded or collapsed.
- **Modal Viewport Mode**: UI state indicating whether modal is using desktop dialog layout or mobile full-screen layout.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of users can find an upload action directly below the "Filter by title" input without additional guidance.
- **SC-002**: In validation runs, at least 95% of supported image selections open successfully in the preview modal within 2 seconds.
- **SC-003**: In validation runs, 100% of uploads with applied effects produce a downloaded file that visually matches the modal preview.
- **SC-004**: At least 90% of users can complete the flow "upload -> apply effect -> download" on first attempt.
- **SC-005**: When an uploaded image is active in modal, the "Change Image" action is visible beside Download in 100% of tested sessions.
- **SC-006**: In validation runs, canceling file selection preserves existing preview state in 100% of cases.
- **SC-007**: In mobile viewport validation (320px-768px widths), users can open and close the navbar menu in 100% of test runs.
- **SC-008**: In mobile modal validation, 100% of primary modal actions (Close, Download, Change Image when applicable) remain reachable without layout breakage.
- **SC-009**: No horizontal scrolling is introduced on header/navbar and modal containers across supported mobile viewport tests.
- **SC-010**: In mobile navbar validation, menu state auto-collapses on 100% of link-selection interactions.
- **SC-011**: In mobile modal validation, modal opens in full-screen mode in 100% of supported mobile viewport tests.
- **SC-012**: With mobile modal open, background page scroll remains locked in 100% of validation runs.

## Assumptions

- Existing modal effect controls and download behavior for stock images are already available and can be reused for uploaded images.
- Supported image types follow common browser-openable image formats.
- Upload handling is limited to local, session-based usage and does not require account-level persistence.
- "Change Image" replaces the current uploaded image in the active modal session rather than opening multiple uploaded images at once.
- Existing stock image browsing and filtering behavior remains unchanged unless an uploaded image flow is actively used.
- Responsive behavior targets viewport widths from 320px through 768px for mobile mode.
- Full-screen modal behavior applies only to mobile viewport mode; desktop retains dialog-style presentation.
