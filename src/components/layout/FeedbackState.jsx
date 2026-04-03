export function FeedbackState({ title, message }) {
  return (
    <div className="card-surface rounded-2xl p-8 text-center">
      <p className="hero-title text-xl font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm text-slate-600">{message}</p>
    </div>
  );
}
