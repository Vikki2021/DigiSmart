import { getBrandName } from "@/lib/env";

const brandName = getBrandName();

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex flex-col items-center gap-2 px-6 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
          {brandName}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">Digital products store — coming soon.</p>
      </main>
    </div>
  );
}
