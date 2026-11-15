"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="mt-2 opacity-80">
        The database may be waking up. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Try again
      </button>
    </main>
  );
}