'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[WorkWave Global Error]', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-red-600">500</h1>
            <p className="mt-4 text-lg text-gray-600">
              A critical error occurred. Please refresh the page.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-4 max-w-lg overflow-auto rounded bg-gray-100 p-4 text-sm text-gray-700">
                {error.message}
              </pre>
            )}
            <button
              onClick={reset}
              className="mt-6 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
