import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white">404</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
