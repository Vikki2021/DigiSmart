"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-xl font-semibold text-black dark:text-zinc-50">Something went wrong</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Please try again in a moment. If this keeps happening, contact support.
      </p>
      <button
        onClick={reset}
        className="rounded-full bg-black px-6 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
      >
        Try again
      </button>
    </div>
  );
}
