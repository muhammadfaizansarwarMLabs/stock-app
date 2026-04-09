const clerkPublishableKey = (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? "").trim();
const authMethodScope = (import.meta.env.VITE_CLERK_V1_METHODS ?? "email_password").trim().toLowerCase();

const hasClerkPublishableKey = clerkPublishableKey.startsWith("pk_");

// Do not hard-block auth UI on provider-side method toggles.
// The publishable key is the only required client-side gate.
export const isClerkConfigured = hasClerkPublishableKey;

export function getClerkPublishableKey() {
  return clerkPublishableKey;
}

export function getAuthMethodScope() {
  return authMethodScope;
}

export function getClerkConfigError() {
  if (!hasClerkPublishableKey) {
    return "Missing or invalid Clerk publishable key.";
  }

  return "";
}
