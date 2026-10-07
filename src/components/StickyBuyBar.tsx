import Link from "next/link";
import { formatPaiseAsInr } from "@/lib/pricing";

export function StickyBuyBar({ slug, pricePaise }: { slug: string; pricePaise: number }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-10 flex items-center justify-between border-t border-zinc-200 bg-white px-4 py-3 sm:hidden dark:border-zinc-800 dark:bg-black">
      <span className="font-semibold text-black dark:text-zinc-50">{formatPaiseAsInr(pricePaise)}</span>
      <Link
        href={`/checkout/${slug}`}
        className="rounded-full bg-black px-6 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
      >
        Buy now
      </Link>
    </div>
  );
}
