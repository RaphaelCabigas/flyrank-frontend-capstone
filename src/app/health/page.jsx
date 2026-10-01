export const dynamic = "force-dynamic";

export default async function HealthPage() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const data = await res.json();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Health check</h1>
      <p className="text-muted">Status: {res.ok ? "OK" : "Error"}</p>
      <pre className="mt-4 overflow-x-auto rounded bg-brand-soft p-4 text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}
