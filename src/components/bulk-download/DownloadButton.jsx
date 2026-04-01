import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { popularImages } from "../../data/images";
import { useSelection } from "../../state/selection-context";

export function DownloadButton() {
  const { pathname } = useLocation();
  const { selectedIds, zipJob, downloadSelected } = useSelection();
  const selectedCount = selectedIds.size;

  const selectedImages = useMemo(
    () => popularImages.filter((image) => selectedIds.has(image.id)),
    [selectedIds]
  );

  const isOnLandingPage = pathname === "/";
  const isLoading = zipJob.status === "loading";
  const isDisabled = !isOnLandingPage || selectedCount === 0 || isLoading;

  const buttonClassName = [
    "inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition",
    isDisabled
      ? "cursor-not-allowed bg-slate-700 text-slate-300 opacity-60"
      : "bg-white text-slate-900 hover:bg-slate-100"
  ].join(" ");

  const countClassName = [
    "rounded-full border px-3 py-1 text-xs font-semibold",
    selectedCount > 0 ? "border-white/40 bg-white/10 text-white" : "border-slate-600 text-slate-300"
  ].join(" ");

  const handleDownload = async () => {
    if (isDisabled) {
      return;
    }

    await downloadSelected(selectedImages);
  };

  return (
    <div className="ml-2 inline-flex items-center gap-2">
      <button type="button" className={buttonClassName} onClick={handleDownload} disabled={isDisabled}>
        {isLoading ? "Preparing..." : "Download Selected"}
      </button>
      <span className={countClassName} aria-live="polite">
        {selectedCount} selected
      </span>
    </div>
  );
}
