import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";

export function AuthOverlayControls() {
  const location = useLocation();
  const fallbackUrl = `${location.pathname}${location.search}${location.hash}`;

  return (
    <div className="header-auth-actions" data-auth-overlay="controls">
      <SignUpButton mode="modal" forceRedirectUrl={fallbackUrl} fallbackRedirectUrl={fallbackUrl}>
        <button type="button" className="header-auth-button header-auth-button-primary">
          Sign Up
        </button>
      </SignUpButton>

      <SignInButton mode="modal" forceRedirectUrl={fallbackUrl} fallbackRedirectUrl={fallbackUrl}>
        <button type="button" className="header-auth-button header-auth-button-secondary">
          Log In
        </button>
      </SignInButton>
    </div>
  );
}
