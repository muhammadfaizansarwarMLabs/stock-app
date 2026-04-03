import { images } from "../../data/images";
import { FavoritesList } from "../../components/favorites/FavoritesList";

export function FavoritesPage({ favoriteIds, onToggleFavorite }) {
  const favoriteImages = images.filter((image) => favoriteIds.has(image.id));

  return (
    <section className="space-y-4">
      <div className="card-surface p-6">
        <h1 className="hero-title text-3xl font-bold text-slate-900">Your Favorites</h1>
        <p className="mt-2 text-sm text-slate-600">Saved picks stay on this browser so you can revisit them any time.</p>
      </div>
      <FavoritesList images={favoriteImages} favoriteIds={favoriteIds} onToggleFavorite={onToggleFavorite} />
    </section>
  );
}
