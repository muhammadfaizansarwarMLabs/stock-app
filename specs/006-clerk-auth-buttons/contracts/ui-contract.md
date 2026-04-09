# UI Contract: Header Auth Buttons

**Feature**: 006-clerk-auth-buttons  
**Phase**: 1 - Design  
**Date**: 2026-04-09

## Component Contracts

### `AppLayout` Header Auth Zone

**Placement contract**:
- Header renders auth controls adjacent to the existing `ThemeToggle` in the primary action row.
- Auth controls are rendered consistently on pages that use `AppLayout`.

**Behavior contract**:
1. Signed-out + valid config: show clickable `Sign Up` and `Log In` actions.
2. Signed-in: replace signed-out actions with user avatar/menu control plus explicit `Sign Out` action.
3. Invalid config: replace signed-out actions with disabled `Authentication unavailable` state.

### `HeaderAuthControls` (new/updated auth UI slice)

**Signed-out contract**:
1. `Sign Up` opens sign-up flow as in-page modal overlay.
2. `Log In` opens log-in flow as in-page modal overlay.
3. Opening either overlay preserves current route and visible page context.

**Signed-in contract**:
1. User avatar/menu trigger is visible and operable.
2. `Sign Out` action is visible and operable.
3. On sign-out completion, signed-out actions reappear without manual refresh.

### `AuthOverlay` Interaction Contract

**Modal contract**:
1. Overlay traps keyboard focus while open.
2. Background interaction and background scrolling are blocked while open.
3. Overlay has explicit close control accessible by keyboard and pointer.
4. On close, focus returns to a sensible header trigger control.

**Method scope contract**:
1. Sign-up/log-in overlays provide email/password methods in v1.
2. Social sign-in options are not shown in v1.
3. Passwordless methods are not shown in v1.

### Provider Configuration State Contract

1. If provider config is invalid/unavailable, auth entry actions are not interactive.
2. Disabled state label reads `Authentication unavailable`.
3. Once config becomes valid, clickable signed-out actions are restored without full page reload.
4. Auth flow does not depend on project-defined backend authentication endpoints.

## Interaction Contracts

### Signed-Out Entry Flow

1. User lands on page with header.
2. System determines config valid and session signed-out.
3. System displays `Sign Up` and `Log In` beside `ThemeToggle`.

### Sign-Up Overlay Flow

1. User clicks `Sign Up`.
2. Overlay opens on top of current page.
3. Focus is trapped; page behind is inert.
4. User completes sign-up or closes overlay.
5. On success, header switches to signed-in controls.

### Log-In Overlay Flow

1. User clicks `Log In`.
2. Overlay opens on top of current page.
3. Focus is trapped; page behind is inert.
4. User completes log-in or closes overlay.
5. On success, header switches to signed-in controls.

### Invalid Config Flow

1. System detects invalid/unavailable provider configuration.
2. Signed-out auth actions are replaced with disabled `Authentication unavailable` state.
3. When configuration becomes valid, interactive signed-out actions return.

### Frontend-Only Auth Constraint Flow

1. User triggers sign-up/log-in from header controls.
2. Provider modal handles auth steps directly in client flow.
3. No custom backend auth route is required for completion.

## Accessibility Contract

- Header auth controls are reachable by keyboard tab order.
- Auth overlay provides semantic dialog behavior with focus containment.
- Close and sign-out controls expose clear accessible names.
- Disabled unavailable state is announced as non-interactive.

## Responsive Contract

- Header auth controls remain visible and usable on desktop and mobile viewport widths.
- Overlay behavior (focus trap, background block, explicit close) is consistent across desktop and mobile.
- Action grouping beside theme toggle must not cause horizontal overflow in supported viewport sizes.
