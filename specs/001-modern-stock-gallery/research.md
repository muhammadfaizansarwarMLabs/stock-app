# Phase 0 Research: Modern Stock Images Experience

## Decision 1: Frontend Framework and Styling Stack

- Decision: Use React.js for UI composition and Tailwind CSS for styling.
- Rationale: Matches explicit user constraints, supports reusable components, and enables a sleek, responsive interface with rapid iteration.
- Alternatives considered:
  - Vanilla HTML/CSS/JS: simpler dependency footprint, but slower for managing modal routing/state and reusable page components.
  - Next.js static export: strong tooling, but unnecessary framework overhead for this small static-only scope.

## Decision 2: Routing and Same-Route Modal Behavior

- Decision: Use client-side routing with a background-location modal pattern so image detail appears as an overlay while preserving the originating route context.
- Rationale: Directly satisfies "open in modal on same route" requirement and keeps filter/grid state visible when modal closes.
- Alternatives considered:
  - Separate dedicated detail route only: easier deep-linking but violates same-route overlay expectation.
  - Local component-only modal state without router awareness: simple, but weaker navigation/back-button consistency.

## Decision 3: Data Source Strategy

- Decision: Use embedded mock datasets in local static content modules (images, About copy, FAQ entries).
- Rationale: Meets no-backend and no-real-feed constraints while keeping implementation deterministic and easy to test.
- Alternatives considered:
  - External mock API service: closer to production API shape, but adds unnecessary network dependency.
  - JSON fetched from static files: workable, but module imports provide simpler type-safe usage and bundler validation.

## Decision 4: Favorites Persistence

- Decision: Persist favorites in browser localStorage for same-browser/device continuity.
- Rationale: Aligns with clarified requirement that favorites survive refresh and revisits without authentication.
- Alternatives considered:
  - Session storage: loses state across browser restarts, not acceptable for clarified behavior.
  - In-memory only: resets on refresh and fails requirement.

## Decision 5: Testing Strategy

- Decision: Use Vitest + React Testing Library for unit/integration coverage of filter, modal, favorites persistence, and page navigation behavior.
- Rationale: Fast feedback for React UI and behavior-focused tests consistent with specification acceptance scenarios.
- Alternatives considered:
  - Jest: equivalent capability, but Vitest generally offers faster startup in modern frontend tooling.
  - Manual-only testing: insufficient repeatability for behavior-critical flows.

## Decision 6: Responsive and Accessibility Baseline

- Decision: Treat mobile responsiveness and keyboard operability as first-class requirements in component design and acceptance checks.
- Rationale: Constitution requires desktop/mobile function and keyboard-accessible controls.
- Alternatives considered:
  - Desktop-first with later mobile pass: increases rework and risk of failing constitutional gate.
  - Visual-only focus: does not satisfy accessibility requirement.
