export function AuthUnavailableState() {
  return (
    <button
      type="button"
      disabled
      aria-live="polite"
      aria-disabled="true"
      className="inline-flex cursor-not-allowed items-center rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200 opacity-80"
      title="Authentication unavailable"
    >
      Authentication unavailable
    </button>
  );
}
