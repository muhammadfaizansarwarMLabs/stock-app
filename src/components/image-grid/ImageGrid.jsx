import { ImageCard } from "./ImageCard";
import { FeedbackState } from "../layout/FeedbackState";
import { useSelection } from "../../state/selection-context";

export function ImageGrid({ images, favoriteIds, onToggleFavorite, emptyTitle, emptyMessage }) {
  const { selectedIds, toggleSelect } = useSelection();

  if (!images.length) {
    return <FeedbackState title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <section className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          isFavorite={favoriteIds.has(image.id)}
          onToggleFavorite={onToggleFavorite}
          isSelected={selectedIds.has(image.id)}
          onToggleSelect={() => toggleSelect(image.id)}
        />
      ))}
    </section>
  );
}
