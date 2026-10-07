import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Delivery Policy" };

export default function DeliveryPolicyPage() {
  return (
    <LegalPage title="Delivery Policy" updatedAt="7 October 2026">
      <p>
        All our products are delivered digitally — there is no physical shipping. Here&rsquo;s
        what to expect after you pay.
      </p>

      <h2 className="text-lg font-semibold text-black dark:text-zinc-50">How delivery works</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Once your payment is confirmed, we email your download link to the address you entered at checkout</li>
        <li>That link opens your personal library page where you can download your files directly</li>
        <li>Delivery is instant for successful payments — usually within a minute or two</li>
      </ul>

      <h2 className="text-lg font-semibold text-black dark:text-zinc-50">Didn&rsquo;t receive your files?</h2>
      <p>
        Check your spam folder first. If you still can&rsquo;t find your email, use the
        &ldquo;resend access&rdquo; option on our site, or email [EMAIL] with your order details
        and we&rsquo;ll help you get access.
      </p>

      <h2 className="text-lg font-semibold text-black dark:text-zinc-50">Download limits</h2>
      <p>
        Download links are personal to your order and have a reasonable download limit per file
        to prevent unauthorised sharing. If you run out, contact us and we&rsquo;ll help.
      </p>
    </LegalPage>
  );
}
