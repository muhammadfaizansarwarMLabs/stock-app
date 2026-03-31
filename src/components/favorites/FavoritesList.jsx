import { ImageGrid } from "../image-grid/ImageGrid";

export function FavoritesList({ images, favoriteIds, onToggleFavorite }) {
  return (
    <ImageGrid
      images={images}
      favoriteIds={favoriteIds}
      onToggleFavorite={onToggleFavorite}
      emptyTitle="No favorites yet"
      emptyMessage="Save a few images from Discover, then come back here."
    />
  );
}
