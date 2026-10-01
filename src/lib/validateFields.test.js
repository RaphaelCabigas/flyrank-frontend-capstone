import { describe, it, expect } from "vitest";
import { validateSourceText, validateFaqs } from "./validateFields";

describe("validateSourceText", () => {
  it("trims and rejects whitespace-only input", () => {
    expect(validateSourceText("     ").isValid).toBe(false);
  });
  it("accepts text of a valid length", () => {
    expect(validateSourceText("a".repeat(100)).isValid).toBe(true);
  });
  it("rejects over-long input", () => {
    expect(validateSourceText("a".repeat(9000)).errors.sourceText).toMatch(
      /under/,
    );
  });
});

describe("validateFaqs", () => {
  it("drops malformed items and defaults difficulty", () => {
    const out = validateFaqs({
      topic: "T",
      faqs: [
        { question: "Q?", answer: "A", difficulty: "bogus" },
        { question: "", answer: "x" },
      ],
    });
    expect(out.faqs).toHaveLength(1);
    expect(out.faqs[0].difficulty).toBe("medium");
  });
  it("returns null for garbage", () => {
    expect(validateFaqs("nope")).toBeNull();
  });
});
