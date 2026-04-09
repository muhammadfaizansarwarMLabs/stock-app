# Implementation Plan: Header Auth Buttons

**Branch**: `006-clerk-auth-buttons` | **Date**: 2026-04-09 | **Spec**: `/specs/006-clerk-auth-buttons/spec.md`
**Input**: Feature specification from `/specs/006-clerk-auth-buttons/spec.md`

## Summary

Add responsive header authentication controls beside the existing theme toggle using React and Clerk in a frontend-only architecture. Signed-out users get in-page modal-overlay Sign Up/Log In actions; signed-in users get avatar/menu plus Sign Out; invalid configuration yields a disabled `Authentication unavailable` state. No backend code or database changes are introduced.

## Technical Context

**Language/Version**: JavaScript (ES2022) + React 18.3  
**Primary Dependencies**: `react`, `react-dom`, `react-router-dom`, `@clerk/clerk-react`, `vite`, `tailwindcss`  
**Storage**: N/A for feature-owned persistence; provider-managed session state in browser context  
**Testing**: Vitest + React Testing Library + manual responsive/accessibility/auth-flow checklist  
**Target Platform**: Modern desktop and mobile browsers (responsive SPA)  
**Project Type**: Single-project frontend web app  
**Performance Goals**: Header remains responsive during auth state changes; auth overlays open without perceptible lag; no regressions to existing interactive flows  
**Constraints**: Static-first delivery, no custom backend auth routes, no database usage, preserve route context while overlays are open, email/password-only in v1  
**Scale/Scope**: Existing stock gallery app-wide header behavior across routed pages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Static-First Delivery**: PASS. Feature is client-side React + provider SDK only.
- **II. Browsing and Filtering**: PASS. Header auth additions do not alter filtering behavior.
- **III. Image Viewing and Download**: PASS. No changes to modal image viewing/download core flow.
- **IV. Favorites Management**: PASS. No changes to favorites add/remove/list behavior.
- **V. Basic Usability and Accessibility**: PASS with explicit keyboard-accessible controls, modal focus trap, and mobile responsiveness requirements.

Post-Phase-1 recheck: PASS. Research/design artifacts maintain constitution compliance with no unresolved gate violations.

## Project Structure

### Documentation (this feature)

```text
specs/006-clerk-auth-buttons/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── main.jsx
├── app/
│   ├── router.jsx
│   └── providers/
├── components/
│   ├── layout/
│   │   └── AppLayout.jsx
│   └── theme/
│       └── ThemeToggle.jsx
└── styles/
    └── tailwind.css

tests/
├── contract/
├── integration/
└── unit/
```

**Structure Decision**: Keep the current single-project React SPA structure. Implement provider wiring at app bootstrap/provider layer, add a focused header auth control slice in layout components, and keep behavior covered by unit/integration/contract tests plus manual responsive checks.

## Complexity Tracking

No constitution violations identified; complexity tracking not required.

## Implementation Notes

- Clerk provider bootstrapping added in `src/main.jsx` with environment-based config guard.
- Header auth controls are integrated in `src/components/layout/AppLayout.jsx` beside `ThemeToggle`.
- Auth UI components were added under `src/components/auth/` for signed-out, signed-in, and unavailable states.
- Email/password-only v1 scope is enforced via config guard (`VITE_CLERK_V1_METHODS=email_password`) and documented in quickstart/provider setup notes.
- Build validation completed successfully on 2026-04-09.
