import Link from "next/link";
import { getBrandName } from "@/lib/env";
import { getActiveProducts } from "@/lib/products";
import { formatPaiseAsInr } from "@/lib/pricing";

// DB-backed: must run per request, never at build time (no DB access during
// `next build`, and product prices/availability can change at any moment).
export const dynamic = "force-dynamic";

const trustPoints = [
  "Instant digital delivery by email after payment",
  "Secure checkout via Razorpay (cards, UPI, netbanking)",
  "Download access from your own library link, anytime",
];

export default async function Home() {
  const brandName = getBrandName();
  const products = await getActiveProducts();

  return (
    <div className="flex flex-col">
      <section className="bg-zinc-50 py-16 text-center dark:bg-black">
        <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
          {brandName}
        </h1>
        <p className="mx-auto mt-3 max-w-md px-4 text-zinc-600 dark:text-zinc-400">
          Practical digital guides, delivered instantly.
        </p>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-12">
        {products.length === 0 ? (
          <p className="text-center text-zinc-600 dark:text-zinc-400">
            No products available right now — check back soon.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/p/${product.slug}`}
                className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-5 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                <h2 className="text-lg font-medium text-black dark:text-zinc-50">{product.title}</h2>
                {product.subtitle && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{product.subtitle}</p>
                )}
                <p className="mt-2 font-semibold text-black dark:text-zinc-50">
                  {formatPaiseAsInr(product.pricePaise)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-8">
        <ul className="grid gap-3 text-sm text-zinc-600 sm:grid-cols-3 dark:text-zinc-400">
          {trustPoints.map((point) => (
            <li key={point} className="rounded-md bg-zinc-50 px-4 py-3 text-center dark:bg-zinc-900">
              {point}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
