# Data Model: Modern Stock Images Experience

## Entity: Image

- Purpose: Represents a stock image available for browsing, modal viewing, and downloading.
- Fields:
  - `id` (string): Unique stable identifier.
  - `title` (string): User-visible name used for search/filter.
  - `thumbnailUrl` (string): Small preview image source for grid cards.
  - `fullImageUrl` (string): Large image source for modal preview.
  - `downloadUrl` (string): Asset URL used by download action.
  - `isPopular` (boolean): Marks inclusion in landing popular collection.
  - `tags` (string[]): Optional keywords to support future discovery enhancements.
  - `altText` (string): Accessible description for assistive technologies.
- Validation rules:
  - `id`, `title`, `thumbnailUrl`, `fullImageUrl`, and `downloadUrl` are required.
  - `title` must be non-empty after trimming whitespace.
  - URL fields must be valid relative or absolute URLs.

## Entity: Favorite

- Purpose: Represents an image selected by user for persistent local favorites.
- Fields:
  - `imageId` (string): Reference to `Image.id`.
  - `favoritedAt` (string, ISO timestamp): Time when image was added.
- Validation rules:
  - `imageId` must map to an existing `Image.id`.
  - Duplicate `imageId` records are not allowed.

## Entity: FAQ Item

- Purpose: Represents one FAQ row displayed on FAQ page.
- Fields:
  - `id` (string): Unique identifier.
  - `question` (string): Prompt shown to users.
  - `answer` (string): Explanatory content.
  - `displayOrder` (number): Sort sequence.
- Validation rules:
  - `question` and `answer` are required and non-empty.
  - `displayOrder` values should be unique and sortable.

## Entity: About Content

- Purpose: Represents static about page content.
- Fields:
  - `title` (string): Heading for about page.
  - `sections` (array): Content blocks containing `heading` and `body` strings.
- Validation rules:
  - At least one section must exist.
  - Each section must include both heading and body text.

## Relationships

- `Favorite.imageId` -> `Image.id` (many favorites to one image reference, unique per image in favorites set).
- FAQ and About content are standalone informational entities and do not reference images.

## State Transitions

- Favorite state:
  - `not_favorited` -> `favorited` when user adds favorite.
  - `favorited` -> `not_favorited` when user removes favorite.
- Modal state:
  - `closed` -> `open(imageId)` when user selects an image.
  - `open(imageId)` -> `closed` when user closes modal or navigates back.
