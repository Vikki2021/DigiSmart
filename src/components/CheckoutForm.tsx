"use client";

import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import type { CheckoutProduct } from "@/lib/products";
import { formatPaiseAsInr } from "@/lib/pricing";

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayFailureResponse {
  error: { description?: string };
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  handler: (response: RazorpayPaymentResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: "payment.failed", handler: (response: RazorpayFailureResponse) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface CreateOrderResponse {
  orderId: string;
  razorpayOrderId: string;
  amountPaise: number;
  keyId: string;
  couponApplied: boolean;
}

export function CheckoutForm({ product, brandName }: { product: CheckoutProduct; brandName: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [selectedBumpIds, setSelectedBumpIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const estimatedTotalPaise =
    product.pricePaise +
    product.bumps
      .filter((bump) => selectedBumpIds.includes(bump.id))
      .reduce((sum, bump) => sum + bump.pricePaise, 0);

  function toggleBump(id: string) {
    setSelectedBumpIds((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!window.Razorpay) {
      setError("Payment library is still loading, please try again in a moment.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: product.slug,
          bumpProductIds: selectedBumpIds,
          couponCode: couponCode.trim() || undefined,
          customer: { name, email, phone },
          consent: true,
        }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "Something went wrong creating your order. Please try again.");
        setSubmitting(false);
        return;
      }

      const data = (await res.json()) as CreateOrderResponse;

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amountPaise,
        currency: "INR",
        name: brandName,
        order_id: data.razorpayOrderId,
        prefill: { name, email, contact: phone },
        handler: async (response) => {
          const verifyRes = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyData = (await verifyRes.json().catch(() => null)) as { ok?: boolean } | null;
          if (verifyRes.ok && verifyData?.ok) {
            router.push(`/thank-you/${data.orderId}`);
          } else {
            setError("We couldn't confirm your payment. If you were charged, contact support with your order details.");
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => setSubmitting(false),
        },
      });

      rzp.on("payment.failed", (response) => {
        setError(response.error?.description ?? "Payment failed. Please try again.");
        setSubmitting(false);
      });

      rzp.open();
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <div className="mt-6 rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
        <p className="font-medium text-black dark:text-zinc-50">{product.title}</p>
        <p className="text-zinc-600 dark:text-zinc-400">{formatPaiseAsInr(product.pricePaise)}</p>
      </div>

      {product.bumps.length > 0 && (
        <fieldset className="mt-4 space-y-2">
          <legend className="text-sm font-medium text-black dark:text-zinc-50">Add to your order</legend>
          {product.bumps.map((bump) => (
            <label key={bump.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedBumpIds.includes(bump.id)}
                onChange={() => toggleBump(bump.id)}
              />
              <span>
                {bump.title} (+{formatPaiseAsInr(bump.pricePaise)})
              </span>
            </label>
          ))}
        </fieldset>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-black dark:text-zinc-50">
            Name
          </label>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-black dark:text-zinc-50">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
          <p className="mt-1 text-xs text-zinc-500">Your download link will be sent here.</p>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-black dark:text-zinc-50">
            Phone / WhatsApp
          </label>
          <input
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div>
          <label htmlFor="coupon" className="block text-sm font-medium text-black dark:text-zinc-50">
            Coupon code (optional)
          </label>
          <input
            id="coupon"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 uppercase dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1"
          />
          <span>
            I agree to the <a href="/terms" className="underline">Terms</a> and{" "}
            <a href="/privacy" className="underline">Privacy Policy</a>.
          </span>
        </label>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <p className="text-lg font-semibold text-black dark:text-zinc-50">
          Total: {formatPaiseAsInr(estimatedTotalPaise)}
        </p>

        <button
          type="submit"
          disabled={submitting || !consent}
          className="w-full rounded-full bg-black px-6 py-3 font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {submitting ? "Processing..." : "Pay now"}
        </button>
      </form>
    </>
  );
}
