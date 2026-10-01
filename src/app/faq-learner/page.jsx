import FaqGenerator from "@/components/FaqGenerator";

export const metadata = { title: "FAQ Learner" };

export default function FaqLearnerPage() {
  return (
    <main className="mx-auto w-full max-w-3xl p-6">
      <h1 className="text-3xl font-semibold text-ink">FAQ Learner</h1>
      <p className="mb-6 mt-2 text-muted">
        Paste notes or documentation. Get a FAQ you can browse, then practice it
        as flashcards.
      </p>
      <FaqGenerator />
    </main>
  );
}
