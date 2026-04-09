# Quickstart: Header Auth Buttons (React + Clerk)

**Feature**: 006-clerk-auth-buttons  
**Branch**: `006-clerk-auth-buttons`  
**Date**: 2026-04-09

## Prerequisites

- Node.js 18+
- Existing project dependencies installed: `npm install`
- Clerk publishable key available for the target environment

## Setup

1. Install Clerk React SDK:

```bash
npm install @clerk/clerk-react
```

2. Add environment variable in `.env.local`:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxx
```

3. Ensure app provider wiring is loaded at app root and header is rendered through `AppLayout`.
4. In Clerk Dashboard, keep only email/password methods enabled for sign-in/sign-up and disable social/passwordless methods for v1.

## Run the App

```bash
npm run dev
```

Open `http://localhost:5173`.

## Manual Validation Checklist

### Signed-Out Header UX

- [ ] Open app with signed-out session and valid provider config.
- [ ] Verify `Sign Up` and `Log In` are visible beside `ThemeToggle`.
- [ ] Verify both actions are keyboard focusable.

### Sign-Up/Log-In Overlay Behavior

- [ ] Click `Sign Up`; verify overlay opens without route/page change.
- [ ] Click `Log In`; verify overlay opens without route/page change.
- [ ] Verify overlay has explicit close control.
- [ ] Verify keyboard focus is trapped inside overlay while open.
- [ ] Verify background page does not scroll while overlay is open.
- [ ] Verify pointer/keyboard interaction behind overlay is blocked.

### Authentication State Transitions

- [ ] Complete sign-up using email/password and verify header updates to signed-in controls.
- [ ] Complete log-in using email/password and verify header updates to signed-in controls.
- [ ] Verify signed-in header shows avatar/menu control plus `Sign Out`.
- [ ] Click `Sign Out`; verify signed-out controls return without manual reload.

### Invalid Config State

- [ ] Temporarily unset/invalid publishable key.
- [ ] Verify signed-out auth actions are replaced by disabled `Authentication unavailable` state.
- [ ] Restore valid config and verify clickable `Sign Up`/`Log In` return without full page reload.

### Method Scope (v1)

- [ ] Verify sign-up/log-in overlays provide email/password credentials.
- [ ] Verify social sign-in options are not shown.
- [ ] Verify passwordless options are not shown.

### Responsive and Regression Checks

- [ ] Validate signed-out/signed-in header controls at mobile width (`375px`) and desktop width (`1280px`).
- [ ] Verify no horizontal overflow in header action zone beside `ThemeToggle`.
- [ ] Confirm existing navigation, theme toggle behavior, image browsing/filtering, modal, download, and favorites flows still work.

## Build Verification

```bash
npm run build
```

Expected: successful Vite build with no errors.

## Verification Notes

- 2026-04-09: `npm run build` succeeded (`133 modules transformed`, Vite production build completed).
- Build produced a chunk-size warning for bundled JS output (>500 kB), but build completed without errors.
