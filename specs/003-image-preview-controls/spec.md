# Feature Specification: Image Preview Controls and Effects-Aware Download

**Feature Branch**: `003-image-preview-controls`  
**Created**: 2026-04-01  
**Status**: Draft (amended 2026-04-01 — additional effects added)  
**Input**: User description: "i want to update model that is using to preview the image. use cross icon at top right instead of button with close text. add + and - icon buttons beside the download to zoom in and zoom out the preview image . there should be a slider to increase and decrese the opacity of the image. and the download button should download the effected image if user use the effects (oppacity, zoom), otherwise download the original image"
**Amendment**: "add Brightness, Contrast, Blur, Grayscale, Rotate Image, Flip Image. Set all buttons and effects below the opacity slider and make that slider a little bit small"

## Clarifications

### Session 2026-04-01

- Q: For effects-applied download, what output sizing rule should be used? -> A: Export transformed image at the original image dimensions.
- Q: What output format rule should be used for effects-applied downloads? -> A: Keep original format when unchanged; use PNG when effects are applied.
- Q: For zoom rendering, what anchor point should be used when scaling? -> A: Apply zoom from image center (scale around center point) for both modal preview and exported output.
- Q: What numeric step and range should define zoom behavior? -> A: 10% step per click, zoom range 50%–200%.

### Session 2026-04-01 (Amendment)

- Q: When rotation and flip are both active, in what order should transforms be composed for canvas export? -> A: Rotate first, then flip (matches browser CSS transform order so export matches preview).
- Q: Should a reset mechanism exist for effect controls? -> A: Both a single "Reset All" button (resets every control to default) AND individual per-effect reset icons beside each slider/control.
- Q: What layout structure should the effects panel use? -> A: Two-column labeled slider grid for filter sliders (opacity, brightness, contrast, blur, grayscale); separate button row below for rotate, flip H, flip V, and Reset All.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Improved Modal Controls (Priority: P1)

A user opening an image preview modal wants a cleaner close control and direct visual controls to zoom the preview image in and out while staying in the modal.

**Why this priority**: Modal usability is the primary interaction point for image preview. If close and zoom controls are not intuitive, the preview experience fails even before download behavior is considered.

**Independent Test**: Open any image modal, close it via a top-right cross icon, reopen it, and use plus/minus controls to change the visible zoom level of the preview image.

**Acceptance Scenarios**:

1. **Given** the image modal is open, **When** the user looks at the top-right corner, **Then** a cross icon close control is shown instead of a text "Close" button.
2. **Given** the image modal is open, **When** the user clicks the cross icon, **Then** the modal closes.
3. **Given** the image modal is open, **When** the user clicks the plus icon, **Then** the preview image zoom level increases.
4. **Given** the image modal is open, **When** the user clicks the minus icon, **Then** the preview image zoom level decreases.

---

### User Story 2 - Opacity and Filter Adjustments While Previewing (Priority: P2)

A user wants to adjust image opacity, brightness, contrast, blur, and grayscale using sliders to preview visual changes before deciding to download. All effect controls are grouped below the image preview for easy access.

**Why this priority**: These CSS-filter-style effects expand the preview from passive viewing to active real-time tuning, and are all sliders sharing the same interaction pattern.

**Independent Test**: Open image modal; adjust each slider (opacity, brightness, contrast, blur, grayscale) across its range and verify the preview updates immediately for every change.

**Acceptance Scenarios**:

1. **Given** the image modal is open, **When** the user views the effects panel below the image, **Then** a compact opacity slider is visible along with brightness, contrast, blur, and grayscale sliders.
2. **Given** any effect slider is moved, **When** the value changes, **Then** the preview image updates in real time to reflect the new value.
3. **Given** all sliders are at their default values, **When** the user looks at the preview, **Then** the image appears exactly as the original.
4. **Given** the opacity slider, **When** slid fully to the left, **Then** the image becomes fully transparent; fully to the right, fully opaque.
5. **Given** the brightness slider, **When** slid below the default (100%), **Then** the image darkens; above default, the image brightens.
6. **Given** the contrast slider, **When** slid below the default (100%), **Then** contrast decreases; above default, contrast increases.
7. **Given** the blur slider, **When** moved above zero, **Then** the image becomes progressively blurred.
8. **Given** the grayscale slider, **When** moved from 0% to 100%, **Then** the image transitions from full color to full grayscale.

---

### User Story 3 - Effects-Aware Download Output (Priority: P3)

A user wants downloaded output to match what they previewed when any effect is applied, and to stay original when no effects are used.

**Why this priority**: Download fidelity matters for user trust. Users expect the file to reflect the visual adjustments they made.

**Independent Test**: Download one image without changing any controls and verify it matches original output; then apply one or more effects (zoom, opacity, brightness, contrast, blur, grayscale, rotate, flip) and download again to verify the downloaded file reflects all modifications.

**Acceptance Scenarios**:

1. **Given** the user has not changed any effect, **When** they click Download, **Then** the original image file is downloaded.
2. **Given** the user has changed one or more effects, **When** they click Download, **Then** the downloaded image reflects all applied preview effects.
3. **Given** the user modifies effects and then returns all controls to defaults, **When** they click Download, **Then** the original image output is downloaded.

### User Story 4 - Geometric Transform Controls: Rotate and Flip (Priority: P2)

A user wants to rotate the image or flip it horizontally/vertically while previewing, and have those transforms included in a downloaded effects-applied output.

**Why this priority**: Rotate and flip are transform-style effects distinct from filter sliders; they require their own button controls but share the same effects panel and download pipeline.

**Independent Test**: Open image modal; click rotate clockwise multiple times and verify image rotates in 90° steps; click flip horizontal and verify image mirrors horizontally; verify all transforms appear in effects-applied download.

**Acceptance Scenarios**:

1. **Given** the effects panel is open, **When** the user clicks the rotate clockwise button, **Then** the preview image rotates 90° clockwise.
2. **Given** the image has been rotated, **When** the user clicks rotate again, **Then** the rotation advances a further 90° (cycle: 0° → 90° → 180° → 270° → 0°).
3. **Given** the effects panel is open, **When** the user clicks the flip horizontal button, **Then** the preview image is mirrored horizontally.
4. **Given** the effects panel is open, **When** the user clicks the flip vertical button, **Then** the preview image is mirrored vertically.
5. **Given** flip horizontal is active and the user clicks it again, **When** the toggle fires, **Then** the flip is removed and the image reverts to its un-flipped state.

---

- What happens when user repeatedly clicks zoom-in beyond the supported limit? -> Zoom is capped at a defined maximum and does not increase further.
- What happens when user repeatedly clicks zoom-out beyond the supported minimum? -> Zoom is capped at a defined minimum and does not decrease further.
- What happens when opacity slider is at minimum or maximum? -> Preview remains stable and downloadable output matches those boundary values.
- What happens when brightness or contrast slider is at minimum (0%) or maximum (200%)? -> Preview reflects the extreme value; export captures the same extreme.
- What happens when blur is at maximum? -> Preview shows maximum blur; export captures the same blur level.
- What happens when rotate is clicked from 270°? -> Rotation wraps to 0° (full cycle completed).
- What happens when flip horizontal is toggled twice? -> The two flips cancel each other and the image returns to its original orientation.
- What happens when user closes and reopens the modal? -> All effects (zoom, opacity, brightness, contrast, blur, grayscale, rotate, flip) reset to default values for the newly opened preview session.
- What happens if creating the effects-applied download fails? -> User receives a clear error message and can retry download.
- What happens when the user clicks "Reset All" while download is in progress? -> Reset All is available at any time; it only affects local state and does not cancel an in-progress download.
- What happens when a per-effect reset icon is clicked while other effects are still active? -> Only that specific effect resets to its default; all other effects remain unchanged.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The image preview modal MUST replace the text-based close button with a top-right cross icon close control.
- **FR-002**: The cross icon close control MUST close the modal and be keyboard-accessible.
- **FR-003**: The modal action area MUST include a zoom-in icon button and zoom-out icon button displayed beside the download control.
- **FR-004**: Clicking zoom-in MUST increase preview zoom by 10% per click up to a maximum of 200%; additional clicks at the ceiling MUST have no effect.
- **FR-005**: Clicking zoom-out MUST decrease preview zoom by 10% per click down to a minimum of 50%; additional clicks at the floor MUST have no effect.
- **FR-006**: The modal MUST include a compact opacity slider that allows users to adjust preview opacity between fully transparent (0%) and fully opaque (100%) bounds.
- **FR-007**: Changes to any effect control (zoom, opacity, brightness, contrast, blur, grayscale, rotate, flip) MUST update the preview image in real time while the modal remains open.
- **FR-008**: If all effect controls remain at their default values, the Download action MUST return the original image output.
- **FR-009**: If any effect control differs from its default value, the Download action MUST return an image output that reflects all applied effects while preserving the original image dimensions.
- **FR-010**: If the user restores all controls to their default values before download, the Download action MUST return the original image output.
- **FR-011**: Download errors for both original and effects-applied outputs MUST be communicated with a clear user-visible message in the modal.
- **FR-012**: Opening a new modal preview session MUST start with all effect controls at their respective default values.
- **FR-013**: If all effect controls remain at default values, download format MUST remain the original output format.
- **FR-014**: If any effect control is changed from its default, effects-applied download output MUST be exported as PNG.
- **FR-015**: Zoom scaling in both the modal preview and effects-applied export MUST use the image center as the anchor point, so content expands/shrinks symmetrically from the center.
- **FR-016**: The effects panel MUST include a brightness slider with a range of 0%–200% and a default of 100%; changes MUST update the preview in real time.
- **FR-017**: The effects panel MUST include a contrast slider with a range of 0%–200% and a default of 100%; changes MUST update the preview in real time.
- **FR-018**: The effects panel MUST include a blur slider with a range of 0–10px and a default of 0px; changes MUST update the preview in real time.
- **FR-019**: The effects panel MUST include a grayscale slider with a range of 0%–100% and a default of 0%; changes MUST update the preview in real time.
- **FR-020**: The effects panel MUST include a rotate clockwise button that rotates the preview image 90° clockwise per click, cycling through 0°, 90°, 180°, 270°, and back to 0°.
- **FR-021**: The effects panel MUST include a flip horizontal toggle button; each click alternates between flipped and un-flipped horizontal state.
- **FR-022**: The effects panel MUST include a flip vertical toggle button; each click alternates between flipped and un-flipped vertical state.
- **FR-025**: When composing rotation and flip transforms together (in preview CSS and canvas export), rotation MUST be applied first and flip MUST be applied second, so that the exported PNG visually matches the modal preview.
- **FR-026**: The effects panel MUST include a "Reset All" button that restores every effect control (zoom, opacity, brightness, contrast, blur, grayscale, rotation, flip H, flip V) to its default value in a single interaction.
- **FR-027**: Each individual effect control (each slider and each toggle button) MUST display a per-effect reset icon that resets only that control to its default value when clicked.
- **FR-028**: The effects panel layout MUST use a two-column labeled grid for all filter sliders (opacity, brightness, contrast, blur, grayscale), with a separate button row below containing rotate clockwise, flip horizontal, flip vertical, and Reset All controls.
- **FR-023**: All effect controls (zoom buttons, opacity slider, brightness slider, contrast slider, blur slider, grayscale slider, rotate button, flip buttons) MUST be displayed below the image preview in a grouped effects panel.
- **FR-024**: The opacity slider MUST be rendered in a compact form, visually smaller than standard full-width sliders, to reduce its visual weight relative to other controls.

### Key Entities

- **PreviewTransformState**: The current per-modal preview settings including zoom level, opacity, brightness, contrast, blur, grayscale, rotation angle, flipH flag, and flipV flag — plus default values for each, used to determine whether any effects are active.
- **PreviewDownloadMode**: The decision state for download output (`original` when all controls are at defaults, `effects-applied` when any control differs from its default).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of modal sessions show a cross icon close control in the top-right corner, and users can close the modal with one interaction.
- **SC-002**: Users can complete a zoom-in and zoom-out adjustment sequence within 10 seconds in a single modal session. Zoom increments 10% per click, bounded at 50% (min) and 200% (max).
- **SC-003**: Preview updates for all effect controls (zoom, opacity, brightness, contrast, blur, grayscale, rotate, flip) appear with no perceptible lag during user interaction.
- **SC-004**: In validation runs, downloaded output matches expected mode behavior in all cases: original when all controls are default, effects-applied when any control is changed, and transformed exports preserve original image dimensions.
- **SC-005**: At least 95% of test users can complete "open modal -> adjust one or more effects -> download" without external guidance.
- **SC-006**: In validation runs, file format behavior matches rules in all cases: original format for unchanged downloads and PNG for effects-applied downloads.
- **SC-007**: All effect controls are visible in a grouped panel below the image preview with no horizontal overflow on desktop viewports at 1280px width. Filter sliders render in a two-column labeled grid; rotate, flip, and Reset All render in a dedicated button row below the slider grid.
- **SC-008**: Rotate produces exactly 90° increments per click (0°, 90°, 180°, 270°, 0°); flip toggles are stateful and independently reversible.
- **SC-009**: Clicking "Reset All" restores every effect to its default in one interaction and the preview updates immediately. Clicking a per-effect reset icon restores only that effect while all others remain unchanged.

## Assumptions

- The feature applies only to the existing image preview modal flow and does not alter gallery-level bulk download behavior.
- All effects are session-scoped and reset when the modal is closed and reopened.
- Effects-applied download can be generated client-side from the previewed image without adding backend services.
- Existing image sources remain accessible for both original and transformed download workflows.
- Existing modal layout has enough space to accommodate a grouped effects panel below the image preview on desktop and mobile viewports.
- Effects-applied export uses the original image dimensions as the output canvas size.
- The source image may be JPEG, but transformed exports use PNG when any preview effect is active.
- Zoom transformations use the image center as the anchor point for scaling in both live preview and canvas export.
- Zoom step is 10% per click; minimum zoom is 50%, maximum is 200%.
- Brightness and contrast use CSS `filter` with a 0%–200% range (100% = no change); blur uses `blur(0px–10px)` (0px = no change); grayscale uses `grayscale(0%–100%)` (0% = no change).
- Rotation is applied as a CSS transform in 90° clockwise steps (0°, 90°, 180°, 270°); flip uses `scaleX(-1)` / `scaleY(-1)` transforms.
- When rotation and flip are combined, rotation is applied first and flip second, in both CSS preview transform and canvas export matrix operations.
- Canvas export combines all active CSS filters and transforms when generating the effects-applied PNG output.
- Flip horizontal and flip vertical are independent toggles; both can be active simultaneously.
