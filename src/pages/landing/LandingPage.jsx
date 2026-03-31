import { useMemo, useState } from "react";
import { popularImages } from "../../data/images";
import { filterImagesByTitle } from "../../utils/filter-images";
import { TitleFilter } from "../../components/filters/TitleFilter";
import { ImageGrid } from "../../components/image-grid/ImageGrid";
import "./landing.css";

export function LandingPage({ favoriteIds, onToggleFavorite }) {
  const [query, setQuery] = useState("");

  const filteredImages = useMemo(() => filterImagesByTitle(popularImages, query), [query]);

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
