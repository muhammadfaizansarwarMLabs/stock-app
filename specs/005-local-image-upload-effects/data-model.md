# Data Model: Local Image Upload Effects

**Feature**: 005-local-image-upload-effects  
**Phase**: 1 - Design  
**Date**: 2026-04-03

## Entities

### UploadedImageSource

Represents the currently selected local device image while user is in upload workflow.

| Field | Type | Description |
|------|------|-------------|
| `fileName` | `string` | Original local filename for display/download naming |
| `mimeType` | `string` | Browser-provided MIME type used for validation |
| `objectUrl` | `string` | `blob:` URL used for preview and direct unchanged download |
| `title` | `string` | Derived display title (from file name, normalized) |
| `altText` | `string` | Accessible alt text for preview (derived fallback) |
| `tags` | `string[]` | Empty/default tags set for uploaded images (no catalog tags) |
| `isUploaded` | `boolean` | Source discriminator (`true` for uploaded image) |

### ModalImageSource

Normalized image object consumed by `ImageModal`, representing either stock data image or uploaded image.

| Field | Type | Description |
|------|------|-------------|
| `id` | `string` | Stable identifier (`catalog id` or generated upload id) |
| `title` | `string` | Display title shown in modal |
| `fullImageUrl` | `string` | Primary preview URL |
| `downloadUrl` | `string` | URL used by download utility |
| `altText` | `string` | Image alternative text |
| `tags` | `string[]` | Tag metadata shown in modal footer |
| `isUploaded` | `boolean` | Determines upload-specific controls visibility |

### ModalActionState

Controls visibility and behavior of modal action buttons.

| Field | Type | Default | Description |
|------|------|---------|-------------|
| `busy` | `boolean` | `false` | Download in-progress state |
| `error` | `string` | `""` | Download/validation message |
| `showChangeImage` | `boolean` | `false` | True only when `ModalImageSource.isUploaded` |

### NavigationMenuState

Controls expanded/collapsed behavior for mobile navbar navigation.

| Field | Type | Default | Description |
|------|------|---------|-------------|
| `isMobileMenuOpen` | `boolean` | `false` | Whether nav links are visible in mobile menu mode |
| `breakpoint` | `number` | `768` | Mobile behavior threshold (`<=768px`) |

### ModalViewportMode

Determines modal presentation layout by viewport size.

| Field | Type | Default | Description |
|------|------|---------|-------------|
| `isMobileViewport` | `boolean` | runtime-derived | `true` when viewport width is `<=768px` |
| `isFullscreenModal` | `boolean` | runtime-derived | Mobile full-screen modal mode flag |
| `isBackgroundScrollLocked` | `boolean` | `false` | Locked while mobile full-screen modal is open |

## Relationships

- `UploadedImageSource` is transformed into `ModalImageSource` before modal render.
- `ModalImageSource.isUploaded` drives `ModalActionState.showChangeImage`.
- Existing effect state in `ImageModal` applies equally to both stock and uploaded `ModalImageSource`.
- `NavigationMenuState` controls responsive nav visibility and must reset to closed on mobile link selection.
- `ModalViewportMode` controls whether modal renders as desktop dialog or full-screen mobile overlay.

## State Transitions

### Upload Open Flow

`Idle Landing` -> user selects valid image -> `UploadedImageSource created` -> `ModalImageSource(isUploaded=true)` -> `Modal open`

### Change Image Flow

`Uploaded modal active` -> user clicks Change Image -> selects valid image -> previous object URL revoked -> new `UploadedImageSource` -> modal preview swaps source

### Cancel Flow

`File picker opened` -> cancel -> no state mutation

### Invalid File Flow

`File selected` + invalid MIME -> set validation error -> modal source unchanged

### Mobile Navbar Flow

`Mobile header rendered (<=768px)` -> `isMobileMenuOpen=false` -> user toggles menu -> `isMobileMenuOpen=true` -> user selects nav link -> `isMobileMenuOpen=false`

### Mobile Modal Flow

`Modal opens at <=768px` -> `isFullscreenModal=true` + `isBackgroundScrollLocked=true` -> user interacts/scrolls inside modal -> modal closes -> `isBackgroundScrollLocked=false`

## Validation Rules

- Only files with MIME type matching `image/*` are accepted.
- Canceling picker (no file selected) is a no-op.
- On replace/cleanup, previously generated object URL must be revoked.
- `Change Image` visibility is conditional on uploaded source only.
- Mobile menu state must auto-collapse after nav link activation.
- Mobile full-screen modal behavior and scroll lock apply only at viewport widths `<=768px`.
