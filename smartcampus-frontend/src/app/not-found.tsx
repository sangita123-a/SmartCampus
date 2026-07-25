import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-4 text-center">
      <h1 className="text-6xl font-extrabold text-teal-400">404</h1>
      <h2 className="mt-4 text-2xl font-bold">Page Not Found</h2>
      <p className="mt-2 text-slate-400 max-w-md">
        The requested page does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition"
      >
        Return Home
      </Link>
    </div>
  );
}
