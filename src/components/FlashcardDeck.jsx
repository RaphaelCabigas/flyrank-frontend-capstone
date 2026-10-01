"use client";

import { useState } from "react";

const buttonBase =
  "rounded-lg px-4 py-2 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";
const primaryButton = `${buttonBase} bg-brand-strong text-white hover:bg-brand-strong-hover`;
const secondaryButton = `${buttonBase} border border-brand-strong text-ink hover:bg-brand-soft`;

export default function FlashcardDeck({ faqs }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [known, setKnown] = useState(0);

  const done = index >= faqs.length;

  function next(gotIt) {
    if (gotIt) setKnown((k) => k + 1);
    setRevealed(false);
    setIndex((i) => i + 1);
  }

  function restart() {
    setIndex(0);
    setKnown(0);
    setRevealed(false);
  }

  if (done) {
    return (
      <div className="rounded-lg bg-brand-soft p-6 text-center" role="status">
        <p className="text-xl font-semibold text-ink">
          You knew {known} of {faqs.length}.
        </p>
        <button
          type="button"
          onClick={restart}
          className={`${primaryButton} mt-4`}
        >
          Practice again
        </button>
      </div>
    );
  }

  const card = faqs[index];

  return (
    <div className="rounded-lg border border-line bg-surface p-6">
      <p className="text-sm text-muted">
        Card {index + 1} of {faqs.length}
      </p>
      <p className="mt-2 text-lg font-medium text-ink">{card.question}</p>

      <div aria-live="polite" className="mt-4 min-h-16">
        {revealed && (
          <p className="rounded bg-brand-soft p-3 text-ink">{card.answer}</p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          aria-pressed={revealed}
          onClick={() => setRevealed((r) => !r)}
          className={secondaryButton}
        >
          {revealed ? "Hide answer" : "Show answer"}
        </button>
        {revealed && (
          <>
            <button
              type="button"
              onClick={() => next(true)}
              className={primaryButton}
            >
              Got it
            </button>
            <button
              type="button"
              onClick={() => next(false)}
              className={secondaryButton}
            >
              Review again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
