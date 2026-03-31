export function ImagePreviewPanel({ image }) {
  return (
    <div className="space-y-4">
      <img
        src={image.fullImageUrl}
        alt={image.altText}
        className="max-h-[65vh] w-full rounded-2xl object-cover"
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="hero-title text-2xl font-bold text-slate-900">{image.title}</h2>
        <p className="text-sm text-slate-500">{image.tags.join(" • ")}</p>
      </div>
    </div>
  );
}
