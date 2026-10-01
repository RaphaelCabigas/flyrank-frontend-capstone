import Link from "next/link";

const steps = [
  {
    title: "Paste",
    text: "Drop in notes, documentation, or a policy you need to learn.",
  },
  {
    title: "Generate",
    text: "AI turns it into a FAQ grounded only in your text.",
  },
  {
    title: "Practice",
    text: "Browse the answers, or drill them as flashcards.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-10 p-6 py-16">
      <section className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight text-ink">
          Turn dense material into a FAQ you can actually learn from.
        </h1>
        <p className="text-lg text-muted">
          FAQ Learner reads what you paste and writes the questions a newcomer
          would really ask, with short answers and a flashcard mode to test
          yourself.
        </p>
        <Link
          href="/faq-learner"
          className="inline-block rounded-lg bg-brand-strong px-5 py-3 font-medium text-white hover:bg-brand-strong-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Start learning
        </Link>
      </section>

      <section aria-labelledby="how-heading">
        <h2 id="how-heading" className="mb-4 text-xl font-semibold text-ink">
          How it works
        </h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="rounded-lg border border-line bg-brand-soft p-4"
            >
              <p className="text-sm font-medium text-muted">Step {i + 1}</p>
              <p className="mt-1 font-semibold text-ink">{step.title}</p>
              <p className="mt-1 text-ink">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <p className="text-sm text-muted">
        Your text is sent to a third-party AI service to generate the FAQ.
        Please don&apos;t paste confidential or personal information.
      </p>
    </main>
  );
}
