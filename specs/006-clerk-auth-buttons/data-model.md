# Data Model: Header Auth Buttons

**Feature**: 006-clerk-auth-buttons  
**Phase**: 1 - Design  
**Date**: 2026-04-09

## Entities

### AuthenticationState

Represents current authentication lifecycle for header rendering decisions.

| Field | Type | Description |
|------|------|-------------|
| `status` | `"signedOut" | "signingIn" | "signingUp" | "signedIn"` | Current auth/session state |
| `isConfigured` | `boolean` | Whether provider configuration is valid and usable |
| `userId` | `string \| null` | Provider user identifier when authenticated |

### HeaderAuthActions

Represents which control set is shown beside the theme toggle.

| Field | Type | Description |
|------|------|-------------|
| `mode` | `"signedOutActions" | "signedInActions" | "unavailable"` | Active control set |
| `showSignUp` | `boolean` | Visible in signed-out mode |
| `showLogIn` | `boolean` | Visible in signed-out mode |
| `showUserMenu` | `boolean` | Visible in signed-in mode |
| `showSignOut` | `boolean` | Visible in signed-in mode |
| `showUnavailableState` | `boolean` | Visible when config invalid |

### AuthOverlayState

Tracks sign-up/sign-in overlay lifecycle.

| Field | Type | Default | Description |
|------|------|---------|-------------|
| `activeOverlay` | `"none" | "signUp" | "logIn"` | `"none"` | Which auth overlay is open |
| `isOpen` | `boolean` | `false` | Overlay visibility state |
| `canClose` | `boolean` | `true` | Whether explicit close action is available |

### FocusLockState

Tracks accessibility and interaction lock while auth overlays are open.

| Field | Type | Default | Description |
|------|------|---------|-------------|
| `isFocusTrapped` | `boolean` | `false` | True while modal overlay is open |
| `isBackgroundScrollLocked` | `boolean` | `false` | True while overlay is open |
| `isBackgroundInteractionBlocked` | `boolean` | `false` | Prevents pointer/keyboard interaction behind modal |

### UserSessionIdentity

Minimal provider session projection used in header UI.

| Field | Type | Description |
|------|------|-------------|
| `displayName` | `string \| null` | User-facing label for account menu |
| `avatarUrl` | `string \| null` | Avatar shown in header menu trigger |
| `emailAddress` | `string \| null` | Optional account context display |

## Relationships

- `AuthenticationState` determines `HeaderAuthActions.mode`.
- `HeaderAuthActions.mode = "signedOutActions"` requires `AuthenticationState.status = "signedOut"` and `isConfigured = true`.
- `HeaderAuthActions.mode = "unavailable"` requires `AuthenticationState.isConfigured = false`.
- `AuthOverlayState.isOpen = true` implies `FocusLockState.isFocusTrapped = true`, `isBackgroundScrollLocked = true`, and `isBackgroundInteractionBlocked = true`.
- `UserSessionIdentity` is present only when `AuthenticationState.status = "signedIn"`.

## State Transitions

### Signed-Out Ready Flow

`status=signedOut + isConfigured=true` -> render Sign Up/Log In actions.

### Open Sign Up Overlay

`activeOverlay=none` -> click Sign Up -> `activeOverlay=signUp, isOpen=true` -> focus/background lock enabled.

### Open Log In Overlay

`activeOverlay=none` -> click Log In -> `activeOverlay=logIn, isOpen=true` -> focus/background lock enabled.

### Close Overlay

`isOpen=true` -> explicit close -> `activeOverlay=none, isOpen=false` -> lock states disabled.

### Auth Success

`status=signingIn|signingUp` -> success -> `status=signedIn` -> signed-out actions replaced by user menu + sign out.

### Sign Out

`status=signedIn` -> sign out -> `status=signedOut` -> user controls replaced by Sign Up/Log In.

### Invalid Config

`isConfigured=false` at any signed-out render point -> `HeaderAuthActions.mode=unavailable` -> disabled "Authentication unavailable" state rendered.

### Config Recovery

`isConfigured=false` -> config becomes valid -> `isConfigured=true` and `status=signedOut` -> clickable Sign Up/Log In restored without full reload.

## Validation Rules

- v1 method set is email/password only.
- Social sign-in options are not shown in v1.
- Passwordless options are not shown in v1.
- Auth overlays must keep the current route unchanged while open/close operations occur.
- All header auth controls and overlay controls are keyboard accessible.
