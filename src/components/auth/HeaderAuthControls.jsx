import { SignedIn, SignedOut, UserButton, useClerk } from "@clerk/clerk-react";
import { AuthOverlayControls } from "./AuthOverlayControls";
import { AuthUnavailableState } from "./AuthUnavailableState";
import { getClerkConfigError, isClerkConfigured } from "../../app/providers/clerk-config";

function ConfiguredHeaderAuthControls() {
  const { signOut } = useClerk();

  return (
    <>
      <SignedOut>
        <AuthOverlayControls />
      </SignedOut>

      <SignedIn>
        <div className="header-auth-actions" data-auth-overlay="signed-in">
          <div className="header-user-menu">
            <UserButton />
          </div>
          <button
            type="button"
            onClick={() => signOut()}
            className="header-auth-button header-auth-button-secondary"
          >
            Sign Out
          </button>
        </div>
      </SignedIn>
    </>
  );
}

export function HeaderAuthControls() {
  if (!isClerkConfigured) {
    return (
      <div className="header-auth-actions" title={getClerkConfigError()}>
        <AuthUnavailableState />
      </div>
    );
  }

  return <ConfiguredHeaderAuthControls />;
}
