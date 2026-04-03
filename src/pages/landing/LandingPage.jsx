import { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { popularImages, getImagesByTag } from "../../data/images";
import { filterImagesByTitle } from "../../utils/filter-images";
import { TitleFilter } from "../../components/filters/TitleFilter";
import { ImageGrid } from "../../components/image-grid/ImageGrid";
import { TagFilterRow } from "../../components/landing/TagFilterRow";
import { useSelection } from "../../state/selection-context";
import { createUploadedImageSource, isSupportedImageFile } from "../../utils/uploaded-image-source";
import "./landing.css";

const HERO_COLLAGE_IMAGES = [
  "https://picsum.photos/id/1016/420/300",
  "https://picsum.photos/id/1043/420/300",
  "https://picsum.photos/id/1025/420/300",
  "https://picsum.photos/id/1011/420/300",
  "https://picsum.photos/id/1039/420/300",
  "https://picsum.photos/id/1003/420/300",
  "https://picsum.photos/id/1015/420/300",
  "https://picsum.photos/id/1053/420/300",
  "https://picsum.photos/id/15/420/300",
];

const COLLAGE_CONFIGS = [
  "self-start -rotate-2 translate-x-6",
  "self-end rotate-2 -translate-x-4",
  "self-center -rotate-1 translate-x-2",
  "self-start rotate-3 -translate-x-6",
  "self-end -rotate-2 translate-x-8",
  "self-center rotate-1 -translate-x-2",
  "self-start rotate-2 translate-x-4",
  "self-end -rotate-1 -translate-x-6",
  "self-center -rotate-2 translate-x-3",
];

const collageImages = [...HERO_COLLAGE_IMAGES, ...HERO_COLLAGE_IMAGES];

export function LandingPage({ favoriteIds, onToggleFavorite, onOpenUploadedImage }) {
  const [query, setQuery] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const activeTag = searchParams.get("tag") || null;
  const { selectedIds, selectAll, clearAll } = useSelection();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!isSupportedImageFile(file)) {
      setUploadError("Please select a valid image file.");
      return;
    }

    setUploadError("");
    const uploadedImage = createUploadedImageSource(file);
    onOpenUploadedImage?.(uploadedImage);
    navigate("/image/uploaded", { state: { backgroundLocation: location } });
  };

  const handleTagChange = (tag) => {
    if (tag) {
      setSearchParams({ tag });
    } else {
      setSearchParams({});
    }
  };

  const filteredImages = useMemo(() => {
    // First filter by title
    let result = filterImagesByTitle(popularImages, query);

    // Then filter by tag if active
    if (activeTag) {
      const imagesByTag = getImagesByTag(activeTag);
      result = result.filter((img) => imagesByTag.find((tagImg) => tagImg.id === img.id));
    }

    return result;
  }, [query, activeTag]);

  const visibleIds = useMemo(() => filteredImages.map((image) => image.id), [filteredImages]);

  return (
    <section className="space-y-8">
      <div className="landing-hero card-surface">
        <div className="grid md:grid-cols-2" style={{ height: "36rem" }}>
          <div className="flex flex-col justify-center p-7 md:p-10 xl:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Tip: open any image to edit or generate variations.</p>
            <h1 className="font-playfair mt-2 text-3xl font-bold text-slate-900 md:text-5xl xl:text-6xl leading-tight">Millions of free AI stock photos.</h1>
            <p className="mt-3 max-w-lg text-sm text-slate-600 md:text-base">
              Find an image fast. Download instantly. Edit or generate variations when you need them.
            </p>
            <div className="mt-6 max-w-xl">
              <TitleFilter query={query} onQueryChange={setQuery} />
              <div className="mt-6 space-y-2">
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="rounded-full border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Upload Your Photo
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadChange}
                  aria-label="Upload image from device"
                />
                {uploadError ? (
                  <p className="text-sm font-medium text-red-600" role="alert">
                    {uploadError}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden hidden md:flex items-start">
            <div className="hero-collage-track flex flex-col gap-4 py-4 px-6 w-full">
              {collageImages.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  aria-hidden="true"
                  className={`rounded-2xl object-cover shadow-lift w-[80%] h-48 flex-shrink-0 ${COLLAGE_CONFIGS[i % COLLAGE_CONFIGS.length]}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          className="rounded-full border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          onClick={() => selectAll(visibleIds)}
          disabled={!visibleIds.length}
        >
          Select All ({visibleIds.length})
        </button>
        <button
          type="button"
          className="rounded-full border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          onClick={clearAll}
          disabled={selectedIds.size === 0}
        >
          Clear All
        </button>
      </div>

      <TagFilterRow activeTag={activeTag} onTagChange={handleTagChange}  />

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
