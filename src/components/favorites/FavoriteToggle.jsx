export function FavoriteToggle({ isFavorite, onToggle }) {
  return (
    <button
      type="button"
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onToggle();
      }}
      className={[
        "rounded-full border px-3 py-1 text-xs font-semibold transition",
        isFavorite
          ? "border-orange-500 bg-orange-100 text-orange-700"
          : "border-slate-300 bg-white text-slate-700 hover:border-orange-400"
      ].join(" ")}
    >
      {isFavorite ? "Favorited" : "Add Favorite"}
    </button>
  );
}
