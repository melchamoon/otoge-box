"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="grid min-h-screen place-items-center bg-white px-6 text-center text-gray-900">
        <main>
          <h1 className="text-3xl font-semibold">Something went wrong</h1>
          <p className="mt-3 opacity-70">
            The application could not render this page.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded bg-gray-900 px-4 py-2 text-white"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
