const badge = {
  easy: "bg-brand-soft text-ink",
  medium: "bg-brand-mid text-ink",
  hard: "bg-brand-deep text-ink",
};

export default function FaqList({ faqs }) {
  return (
    <ul className="space-y-3">
      {faqs.map((faq) => (
        <li key={faq.id} className="rounded-lg border border-line bg-surface">
          <details>
            <summary className="flex cursor-pointer items-start justify-between gap-3 rounded-lg p-4 font-medium text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
              <span>{faq.question}</span>
              <span
                className={`shrink-0 rounded px-2 py-0.5 text-xs ${badge[faq.difficulty]}`}
              >
                {faq.difficulty}
              </span>
            </summary>
            <p className="px-4 pb-4 text-ink">{faq.answer}</p>
          </details>
        </li>
      ))}
    </ul>
  );
}
