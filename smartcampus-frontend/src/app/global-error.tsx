'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl font-bold text-rose-400">Application Error</h2>
        <p className="mt-2 text-slate-400">A global application error occurred.</p>
        <button
          onClick={() => reset()}
          className="mt-6 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition"
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
