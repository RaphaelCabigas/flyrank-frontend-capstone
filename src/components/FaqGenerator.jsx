"use client";

import { useState } from "react";
import FaqList from "@/components/FaqList";
import FlashcardDeck from "@/components/FlashcardDeck";
import { MAX_SOURCE_LENGTH, validateSourceText } from "@/lib/validateFields";

const SAMPLE =
  "Photosynthesis is the process plants use to turn light into chemical energy. It happens mostly in the leaves, inside organelles called chloroplasts, which contain the green pigment chlorophyll. Plants take in carbon dioxide through tiny pores called stomata and absorb water through their roots. Using light energy, they convert these into glucose and release oxygen as a by-product. The glucose fuels growth, and any excess is stored as starch.";

export default function FaqGenerator() {
  const [sourceText, setSourceText] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | error | success
  const [fieldError, setFieldError] = useState("");
  const [serverError, setServerError] = useState("");
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState("browse");

  async function handleSubmit(event) {
    event.preventDefault();
    const { value, errors, isValid } = validateSourceText(sourceText);
    if (!isValid) {
      setFieldError(errors.sourceText);
      return;
    }
    setFieldError("");
    setServerError("");
    setStatus("loading");

    try {
      const res = await fetch("/api/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceText: value }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFieldError(data.errors?.sourceText ?? "");
        setServerError(data.error ?? "");
        setStatus("error");
        return;
      }
      setResult(data);
      setMode("browse");
      setStatus("success");
    } catch {
      setServerError("Network problem. Check your connection and try again.");
      setStatus("error");
    }
  }

  const loading = status === "loading";

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        <label htmlFor="sourceText" className="block font-medium text-ink">
          Study material
        </label>
        <textarea
          id="sourceText"
          rows={8}
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          aria-invalid={Boolean(fieldError)}
          aria-describedby={
            fieldError ? "sourceText-hint sourceText-error" : "sourceText-hint"
          }
          className="w-full rounded-lg border border-field p-3 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        />
        <p id="sourceText-hint" className="text-sm text-muted">
          {sourceText.trim().length} / {MAX_SOURCE_LENGTH} characters
        </p>
        {fieldError && (
          <p id="sourceText-error" className="text-sm font-medium text-danger">
            {fieldError}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-brand-strong px-4 py-2 font-medium text-white hover:bg-brand-strong-hover disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {loading ? "Generating…" : "Generate FAQ"}
          </button>
          <button
            type="button"
            onClick={() => setSourceText(SAMPLE)}
            className="rounded-lg border border-brand-strong px-4 py-2 font-medium text-ink hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Try a sample
          </button>
        </div>
      </form>

      <div aria-live="polite">
        {status === "error" && serverError && (
          <p
            role="alert"
            className="rounded-lg bg-danger-soft p-4 text-danger-ink"
          >
            {serverError}
          </p>
        )}
      </div>

      {status === "success" && result && (
        <section aria-labelledby="results-heading" className="space-y-4">
          <h2 id="results-heading" className="text-xl font-semibold text-ink">
            {result.topic}
          </h2>
          <div className="flex gap-2">
            {["browse", "practice"].map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => setMode(m)}
                className={`rounded-lg px-4 py-2 font-medium capitalize focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  mode === m
                    ? "bg-brand-strong text-white"
                    : "border border-brand-strong text-ink hover:bg-brand-soft"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          {mode === "browse" ? (
            <FaqList faqs={result.faqs} />
          ) : (
            <FlashcardDeck faqs={result.faqs} />
          )}
        </section>
      )}
    </div>
  );
}
