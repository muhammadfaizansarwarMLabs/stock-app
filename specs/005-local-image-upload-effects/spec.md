# Feature Specification: Local Image Upload Effects

**Feature Branch**: `005-local-image-upload-effects`  
**Created**: 2026-04-03  
**Status**: Draft  
**Input**: User description: "I want to add a button just below the Filter by title input to upload image from laptop/device, open uploaded image in the same preview modal used for stock images, let user apply effects and download the effected image, and show a Change Image button beside Download when uploaded image is open."

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

### Edge Cases

- User selects a non-image file type from the device chooser.
- User selects a very large image file and preview loading takes longer than usual.
- User uploads an image, applies effects, then chooses a new image; prior effect state handling must be consistent and predictable.
- User tries to download before the uploaded image preview is fully ready.
- User starts changing image repeatedly and cancels one or more file chooser attempts.
- User closes the modal during an upload-change workflow and reopens it from upload control.

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

### Key Entities *(include if feature involves data)*

- **Uploaded Image**: A user-selected local image file intended for modal preview, effects adjustment, and download.
- **Preview Session**: The active modal state containing the current image source (stock or uploaded), effect settings, and action availability.
- **Modal Action State**: Context that determines when Download and "Change Image" are shown and enabled.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of users can find an upload action directly below the "Filter by title" input without additional guidance.
- **SC-002**: In validation runs, at least 95% of supported image selections open successfully in the preview modal within 2 seconds.
- **SC-003**: In validation runs, 100% of uploads with applied effects produce a downloaded file that visually matches the modal preview.
- **SC-004**: At least 90% of users can complete the flow "upload -> apply effect -> download" on first attempt.
- **SC-005**: When an uploaded image is active in modal, the "Change Image" action is visible beside Download in 100% of tested sessions.
- **SC-006**: In validation runs, canceling file selection preserves existing preview state in 100% of cases.

## Assumptions

- Existing modal effect controls and download behavior for stock images are already available and can be reused for uploaded images.
- Supported image types follow common browser-openable image formats.
- Upload handling is limited to local, session-based usage and does not require account-level persistence.
- "Change Image" replaces the current uploaded image in the active modal session rather than opening multiple uploaded images at once.
- Existing stock image browsing and filtering behavior remains unchanged unless an uploaded image flow is actively used.
