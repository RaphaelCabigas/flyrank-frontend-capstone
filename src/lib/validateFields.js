export const MIN_SOURCE_LENGTH = 80;
export const MAX_SOURCE_LENGTH = 8000;
const DIFFICULTIES = ["easy", "medium", "hard"];

export function validateSourceText(raw) {
  const value = typeof raw === "string" ? raw.trim() : "";
  const errors = {};

  if (!value) {
    errors.sourceText = "Paste some text to learn from.";
  } else if (value.length < MIN_SOURCE_LENGTH) {
    errors.sourceText = `Add at least ${MIN_SOURCE_LENGTH} characters so there is enough to work with.`;
  } else if (value.length > MAX_SOURCE_LENGTH) {
    errors.sourceText = `Keep it under ${MAX_SOURCE_LENGTH} characters (currently ${value.length}).`;
  }

  return { value, errors, isValid: Object.keys(errors).length === 0 };
}

// Never trust model output, even with a response schema.
export function validateFaqs(data) {
  if (!data || typeof data !== "object" || !Array.isArray(data.faqs))
    return null;

  const faqs = data.faqs
    .filter(
      (f) =>
        f &&
        typeof f.question === "string" &&
        typeof f.answer === "string" &&
        f.question.trim() &&
        f.answer.trim(),
    )
    .map((f, i) => ({
      id: i,
      question: f.question.trim(),
      answer: f.answer.trim(),
      difficulty: DIFFICULTIES.includes(f.difficulty) ? f.difficulty : "medium",
    }));

  const topic =
    typeof data.topic === "string" && data.topic.trim()
      ? data.topic.trim()
      : "Your FAQ";

  return { topic, faqs };
}
