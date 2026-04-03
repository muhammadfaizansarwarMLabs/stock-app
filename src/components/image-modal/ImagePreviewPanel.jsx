import { useEffect, useState } from "react";

// T003 — Accept all 9 preview transform/filter props
export function ImagePreviewPanel({
  image,
  zoom = 100,
  opacity = 100,
  brightness = 100,
  contrast = 100,
  blur = 0,
  grayscale = 0,
  rotation = 0,
  flipH = false,
  flipV = false,
}) {
  const tagsText = Array.isArray(image.tags) && image.tags.length ? image.tags.join(" • ") : "Uploaded image";
  // T017 — Compose CSS filter string from all filter effects
  const filterStr = [
    `brightness(${brightness}%)`,
    `contrast(${contrast}%)`,
    `blur(${blur}px)`,
    `grayscale(${grayscale}%)`,
    `opacity(${opacity}%)`,
  ].join(" ");

  // T012 + T040 — Compose CSS transform: scale (zoom, center-anchored), rotate first, then flip
  const scaleX = flipH ? -1 * (zoom / 100) : zoom / 100;
  const scaleY = flipV ? -1 * (zoom / 100) : zoom / 100;
  const transformStr = `rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [image.fullImageUrl]);

  return (
    <div className="space-y-4">
      {/* Fixed preview area keeps modal height stable while the image loads */}
      <div className="relative h-[55vh] overflow-hidden rounded-2xl bg-slate-100">
        {!isLoaded ? (
          <div
            className="absolute inset-0 flex items-center justify-center"
            role="status"
            aria-label="Loading image preview"
          >
            <span className="size-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          </div>
        ) : null}

        <img
          src={image.fullImageUrl}
          alt={image.altText}
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsLoaded(true)}
          className={`h-full w-full object-contain transition-[filter,transform] duration-100 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{
            filter: filterStr,
            transform: transformStr,
            transformOrigin: "center",
          }}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="hero-title text-2xl font-bold text-slate-900">{image.title}</h2>
        <p className="text-sm text-slate-500">{tagsText}</p>
      </div>
    </div>
  );
}
