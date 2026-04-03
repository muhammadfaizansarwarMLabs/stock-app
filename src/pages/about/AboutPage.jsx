import { aboutContent } from "../../data/about";

export function AboutPage() {
  return (
    <section className="space-y-4">
      <div className="card-surface p-6">
        <h1 className="hero-title text-3xl font-bold text-slate-900">{aboutContent.title}</h1>
        <p className="mt-2 text-sm text-slate-600">A static-first gallery crafted for fast browsing and expressive visuals.</p>
      </div>

      {aboutContent.sections.map((section) => (
        <article key={section.heading} className="card-surface p-6">
          <h2 className="hero-title text-2xl font-semibold text-slate-900">{section.heading}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-700">{section.body}</p>
        </article>
      ))}
    </section>
  );
}
