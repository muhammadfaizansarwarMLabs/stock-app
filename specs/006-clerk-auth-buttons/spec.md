# Feature Specification: Header Auth Buttons

**Feature Branch**: `006-clerk-auth-buttons`  
**Created**: 2026-04-09  
**Status**: Draft  
**Input**: User description: "i want to add a sign-up log in button just beside the loght/dark mood button. i want to use Clerk for authentications so avoid the backend code."

## Clarifications

### Session 2026-04-09

- Q: What should signed-in header controls be? → A: Show a user avatar/menu control plus Sign Out action.
- Q: How should auth controls behave when provider config is invalid? → A: Replace Sign Up/Log In with a disabled "Authentication unavailable" state until config is valid.
- Q: How should sign-up/log-in open from the header? → A: Open as in-page modal overlays from the current page.
- Q: What overlay interaction model should auth modals use? → A: Use modal behavior with focus trap, blocked background interaction/scroll, and explicit close.
- Q: Which authentication methods are in scope for v1? → A: Support email and password only.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Access Authentication Actions in Header (Priority: P1)

As a visitor, I want clear Sign Up and Log In actions placed beside the light/dark mode control so I can immediately access account entry points from the main header.

**Why this priority**: Discoverable entry points are the core value of this request. Without them, users cannot start authentication from the intended location.

**Independent Test**: Open the app while signed out and verify that Sign Up and Log In actions are visible next to the theme toggle in the header.

**Acceptance Scenarios**:

1. **Given** a signed-out visitor is on any page with the main header, **When** the header renders, **Then** both Sign Up and Log In actions are shown adjacent to the theme toggle.
2. **Given** a signed-out visitor can see the header actions, **When** they click Sign Up, **Then** the sign-up flow opens as an in-page modal overlay without leaving the current page.
3. **Given** a signed-out visitor can see the header actions, **When** they click Log In, **Then** the log-in flow opens as an in-page modal overlay without leaving the current page.
4. **Given** provider configuration is invalid, **When** the header renders, **Then** Sign Up/Log In are replaced by a clearly labeled disabled "Authentication unavailable" state.

---

### User Story 2 - Respect Signed-In State in Header (Priority: P1)

As an authenticated user, I want account-related controls shown in place of Sign Up and Log In so the header reflects that I am already logged in.

**Why this priority**: Correct state handling prevents confusion and avoids showing contradictory actions to signed-in users.

**Independent Test**: Sign in, refresh the app, and verify Sign Up/Log In are replaced with authenticated user controls in the same header area beside the theme toggle.

**Acceptance Scenarios**:

1. **Given** a user is authenticated, **When** the header renders, **Then** Sign Up and Log In actions are not shown.
2. **Given** a user is authenticated, **When** the header renders, **Then** a user avatar/menu control and a Sign Out action are available in the same area near the theme toggle.
3. **Given** an authenticated user signs out, **When** the header updates, **Then** Sign Up and Log In actions become visible again.

---

### User Story 3 - Frontend-Only Authentication Experience (Priority: P2)

As a product owner, I want authentication to be handled through a hosted frontend authentication provider so this feature can be delivered without adding or requiring backend authentication code.

**Why this priority**: The request explicitly requires avoiding backend work and keeping implementation in the client application.

**Independent Test**: Complete sign-up and log-in journeys in the running app and verify no project-specific backend authentication endpoint is required for these flows.

**Acceptance Scenarios**:

1. **Given** the feature is enabled, **When** a user runs through sign-up and log-in from the header, **Then** the auth journey is completed through provider-managed UI and session handling using email and password credentials.
2. **Given** the app is configured with valid provider settings, **When** a user authenticates, **Then** the app updates UI state without requiring custom backend auth routes.

### Edge Cases

- Theme toggle and authentication actions compete for space on narrow viewports.
- User rapidly taps Sign Up or Log In multiple times before the auth flow opens.
- Authentication provider configuration is missing or invalid at runtime.
- Signed-in state changes in another tab and the current tab must reflect the updated state.
- User cancels sign-up or log-in midway and returns to the app header.
- Provider configuration becomes valid after an initial invalid state and header actions must recover without reload.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST show Sign Up and Log In actions in the main header when the visitor is not authenticated and provider configuration is valid.
- **FR-002**: The system MUST position Sign Up and Log In adjacent to the existing light/dark mode toggle in the header action area.
- **FR-003**: The system MUST make both authentication actions visible and operable on desktop and mobile-supported viewport widths.
- **FR-004**: When Sign Up is selected, the system MUST open the sign-up experience as an in-page modal overlay from the current page.
- **FR-005**: When Log In is selected, the system MUST open the log-in experience as an in-page modal overlay from the current page.
- **FR-006**: The authentication entry and session behavior MUST be provided by the selected hosted authentication provider without requiring project-specific backend authentication endpoints.
- **FR-007**: When a user becomes authenticated, the system MUST replace Sign Up/Log In with a user avatar/menu control and a Sign Out action in the same header zone.
- **FR-008**: When an authenticated user signs out, the system MUST restore Sign Up and Log In actions.
- **FR-009**: The header layout MUST remain usable when theme toggle and authentication controls are present together.
- **FR-010**: If provider configuration is unavailable or invalid, the system MUST replace Sign Up/Log In with a clearly labeled disabled "Authentication unavailable" state instead of silently failing.
- **FR-011**: Authentication actions and account controls in the header MUST remain keyboard accessible.
- **FR-012**: Existing non-auth navigation and theme toggle behavior MUST remain functionally unchanged.
- **FR-013**: When provider configuration becomes valid after an invalid state, the header MUST restore clickable Sign Up and Log In actions without requiring a full page reload.
- **FR-014**: Opening or closing sign-up/log-in overlays MUST preserve the underlying page route and visible context.
- **FR-015**: When a sign-up or log-in overlay is open, keyboard focus MUST be trapped within the overlay until it is explicitly closed or completed.
- **FR-016**: When a sign-up or log-in overlay is open, background page interaction and background scrolling MUST be blocked.
- **FR-017**: The sign-up/log-in overlay MUST provide an explicit close action that is keyboard and pointer accessible.
- **FR-018**: The v1 authentication method set MUST include email and password only.
- **FR-019**: The sign-up/log-in overlays MUST NOT present social sign-in or passwordless options in v1.

### Key Entities *(include if feature involves data)*

- **Authentication State**: Indicates whether the current visitor is signed out, signing in/up, or signed in.
- **Header Auth Actions**: The visible action set in the header, which changes based on authentication state.
- **Header Account Menu**: The signed-in header control that exposes user account context and sign-out access.
- **Auth Overlay State**: UI state indicating whether the sign-up or log-in modal overlay is open or closed.
- **Focus Lock State**: UI state indicating whether keyboard focus is constrained to the auth overlay while open.
- **User Session Identity**: Provider-managed user identity information used to determine which header controls to render.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In signed-out test sessions, Sign Up and Log In are visible beside the theme toggle in 100% of header renders.
- **SC-002**: At least 95% of users can start either sign-up or log-in from the header within 10 seconds of page load.
- **SC-003**: In validation runs, 100% of successful sign-ins update the header to authenticated-user controls without manual page reload.
- **SC-004**: In validation runs, 100% of sign-outs restore Sign Up and Log In actions in the header.
- **SC-005**: At least 90% of test users complete sign-up or log-in from the header on first attempt.
- **SC-006**: No regressions are observed in theme toggle functionality across supported viewports after adding auth controls.
- **SC-007**: In invalid-config validation runs, 100% of signed-out header renders show the disabled "Authentication unavailable" state instead of interactive auth actions.
- **SC-008**: In validation runs, opening sign-up or log-in from the header keeps users on the same underlying page context in 100% of test cases.
- **SC-009**: In accessibility validation runs, keyboard focus remains trapped within an open auth overlay in 100% of tested interactions until close or completion.
- **SC-010**: In overlay validation runs, background page scrolling and pointer interaction are blocked in 100% of open-overlay test cases.
- **SC-011**: In v1 authentication validation, 100% of sign-up/log-in overlays present email/password entry and do not present social or passwordless options.

## Assumptions

- A hosted authentication provider and its publishable frontend configuration are available for the app environment.
- This feature covers client-side authentication entry points and header state handling only.
- No custom backend authentication API, token minting service, or user database schema changes are in scope.
- Existing header layout patterns can be adjusted for spacing/responsiveness as needed without redesigning the full navigation system.
