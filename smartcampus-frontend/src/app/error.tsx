'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Router Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-4 text-center">
      <h2 className="text-3xl font-bold text-rose-400">Something went wrong!</h2>
      <p className="mt-2 text-slate-400 max-w-md">
        An unhandled error occurred in the application.
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition"
      >
        Try Again
      </button>
    </div>
  );
}
