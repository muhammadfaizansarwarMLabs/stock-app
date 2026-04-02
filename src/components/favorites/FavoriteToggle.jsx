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
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-red-500 transition hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-white"
    >
      {isFavorite ? (
        <svg viewBox="0 0 20 20" fill="currentColor" className="size-5" aria-hidden="true">
          <path d="M9.645 2.686a.75.75 0 0 1 .71 0l5.5 3.146a.75.75 0 0 1 .395.653v6.03a.75.75 0 0 1-.395.653l-5.5 3.146a.75.75 0 0 1-.71 0l-5.5-3.146a.75.75 0 0 1-.395-.653v-6.03a.75.75 0 0 1 .395-.653l5.5-3.146Z" opacity="0" />
          <path d="M9.994 3.256c-1.726-1.494-4.484-1.37-6.055.278-1.57 1.647-1.522 4.376.108 5.965l5.301 5.17a.938.938 0 0 0 1.304 0l5.301-5.17c1.63-1.59 1.678-4.318.108-5.965-1.57-1.647-4.329-1.772-6.055-.278l-.006.005-.006-.005Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m9.719 14.956-5.166-5.04c-1.389-1.355-1.43-3.68-.093-5.081 1.336-1.402 3.684-1.508 5.149-.234L10 4.88l.39-.28c1.466-1.274 3.813-1.168 5.15.234 1.336 1.401 1.295 3.726-.094 5.08l-5.166 5.042a.75.75 0 0 1-1.061 0Z"
          />
        </svg>
      )}
    </button>
  );
}
