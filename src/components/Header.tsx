import Link from "next/link";
import { getBrandName } from "@/lib/env";

export function Header() {
  const brandName = getBrandName();
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-black dark:text-zinc-50">
          {brandName}
        </Link>
      </div>
    </header>
  );
}
