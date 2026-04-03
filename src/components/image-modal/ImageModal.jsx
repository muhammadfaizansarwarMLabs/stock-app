import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { downloadImage } from "../../utils/download-image";
import { ImagePreviewPanel } from "./ImagePreviewPanel";
import { EffectsPanel } from "./EffectsPanel";
import { createUploadedImageSource, isSupportedImageFile } from "../../utils/uploaded-image-source";

// T001 — Preview transform constants (all 9 effects)
const ZOOM_DEFAULT = 100;
const ZOOM_MIN = 50;
const ZOOM_MAX = 200;
const ZOOM_STEP = 10;
const OPACITY_DEFAULT = 100;
const BRIGHTNESS_DEFAULT = 100;
const CONTRAST_DEFAULT = 100;
const BLUR_DEFAULT = 0;
const GRAYSCALE_DEFAULT = 0;
const ROTATION_DEFAULT = 0;
const FLIP_H_DEFAULT = false;
const FLIP_V_DEFAULT = false;

const EFFECT_DEFAULTS = {
  zoom: ZOOM_DEFAULT,
  opacity: OPACITY_DEFAULT,
  brightness: BRIGHTNESS_DEFAULT,
  contrast: CONTRAST_DEFAULT,
  blur: BLUR_DEFAULT,
  grayscale: GRAYSCALE_DEFAULT,
  rotation: ROTATION_DEFAULT,
  flipH: FLIP_H_DEFAULT,
  flipV: FLIP_V_DEFAULT,
};

export function ImageModal({ image, onReplaceUploadedImage, onClearUploadedImage }) {
  const navigate = useNavigate();
  const changeFileInputRef = useRef(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(() => window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => {
      setIsMobileViewport(window.innerWidth <= 768);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!isMobileViewport) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileViewport]);

  // T009 — Zoom state
  const [zoom, setZoom] = useState(ZOOM_DEFAULT);
  // T014 — Opacity state
  const [opacity, setOpacity] = useState(OPACITY_DEFAULT);
  // T029 — Filter states
  const [brightness, setBrightness] = useState(BRIGHTNESS_DEFAULT);
  const [contrast, setContrast] = useState(CONTRAST_DEFAULT);
  const [blur, setBlur] = useState(BLUR_DEFAULT);
  const [grayscale, setGrayscale] = useState(GRAYSCALE_DEFAULT);
  // T034 — Rotation state (0/90/180/270)
  const [rotation, setRotation] = useState(ROTATION_DEFAULT);
  // T035 — Flip toggle states
  const [flipH, setFlipH] = useState(FLIP_H_DEFAULT);
  const [flipV, setFlipV] = useState(FLIP_V_DEFAULT);

  // Current effects snapshot (passed to preview panel and download)
  const effects = { zoom, opacity, brightness, contrast, blur, grayscale, rotation, flipH, flipV };

  // Setter map for EffectsPanel onUpdate callback (T029, T034, T035)
  const SETTERS = {
    zoom: (v) => setZoom(Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, v))),
    opacity: setOpacity,
    brightness: setBrightness,
    contrast: setContrast,
    blur: setBlur,
    grayscale: setGrayscale,
    rotation: setRotation,
    flipH: setFlipH,
    flipV: setFlipV,
  };

  // T041 — Per-effect reset: restore one control to default
  const handleReset = (key) => SETTERS[key]?.(EFFECT_DEFAULTS[key]);

  // T041 — Reset All: restore every control to default (T018)
  const handleResetAll = () => {
    setZoom(ZOOM_DEFAULT);
    setOpacity(OPACITY_DEFAULT);
    setBrightness(BRIGHTNESS_DEFAULT);
    setContrast(CONTRAST_DEFAULT);
    setBlur(BLUR_DEFAULT);
    setGrayscale(GRAYSCALE_DEFAULT);
    setRotation(ROTATION_DEFAULT);
    setFlipH(FLIP_H_DEFAULT);
    setFlipV(FLIP_V_DEFAULT);
  };

  const closeModal = () => {
    if (image.isUploaded) {
      onClearUploadedImage?.();
    }
    navigate(-1);
  };

  // T009 — Zoom handlers clamped to 50–200%
  const handleZoomIn = () => setZoom((z) => Math.min(z + ZOOM_STEP, ZOOM_MAX));
  const handleZoomOut = () => setZoom((z) => Math.max(z - ZOOM_STEP, ZOOM_MIN));

  // T019 — Pass full 9-effect payload to download utility
  const handleDownload = async () => {
    setBusy(true);
    setError("");
    const result = await downloadImage(image, effects);
    setBusy(false);
    if (!result.ok) setError(result.message ?? "Download failed.");
  };

  const handleChangeImageClick = () => {
    changeFileInputRef.current?.click();
  };

  const handleChangeImage = (event) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!isSupportedImageFile(file)) {
      setError("Please select a valid image file.");
      return;
    }

    const nextUploadedImage = createUploadedImageSource(file);
    onReplaceUploadedImage?.(nextUploadedImage);
    handleResetAll();
    setError("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 md:bg-slate-950/70 md:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Preview: ${image.title}`}
    >
      <div className="card-surface relative flex w-full max-w-[22rem] flex-col overflow-hidden rounded-2xl max-h-[calc(100dvh-1.5rem)] md:max-w-4xl md:max-h-[95vh] md:rounded-[2rem]">
        {/* T008 — Close button header: always visible, never scrolls away */}
        <div className="flex shrink-0 items-center justify-end px-3 pt-3 md:px-8 md:pt-8">
          <button
            type="button"
            onClick={closeModal}
            aria-label="Close image modal"
            className="rounded-full bg-orange-500 p-2 text-white transition hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5" aria-hidden="true">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        {/* Scrollable modal body */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 md:px-8 md:pb-8">

        {/* T011+T016+T033+T039 — Pass all 9 props to preview panel */}
        <ImagePreviewPanel
          image={image}
          zoom={zoom}
          opacity={opacity}
          brightness={brightness}
          contrast={contrast}
          blur={blur}
          grayscale={grayscale}
          rotation={rotation}
          flipH={flipH}
          flipV={flipV}
        />

        {/* T010 — Zoom controls + Download */}
        <div className="mt-4 flex flex-wrap items-center gap-2 md:mt-5 md:gap-3">
          {/* Zoom out */}
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoom <= ZOOM_MIN}
            aria-label="Zoom out"
            className="rounded-lg border border-slate-300 p-2 text-slate-700 hover:border-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden="true">
              <path fillRule="evenodd" d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z" clipRule="evenodd" />
            </svg>
          </button>

          <span className="min-w-[3.5rem] text-center text-sm text-slate-500" aria-live="polite" aria-label={`Zoom level ${zoom} percent`}>
            {zoom}%
          </span>

          {/* Zoom in */}
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoom >= ZOOM_MAX}
            aria-label="Zoom in"
            className="rounded-lg border border-slate-300 p-2 text-slate-700 hover:border-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden="true">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
          </button>

          {/* Download */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={busy}
            className="w-full rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 sm:w-auto"
          >
            {busy ? "Preparing…" : "Download"}
          </button>

          {image.isUploaded ? (
            <>
              <button
                type="button"
                onClick={handleChangeImageClick}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 sm:w-auto"
              >
                Change Image
              </button>
              <input
                ref={changeFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChangeImage}
                aria-label="Change uploaded image"
              />
            </>
          ) : null}

          {/* T023 — Error display */}
          {error ? (
            <p className="text-sm font-medium text-red-700" role="alert">{error}</p>
          ) : null}
        </div>

        {/* Effects panel (T028-T037, T041-T042) — all sliders + geometric controls */}
        <EffectsPanel
          effects={effects}
          onUpdate={(key, value) => SETTERS[key]?.(value)}
          onReset={handleReset}
          onResetAll={handleResetAll}
        />

        </div>{/* end scrollable body */}
      </div>

      {/* Overlay close */}
      <button aria-label="Close overlay" onClick={closeModal} className="absolute inset-0 -z-10" />
    </div>
  );
}

