import { useMemo, useState } from "react";
import { popularImages } from "../../data/images";
import { filterImagesByTitle } from "../../utils/filter-images";
import { TitleFilter } from "../../components/filters/TitleFilter";
import { ImageGrid } from "../../components/image-grid/ImageGrid";
import { useSelection } from "../../state/selection-context";
import "./landing.css";

export function LandingPage({ favoriteIds, onToggleFavorite }) {
  const [query, setQuery] = useState("");
  const { selectedIds, selectAll, clearAll } = useSelection();

  const filteredImages = useMemo(() => filterImagesByTitle(popularImages, query), [query]);
  const visibleIds = useMemo(() => filteredImages.map((image) => image.id), [filteredImages]);

  return (
    <section className="space-y-6">
      <div className="landing-hero card-surface p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Curated weekly</p>
        <h1 className="hero-title mt-2 text-3xl font-bold text-slate-900 md:text-5xl">Popular Visuals For Bold Projects</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
          Browse high-impact mock stock imagery in a sleek, responsive gallery. Click any card for a large preview and instant download.
        </p>
        <div className="mt-6 max-w-md">
          <TitleFilter query={query} onQueryChange={setQuery} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => selectAll(visibleIds)}
          disabled={!visibleIds.length}
        >
          Select All ({visibleIds.length})
        </button>
        <button
          type="button"
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={clearAll}
          disabled={selectedIds.size === 0}
        >
          Clear All
        </button>
      </div>

      <ImageGrid
        images={filteredImages}
        favoriteIds={favoriteIds}
        onToggleFavorite={onToggleFavorite}
        emptyTitle="No matching images"
        emptyMessage="Try another title keyword or clear the filter to see popular picks."
      />
    </section>
  );
}
