import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { getApprovedReviews } from "@/lib/reviews";
import { formatPaiseAsInr } from "@/lib/pricing";
import { StickyBuyBar } from "@/components/StickyBuyBar";

// DB-backed: must run per request, never at build time.
export const dynamic = "force-dynamic";

export async function generateMetadata(
  { params }: PageProps<"/p/[slug]">
): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.seo?.title ?? product.title,
    description: product.seo?.description ?? product.sections.subHeadline,
  };
}

export default async function ProductPage({ params }: PageProps<"/p/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const reviews = await getApprovedReviews(product.id);
  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.sections.subHeadline,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: (product.pricePaise / 100).toFixed(2),
      availability: "https://schema.org/InStock",
    },
    ...(averageRating !== null
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: averageRating.toFixed(1),
            reviewCount: reviews.length,
          },
        }
      : {}),
  };

  // Escape "<" so review/FAQ text can never break out of the <script> tag
  // (e.g. a "</script>" substring causing script injection).
  const jsonLdHtml = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <div className="pb-20 sm:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml }} />

      <section className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {product.sections.subHeadline}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black sm:text-4xl dark:text-zinc-50">
          {product.sections.headline}
        </h1>
      </section>

      {product.coverImageUrl && (
        <section className="mx-auto max-w-3xl px-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.coverImageUrl}
            alt={product.title}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800"
          />
        </section>
      )}

      <section className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="text-xl font-semibold text-black dark:text-zinc-50">Why buy this</h2>
        <ul className="mt-4 space-y-2 text-zinc-700 dark:text-zinc-300">
          {product.sections.whyBuy.map((point) => (
            <li key={point} className="flex gap-2">
              <span aria-hidden>•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="text-xl font-semibold text-black dark:text-zinc-50">What&rsquo;s inside</h2>
        <ul className="mt-4 space-y-2 text-zinc-700 dark:text-zinc-300">
          {product.sections.whatsInside.map((point) => (
            <li key={point} className="flex gap-2">
              <span aria-hidden>•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {product.sections.samples && product.sections.samples.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 py-10">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50">Samples</h2>
          <ul className="mt-4 space-y-2 text-zinc-700 dark:text-zinc-300">
            {product.sections.samples.map((sample) => (
              <li key={sample}>{sample}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-4 py-10 text-center">
        <p className="text-2xl font-semibold text-black dark:text-zinc-50">
          {formatPaiseAsInr(product.pricePaise)}
        </p>
        <Link
          href={`/checkout/${product.slug}`}
          className="mt-4 inline-block rounded-full bg-black px-8 py-3 font-medium text-white dark:bg-white dark:text-black"
        >
          Buy now
        </Link>
      </section>

      {product.sections.bonus && product.sections.bonus.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 py-10">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50">Bonus</h2>
          <ul className="mt-4 space-y-2 text-zinc-700 dark:text-zinc-300">
            {product.sections.bonus.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {reviews.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 py-10">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50">Reviews</h2>
          <ul className="mt-4 space-y-4">
            {reviews.map((review) => (
              <li key={review.id} className="rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="font-medium text-black dark:text-zinc-50">
                  {review.name} — {review.rating}/5
                </p>
                <p className="mt-1 text-zinc-700 dark:text-zinc-300">{review.text}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="text-xl font-semibold text-black dark:text-zinc-50">FAQ</h2>
        <dl className="mt-4 space-y-4">
          {product.sections.faq.map((item) => (
            <div key={item.question}>
              <dt className="font-medium text-black dark:text-zinc-50">{item.question}</dt>
              <dd className="mt-1 text-zinc-700 dark:text-zinc-300">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <StickyBuyBar slug={product.slug} pricePaise={product.pricePaise} />
    </div>
  );
}
