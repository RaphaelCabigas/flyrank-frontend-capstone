import { generateFaqs } from "@/lib/gemini";
import { validateSourceText } from "@/lib/validateFields";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const { value, errors, isValid } = validateSourceText(body?.sourceText);
  if (!isValid) return Response.json({ errors }, { status: 400 });

  if (!process.env.GEMINI_API_KEY) {
    return Response.json(
      { error: "The AI service is not configured." },
      { status: 503 },
    );
  }

  try {
    const result = await generateFaqs(value);
    if (result.faqs.length === 0) {
      return Response.json(
        {
          error:
            "That text didn't contain enough information for a FAQ. Try a longer passage.",
        },
        { status: 422 },
      );
    }
    return Response.json(result);
  } catch (err) {
    console.error("[faqs] generation failed:", err.message);
    const busy = err.status === 429;
    return Response.json(
      {
        error: busy
          ? "The AI is busy right now. Please try again in a minute."
          : "Couldn't generate your FAQ. Your text is still here, so you can retry.",
      },
      { status: busy ? 429 : 502 },
    );
  }
}
