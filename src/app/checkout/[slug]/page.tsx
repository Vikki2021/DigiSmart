import { notFound } from "next/navigation";
import { getCheckoutProductBySlug } from "@/lib/products";
import { getBrandName } from "@/lib/env";
import { CheckoutForm } from "@/components/CheckoutForm";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({ params }: PageProps<"/checkout/[slug]">) {
  const { slug } = await params;
  const product = await getCheckoutProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">Checkout</h1>
      <CheckoutForm product={product} brandName={getBrandName()} />
    </div>
  );
}
