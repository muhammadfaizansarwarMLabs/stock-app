# Quickstart: Modern Stock Images Experience

## Goal

Run and validate the static React + Tailwind stock image app with mocked embedded data.

## Prerequisites

- Node.js 18+
- npm 9+

## Setup

1. Install dependencies.
2. Start development server.
3. Open local app URL in browser.

Example commands:

```bash
npm install
npm run dev
```

## Manual Validation Checklist

1. Landing page
- Open `/` and verify popular image grid appears.
- Verify overall visual treatment appears modern and responsive.

2. Title filtering
- Enter partial and mixed-case title text.
- Verify grid updates instantly with matching images only.
- Verify no-results message appears for unmatched query.

3. Modal + same-route behavior
- Click an image to open modal with larger preview.
- Verify route context remains the originating page.
- Close modal and verify previous filter/grid state remains.

4. Download
- In modal, use download action.
- Verify image download starts.
- Simulate broken image URL and verify recoverable error messaging.

5. Favorites
- Add image to favorites from browsing flow.
- Open `/favorites` and verify image appears.
- Remove image and verify it disappears.
- Refresh browser and verify favorites persistence in same browser/device.

6. Static info pages
- Open `/about` and `/faq` from navigation.
- Verify embedded content renders correctly.

7. Accessibility + responsiveness
- Navigate key controls via keyboard.
- Verify controls have clear labels.
- Validate layouts on mobile and desktop viewport sizes.

## Test Execution Guidance

If automated tests are added:

```bash
npm run test
```

Core automated coverage should include:
- Title filter behavior
- Modal open/close and same-route restoration
- Favorites add/remove and persistence
- Route rendering for About/FAQ/Favorites

## Implementation Validation Log

- 2026-03-30: `npm install` completed successfully (Node 18 warning for optional newer plugin engine, non-blocking).
- 2026-03-30: `npm run build` completed successfully and produced static assets in `dist/`.
- 2026-03-30: Manual UI checklist remains available above for browser verification on desktop and mobile viewports.
