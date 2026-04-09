// import posthog from "posthog-js";

// export function initPostHog() {
//   posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
//     api_host: import.meta.env.VITE_POSTHOG_HOST,
//     person_profiles: "identified_only",
//   });
// }

// export { posthog };



import posthog from "posthog-js";

export function initPostHog() {
  if (typeof window === "undefined") return; // ensures client-only

  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST,
    person_profiles: "identified_only",
    autocapture: true,       // automatically tracks pageviews, clicks, and Web Vitals
    capture_pageview: true,  // tracks initial pageview
  });
}

export { posthog };