# stock-app Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-09

## Active Technologies
- JavaScript (ES2022) / React 18.3 + React Router v6.30, Tailwind CSS v3.4, Vite 5.4, JSZip 3.x (new addition) (002-bulk-download-zip)
- None — selection state is in-memory only; no persistence required (002-bulk-download-zip)
- JavaScript (ES2022+) with React 18 + React, React Router v6, Tailwind CSS, JSZip 3.x (new dependency) (002-bulk-download-zip)
- In-memory React Context (resets on navigation); no persistence needed for selections (002-bulk-download-zip)
- JavaScript (ES2022+) with React 18 + React, React Router v6, Tailwind CSS (no mandatory new package expected) (003-image-preview-controls)
- N/A (session-only modal state in React component state) (003-image-preview-controls)
- JavaScript (ES2022), JSX via React 18 + React 18, React Router v6, Tailwind CSS v3.4, Vite 5.4 (004-landing-page-redesign)
- `localStorage` via existing `favorites-store.js` (no change) (004-landing-page-redesign)
- JavaScript (ES2022), JSX via React 18 + React 18, React Router v6, Vite 5.4, existing in-repo image utilities (`download-image`, `render-image-with-effects`) (005-local-image-upload-effects)
- In-memory React state for uploaded image session + browser object URLs (revoked on replacement/close); existing `localStorage` usage unchanged (005-local-image-upload-effects)
- JavaScript (ES2022) + React 18.3 + `react`, `react-dom`, `react-router-dom`, `vite`, `tailwindcss`, `jszip` (005-local-image-upload-effects)
- Browser memory for upload session state + object URLs; existing favorites persistence remains unchanged (005-local-image-upload-effects)
- JavaScript (ES2022) + React 18.3 + `react`, `react-dom`, `react-router-dom`, `@clerk/clerk-react`, `vite`, `tailwindcss` (006-clerk-auth-buttons)
- N/A for feature-owned persistence; provider-managed session state in browser context (006-clerk-auth-buttons)

- JavaScript (ES2022+) with React.js + React.js, React Router (route-based pages + modal overlay pattern), Tailwind CSS (001-modern-stock-gallery)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

npm test && npm run lint

## Code Style

JavaScript (ES2022+) with React.js: Follow standard conventions

## Recent Changes
- 006-clerk-auth-buttons: Added JavaScript (ES2022) + React 18.3 + `react`, `react-dom`, `react-router-dom`, `@clerk/clerk-react`, `vite`, `tailwindcss`
- 005-local-image-upload-effects: Added JavaScript (ES2022) + React 18.3 + `react`, `react-dom`, `react-router-dom`, `vite`, `tailwindcss`, `jszip`
- 005-local-image-upload-effects: Added JavaScript (ES2022), JSX via React 18 + React 18, React Router v6, Vite 5.4, existing in-repo image utilities (`download-image`, `render-image-with-effects`)


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
