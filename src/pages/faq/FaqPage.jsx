import { faqItems } from "../../data/faq";

export function FaqPage() {
  return (
    <section className="space-y-4">
      <div className="card-surface p-6">
        <h1 className="hero-title text-3xl font-bold text-slate-900">Frequently Asked Questions</h1>
        <p className="mt-2 text-sm text-slate-600">Quick answers about this static mock stock gallery.</p>
      </div>

      {faqItems.map((item) => (
        <article key={item.id} className="card-surface p-6">
          <h2 className="text-lg font-semibold text-slate-900">{item.question}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-700">{item.answer}</p>
        </article>
      ))}
    </section>
  );
}
