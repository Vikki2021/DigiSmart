"use client";

import { useEffect, useState } from "react";

type PollState = "checking" | "paid" | "stillPending" | "failed" | "notFound";

const POLL_INTERVAL_MS = 2000;
const MAX_ATTEMPTS = 15; // ~30s

export function ThankYouStatus({ orderId }: { orderId: string }) {
  const [state, setState] = useState<PollState>("checking");

  useEffect(() => {
    let attempts = 0;
    let cancelled = false;

    async function poll() {
      attempts += 1;
      try {
        const res = await fetch(`/api/orders/${orderId}/status`);
        if (cancelled) return;

        if (res.status === 404) {
          setState("notFound");
          return;
        }
        if (!res.ok) {
          throw new Error("status check failed");
        }

        const data = (await res.json()) as { status: string };
        if (data.status === "paid" || data.status === "fulfilled") {
          setState("paid");
          return;
        }
        if (data.status === "failed") {
          setState("failed");
          return;
        }

        if (attempts >= MAX_ATTEMPTS) {
          setState("stillPending");
          return;
        }
        setTimeout(poll, POLL_INTERVAL_MS);
      } catch {
        if (!cancelled && attempts < MAX_ATTEMPTS) {
          setTimeout(poll, POLL_INTERVAL_MS);
        } else if (!cancelled) {
          setState("stillPending");
        }
      }
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (state === "checking") {
    return <p className="text-zinc-600 dark:text-zinc-400">Confirming your payment...</p>;
  }

  if (state === "paid") {
    return (
      <p className="text-zinc-700 dark:text-zinc-300">
        Payment confirmed. You&rsquo;ll receive your download link by email shortly.
      </p>
    );
  }

  if (state === "failed") {
    return (
      <p className="text-red-600 dark:text-red-400">
        This payment didn&rsquo;t go through. If you were charged, contact support with order{" "}
        <span className="font-mono">{orderId}</span>.
      </p>
    );
  }

  if (state === "notFound") {
    return <p className="text-red-600 dark:text-red-400">We couldn&rsquo;t find that order.</p>;
  }

  return (
    <p className="text-zinc-600 dark:text-zinc-400">
      Still confirming your payment — this can take a minute. Refresh this page, or contact support
      with order <span className="font-mono">{orderId}</span> if it&rsquo;s been longer than a few
      minutes.
    </p>
  );
}
