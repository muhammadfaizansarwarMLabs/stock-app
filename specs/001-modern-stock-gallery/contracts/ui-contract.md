# UI Contract: Modern Stock Images Experience

## Overview

This contract defines user-visible routes, interactions, and behavior guarantees for the static React + Tailwind app.

## Route Contract

### `/` (Landing)

- Responsibilities:
  - Show popular stock image grid from embedded mock data.
  - Provide title filter input that updates visible results without reload.
  - Provide navigation to Favorites, About, and FAQ pages.
- Required states:
  - Default populated grid state.
  - No-results state when filter has no matches.
  - Empty-data state when dataset is empty.

### `/favorites`

- Responsibilities:
  - Show current favorites list.
  - Allow removal of favorites at any time.
- Required states:
  - Populated favorites list.
  - Empty-favorites state.

### `/about`

- Responsibilities:
  - Show static about content sourced from embedded mock content.

### `/faq`

- Responsibilities:
  - Show static FAQ list sourced from embedded mock content.

## Modal Interaction Contract

- Trigger: User selects image card from landing/favorites image surfaces.
- Behavior:
  - Opens large image preview modal over current route context.
  - Provides download action for selected image.
  - Provides keyboard and pointer-accessible close action.
  - Closing modal returns user to prior page context without losing filter state.

## Favorites Contract

- Add favorite:
  - Available from image browsing surfaces.
  - Must create one unique favorite entry per image.
- Remove favorite:
  - Available from favorites list and any favorited image surface where represented.
- Persistence:
  - Favorites persist across refreshes and revisits in same browser/device.

## Download Contract

- Download action begins transfer of selected image asset.
- On recoverable failure, user receives a visible error message and remains in modal context.

## Accessibility Contract

- Keyboard operability required for filter input, modal open/close, favorite toggle, and download action.
- Interactive controls must have clear accessible labels.
- Image elements must include meaningful alt text.

## Responsive Contract

- Layout supports both mobile and desktop viewport sizes.
- Grid and modal remain functional and readable across breakpoints.
