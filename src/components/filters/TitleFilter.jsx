export function TitleFilter({ query, onQueryChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">Filter by title</span>
      <input
        type="text"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Try: canyon, ocean, studio"
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none ring-offset-2 transition focus:border-orange-400 focus:ring-2 focus:ring-orange-300"
      />
    </label>
  );
}
