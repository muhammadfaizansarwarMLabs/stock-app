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

## Relationships

- `UploadedImageSource` is transformed into `ModalImageSource` before modal render.
- `ModalImageSource.isUploaded` drives `ModalActionState.showChangeImage`.
- Existing effect state in `ImageModal` applies equally to both stock and uploaded `ModalImageSource`.

## State Transitions

### Upload Open Flow

`Idle Landing` -> user selects valid image -> `UploadedImageSource created` -> `ModalImageSource(isUploaded=true)` -> `Modal open`

### Change Image Flow

`Uploaded modal active` -> user clicks Change Image -> selects valid image -> previous object URL revoked -> new `UploadedImageSource` -> modal preview swaps source

### Cancel Flow

`File picker opened` -> cancel -> no state mutation

### Invalid File Flow

`File selected` + invalid MIME -> set validation error -> modal source unchanged

## Validation Rules

- Only files with MIME type matching `image/*` are accepted.
- Canceling picker (no file selected) is a no-op.
- On replace/cleanup, previously generated object URL must be revoked.
- `Change Image` visibility is conditional on uploaded source only.
