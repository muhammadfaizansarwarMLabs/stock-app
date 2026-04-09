# Tasks: Header Auth Buttons

**Input**: Design documents from `/specs/006-clerk-auth-buttons/`
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/ui-contract.md`, `quickstart.md`

**Tests**: No explicit TDD/test-first requirement was requested in the feature spec, so this task list focuses on implementation and validation tasks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare dependencies and provider bootstrapping for frontend-only Clerk auth.

- [X] T001 Add Clerk React dependency in `package.json`
- [X] T002 [P] Add Clerk publishable key template in `.env.example`
- [X] T003 [P] Create Clerk runtime config helper in `src/app/providers/clerk-config.js`
- [X] T004 Wire `ClerkProvider` app bootstrap in `src/main.jsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build shared auth UI primitives and layout integration points required by all stories.

**CRITICAL**: No user story work should begin until this phase is complete.

- [X] T005 Create header auth controls component scaffold in `src/components/auth/HeaderAuthControls.jsx`
- [X] T006 [P] Create unavailable-state component in `src/components/auth/AuthUnavailableState.jsx`
- [X] T007 [P] Create modal overlay trigger component in `src/components/auth/AuthOverlayControls.jsx`
- [X] T008 Integrate auth controls mount point beside theme toggle in `src/components/layout/AppLayout.jsx`
- [X] T009 Add shared auth action-group responsive styles in `src/styles/tailwind.css`

**Checkpoint**: Foundation ready. User story work can begin.

---

## Phase 3: User Story 1 - Access Authentication Actions in Header (Priority: P1) MVP

**Goal**: Show signed-out Sign Up/Log In beside theme toggle, open in-page modals, and handle invalid config with disabled fallback.

**Independent Test**: While signed out, verify Sign Up/Log In are visible beside theme toggle, open in-page overlays without route change, and become disabled `Authentication unavailable` when config is invalid.

### Implementation for User Story 1

- [X] T010 [US1] Implement signed-out Sign Up/Log In button rendering in `src/components/auth/HeaderAuthControls.jsx`
- [X] T011 [US1] Implement Sign Up/Log In modal trigger behavior in `src/components/auth/AuthOverlayControls.jsx`
- [X] T012 [US1] Implement invalid-config fallback state logic in `src/components/auth/HeaderAuthControls.jsx`
- [X] T013 [US1] Render disabled unavailable UI label in `src/components/auth/AuthUnavailableState.jsx`
- [X] T014 [US1] Place header auth controls adjacent to theme toggle in `src/components/layout/AppLayout.jsx`
- [X] T015 [P] [US1] Add mobile/desktop wrapping rules for signed-out actions in `src/styles/tailwind.css`
- [X] T016 [P] [US1] Preserve route context during overlay open/close in `src/components/auth/AuthOverlayControls.jsx`

**Checkpoint**: User Story 1 should be functional and independently verifiable.

---

## Phase 4: User Story 2 - Respect Signed-In State in Header (Priority: P1)

**Goal**: Replace signed-out controls with avatar/menu and explicit Sign Out action when authenticated.

**Independent Test**: Sign in and verify signed-out controls are replaced with avatar/menu + Sign Out; sign out and verify Sign Up/Log In are restored without page reload.

### Implementation for User Story 2

- [X] T017 [US2] Implement authenticated-user state rendering in `src/components/auth/HeaderAuthControls.jsx`
- [X] T018 [US2] Add avatar/menu control rendering in `src/components/auth/HeaderAuthControls.jsx`
- [X] T019 [US2] Add explicit Sign Out action behavior in `src/components/auth/HeaderAuthControls.jsx`
- [X] T020 [US2] Ensure signed-out controls are hidden while authenticated in `src/components/auth/HeaderAuthControls.jsx`
- [X] T021 [US2] Ensure signed-in action layout remains aligned with theme toggle in `src/components/layout/AppLayout.jsx`

**Checkpoint**: User Story 2 should be functional and independently verifiable.

---

## Phase 5: User Story 3 - Frontend-Only Authentication Experience (Priority: P2)

**Goal**: Keep authentication fully frontend-only with Clerk modal UX, email/password-only v1 scope, and no custom backend auth endpoints.

**Independent Test**: Complete sign-up/log-in from header and confirm frontend-only flow works without custom backend APIs, with email/password-only methods in v1.

### Implementation for User Story 3

- [X] T022 [US3] Enforce frontend-only Clerk provider usage in `src/main.jsx`
- [X] T023 [US3] Implement auth method-scope guard wiring in `src/app/providers/clerk-config.js`
- [X] T024 [US3] Configure auth overlays for email/password-only v1 behavior in `src/components/auth/AuthOverlayControls.jsx`
- [X] T025 [P] [US3] Document provider-side method settings in `specs/006-clerk-auth-buttons/quickstart.md`
- [X] T026 [P] [US3] Document no-backend auth constraint checks in `specs/006-clerk-auth-buttons/contracts/ui-contract.md`

**Checkpoint**: User Story 3 should be functional and independently verifiable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final alignment, validation, and release readiness across stories.

- [X] T027 [P] Reconcile final behavior notes with implementation plan in `specs/006-clerk-auth-buttons/plan.md`
- [ ] T028 Run full manual validation checklist and record results in `specs/006-clerk-auth-buttons/quickstart.md`
- [X] T029 Run production build validation and record outcome in `specs/006-clerk-auth-buttons/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Can start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 and blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2 completion.
- **Phase 4 (US2)**: Depends on Phase 2 completion; can start after US1 checkpoint for lower merge risk.
- **Phase 5 (US3)**: Depends on Phase 2 completion; can run after US1 baseline auth controls exist.
- **Phase 6 (Polish)**: Depends on completion of all targeted user stories.

### User Story Dependencies

- **US1 (P1)**: No dependency on other stories once foundational work is complete.
- **US2 (P1)**: Depends on foundational work; functionally independent from US3.
- **US3 (P2)**: Depends on foundational work and shared auth controls from US1.

### Within Each User Story

- Build shared rendering and state logic first.
- Apply interaction and accessibility behavior second.
- Complete responsive/layout refinements before story checkpoint.

### Parallel Opportunities

- `T002` and `T003` can run in parallel after `T001`.
- `T006` and `T007` can run in parallel after `T005`.
- `T015` and `T016` can run in parallel after `T014`.
- `T025` and `T026` can run in parallel after `T024`.
- `T027` can run in parallel with final validation preparation before `T028`/`T029`.

---

## Parallel Example: User Story 1

```bash
# Run independent US1 refinements in parallel after base integration:
Task: T015 [US1] Add mobile/desktop wrapping rules in src/styles/tailwind.css
Task: T016 [US1] Preserve route context during overlay open/close in src/components/auth/AuthOverlayControls.jsx
```

## Parallel Example: User Story 3

```bash
# Run documentation-alignment tasks in parallel after auth method configuration:
Task: T025 [US3] Document provider-side method settings in specs/006-clerk-auth-buttons/quickstart.md
Task: T026 [US3] Document no-backend auth constraint checks in specs/006-clerk-auth-buttons/contracts/ui-contract.md
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate signed-out controls, overlay behavior, and invalid-config fallback.
4. Demo/release MVP if ready.

### Incremental Delivery

1. Deliver US1 (MVP) for signed-out entry and fallback behavior.
2. Deliver US2 for authenticated header behavior and sign-out flow.
3. Deliver US3 for frontend-only constraints and method-scope enforcement.
4. Run final polish and validation.

### Parallel Team Strategy

1. Team completes Setup + Foundational together.
2. Then split work:
   - Developer A: US1 UI/overlay behavior
   - Developer B: US2 signed-in header controls
   - Developer C: US3 provider constraints and documentation alignment
