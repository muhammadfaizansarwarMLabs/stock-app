import { useSelection } from "../../state/selection-context";

export function ErrorBanner() {
  const { zipJob, dismissError } = useSelection();

  if (zipJob.status !== "error") {
    return null;
  }

  const titlePreview = zipJob.failedTitles.slice(0, 3).join(", ");
  const hasMore = zipJob.failedTitles.length > 3;

  return (
    <div
      className="mb-6 rounded-2xl border border-amber-300 bg-amber-100 px-4 py-3 text-amber-900"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium">
          {zipJob.failedCount} image{zipJob.failedCount > 1 ? "s" : ""} could not be included in the ZIP.
          {titlePreview ? ` Failed: ${titlePreview}${hasMore ? ", and more." : "."}` : ""}
        </p>
        <button
          type="button"
          className="rounded-md px-2 py-1 text-sm font-semibold text-amber-900 hover:bg-amber-200"
          onClick={dismissError}
          aria-label="Dismiss download error"
        >
          x
        </button>
      </div>
    </div>
  );
}
