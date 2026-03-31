import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { downloadImage } from "../../utils/download-image";
import { ImagePreviewPanel } from "./ImagePreviewPanel";

export function ImageModal({ image }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const closeModal = () => navigate(-1);

  const handleDownload = async () => {
    setBusy(true);
    setError("");
    const result = await downloadImage(image);
    setBusy(false);
    if (!result.ok) setError(result.message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4" role="dialog" aria-modal="true">
      <div className="card-surface relative w-full max-w-4xl p-5 md:p-8">
        <button
          type="button"
          onClick={closeModal}
          aria-label="Close image modal"
          className="absolute right-4 top-4 rounded-full border border-slate-300 px-3 py-1 text-sm font-semibold text-slate-700 hover:border-slate-500"
        >
          Close
        </button>

        <ImagePreviewPanel image={image} />

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleDownload}
            disabled={busy}
            className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
          >
            {busy ? "Preparing..." : "Download"}
          </button>
          {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}
        </div>
      </div>
      <button aria-label="Close overlay" onClick={closeModal} className="absolute inset-0 -z-10" />
    </div>
  );
}
