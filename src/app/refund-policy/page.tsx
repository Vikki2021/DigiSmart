import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Refund Policy" updatedAt="7 October 2026">
      <p>
        Our products are digital goods delivered instantly after payment. Because the files are
        downloadable immediately, we generally do not offer refunds once a purchase has been
        delivered.
      </p>

      <h2 className="text-lg font-semibold text-black dark:text-zinc-50">When we do refund</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>You were charged more than once for the same order (duplicate payment)</li>
        <li>You paid but never received access to your files due to a technical failure on our end</li>
        <li>The product you received was materially different from what was advertised</li>
      </ul>

      <h2 className="text-lg font-semibold text-black dark:text-zinc-50">How to request a refund</h2>
      <p>
        Email [EMAIL] with your order ID and the reason for your request within 7 days of
        purchase. We will review and respond within 2 business days.
      </p>

      <h2 className="text-lg font-semibold text-black dark:text-zinc-50">Refund timeline</h2>
      <p>
        Approved refunds are processed via Razorpay back to your original payment method and
        typically appear within 5-7 business days, depending on your bank.
      </p>
    </LegalPage>
  );
}
