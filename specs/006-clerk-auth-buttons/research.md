# Research: Header Auth Buttons (React + Clerk)

**Feature**: 006-clerk-auth-buttons  
**Phase**: 0 - Research & Unknowns Resolution  
**Date**: 2026-04-09

## 1. Frontend-Only Authentication Architecture

**Decision**: Implement authentication using Clerk's frontend SDK for React and hosted session handling, with no custom backend authentication routes or database.

**Rationale**: The feature explicitly requires no backend code and no database. Clerk's hosted flows support sign-up, sign-in, and session state entirely in the client app.

**Alternatives considered**:
- Build custom backend auth APIs: rejected because it violates explicit scope.
- Persist user records in app database: rejected because data persistence is not required for this feature.

## 2. Header Entry Point Placement

**Decision**: Place signed-out `Sign Up` and `Log In` controls in the same header action row as the existing `ThemeToggle`, adjacent to it.

**Rationale**: This directly satisfies the primary requirement and keeps account entry points consistently discoverable across pages.

**Alternatives considered**:
- Place auth controls in a separate account page only: rejected due to lower discoverability.
- Move theme toggle elsewhere to make space: rejected to avoid unnecessary UI churn.

## 3. Overlay Interaction Model

**Decision**: Use in-page modal overlays for sign-up and log-in entry from header controls, with focus trap, blocked background interaction/scroll, and explicit close.

**Rationale**: This preserves current route context, supports accessibility requirements, and aligns with clarified behavior.

**Alternatives considered**:
- Navigate to dedicated auth routes: rejected due to clarified preference for in-page overlays.
- External hosted pages in a full redirect flow: rejected because route context should be preserved.

## 4. Signed-In Header Controls

**Decision**: Replace `Sign Up`/`Log In` with a user avatar/menu control and an explicit `Sign Out` action when authenticated.

**Rationale**: This resolved clarification removes ambiguity and defines stable signed-in behavior for UI and tests.

**Alternatives considered**:
- Show Sign Out only: rejected because account context is less discoverable.
- Keep Sign Up/Log In visible while signed in: rejected as contradictory state UX.

## 5. Invalid Provider Configuration Handling

**Decision**: If auth provider configuration is invalid/unavailable, replace interactive auth controls with a disabled `Authentication unavailable` state until configuration is valid.

**Rationale**: Prevents repeated failed interactions and produces a clear, deterministic failure experience.

**Alternatives considered**:
- Show errors only after button click: rejected because it permits avoidable failed interactions.
- Silent failure/no-op clicks: rejected due to poor UX and diagnosability.

## 6. Authentication Methods Scope

**Decision**: Restrict v1 to email + password only and explicitly exclude social sign-in and passwordless methods.

**Rationale**: Keeps implementation/test surface minimal while meeting current product intent.

**Alternatives considered**:
- Add social providers: rejected as out-of-scope complexity for v1.
- Passwordless-only: rejected because clarified scope is email/password.

## 7. Responsive and Accessibility Guardrails

**Decision**: Reuse existing responsive header layout patterns and enforce keyboard accessibility for all auth controls and overlays on desktop and mobile.

**Rationale**: Constitution requires desktop/mobile usability and keyboard-accessible controls.

**Alternatives considered**:
- Desktop-only auth controls: rejected because mobile readiness is required.
- Pointer-only interactions: rejected due to accessibility requirements.

## Summary of Decisions

| Topic | Decision |
|------|----------|
| Auth architecture | Clerk frontend SDK with hosted sessions, no custom backend/database |
| Header placement | Auth controls adjacent to `ThemeToggle` |
| Entry UX | In-page modal overlays preserving route context |
| Signed-in UX | Avatar/menu + Sign Out |
| Config failure UX | Disabled `Authentication unavailable` state |
| Auth methods | Email/password only for v1 |
| Responsive/accessibility | Mobile-ready, keyboard accessible, focus-managed overlays |
