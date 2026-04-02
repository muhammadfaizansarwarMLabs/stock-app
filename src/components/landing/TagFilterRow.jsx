import { getTopTags } from '../../data/images';

export function TagFilterRow({ activeTag, onTagChange }) {
  const tags = getTopTags(12);

  const handleTagClick = (tag) => {
    // If clicking the active tag, deactivate it
    if (activeTag === tag) {
      onTagChange(null);
    } else {
      onTagChange(tag);
    }
  };

  return (
    <div
      className="flex gap-2 overflow-x-auto py-0 px-px scroll-smooth"
      role="group"
      aria-label="Filter by tag"
    >
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleTagClick(tag)}
          aria-pressed={activeTag === tag}
          aria-label={`Filter by ${tag}${activeTag === tag ? ' (active)' : ''}`}
          className={`
            flex-shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-lg font-medium
            transition-colors duration-200
            ${
              activeTag === tag
                ? 'bg-white text-black shadow-md'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
            }
          `}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
