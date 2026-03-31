import { Link, useLocation } from "react-router-dom";
import { FavoriteToggle } from "../favorites/FavoriteToggle";

export function ImageCard({ image, isFavorite, onToggleFavorite }) {
  const location = useLocation();

  return (
    <Link
      to={`/image/${image.id}`}
      state={{ backgroundLocation: location }}
      className="group card-surface overflow-hidden transition hover:-translate-y-1 hover:shadow-2xl"
      aria-label={`Open image ${image.title}`}
    >
      <img src={image.thumbnailUrl} alt={image.altText} className="h-48 w-full object-cover transition group-hover:scale-105" />
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-slate-900">{image.title}</h3>
          <FavoriteToggle isFavorite={isFavorite} onToggle={() => onToggleFavorite(image.id)} />
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{image.tags.slice(0, 2).join(" • ")}</p>
      </div>
    </Link>
  );
}
