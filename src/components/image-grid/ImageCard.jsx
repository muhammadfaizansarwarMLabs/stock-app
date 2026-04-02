import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FavoriteToggle } from "../favorites/FavoriteToggle";
import { downloadImage } from "../../utils/download-image";

export function ImageCard({ image, isFavorite, onToggleFavorite, isSelected = false, onToggleSelect = () => {} }) {
  const location = useLocation();
  const [downloadBusy, setDownloadBusy] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const checkboxVisibilityClass = isSelected ? "opacity-100" : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100";

  useEffect(() => {
    if (!downloadError) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setDownloadError("");
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [downloadError]);

  const stopOverlayInteraction = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDownload = async (event) => {
    stopOverlayInteraction(event);

    if (downloadBusy) {
      return;
    }

    setDownloadBusy(true);
    setDownloadError("");

    const result = await downloadImage(image, null);

    setDownloadBusy(false);

    if (!result.ok) {
      setDownloadError(result.message ?? "Download failed.");
    }
  };

  return (
    <article
      className={[
        "group relative card-surface overflow-hidden transition hover:-translate-y-1 hover:shadow-2xl",
        isSelected ? "ring-2 ring-indigo-500 ring-offset-1" : ""
      ].join(" ")}
    >
      <Link
        to={`/image/${image.id}`}
        state={{ backgroundLocation: location }}
        className="absolute inset-0 z-10 rounded-2xl"
        aria-label={`Open image ${image.title}`}
      />

      <div className={["absolute left-3 top-3 z-20 transition", checkboxVisibilityClass].join(" ")}>
        <input
          type="checkbox"
          className="h-5 w-5 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
          aria-label={`Select ${image.title}`}
          checked={isSelected}
          onChange={onToggleSelect}
        />
      </div>

      <img
        src={image.thumbnailUrl}
        alt={image.altText}
        className="h-64 w-full object-cover transition group-hover:scale-105 md:h-72 xl:h-80"
      />

      <div className="card-actions absolute bottom-3 right-3 z-20 transition-opacity duration-200">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`Download ${image.title}`}
            disabled={downloadBusy}
            onClick={handleDownload}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-500/80 text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {downloadBusy ? (
              <span
                className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden="true"
              />
            ) : (
              <svg viewBox="0 0 20 20" fill="currentColor" className="size-5" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M10 2.75a.75.75 0 0 1 .75.75v7.19l2.22-2.22a.75.75 0 1 1 1.06 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 0 1 1.06-1.06l2.22 2.22V3.5A.75.75 0 0 1 10 2.75ZM4.5 13a.75.75 0 0 1 .75.75v.75c0 .138.112.25.25.25h9a.25.25 0 0 0 .25-.25v-.75a.75.75 0 0 1 1.5 0v.75A1.75 1.75 0 0 1 14.5 16.5h-9A1.75 1.75 0 0 1 3.75 14.5v-.75A.75.75 0 0 1 4.5 13Z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          <FavoriteToggle isFavorite={isFavorite} onToggle={() => onToggleFavorite(image.id)} />
        </div>

        {downloadError ? (
          <p role="alert" className="pt-2 text-right text-xs font-medium text-red-500">
            {downloadError}
          </p>
        ) : null}
      </div>

      {/* <div className="space-y-3 p-4">
        <h3 className="text-base font-semibold text-slate-900">{image.title}</h3>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{image.tags.slice(0, 2).join(" • ")}</p>
      </div> */}
    </article>
  );
}
