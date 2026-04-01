import { Link, useLocation } from "react-router-dom";
import { FavoriteToggle } from "../favorites/FavoriteToggle";

export function ImageCard({ image, isFavorite, onToggleFavorite, isSelected = false, onToggleSelect = () => {} }) {
  const location = useLocation();

  const checkboxVisibilityClass = isSelected ? "opacity-100" : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100";

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
      <img src={image.thumbnailUrl} alt={image.altText} className="h-48 w-full object-cover transition group-hover:scale-105" />
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-slate-900">{image.title}</h3>
          <div className="relative z-20">
            <FavoriteToggle isFavorite={isFavorite} onToggle={() => onToggleFavorite(image.id)} />
          </div>
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{image.tags.slice(0, 2).join(" • ")}</p>
      </div>
    </article>
  );
}
