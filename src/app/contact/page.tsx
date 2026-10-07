import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <LegalPage title="Contact" updatedAt="7 October 2026">
      <p>Have a question about an order, a product, or anything else? We&rsquo;re happy to help.</p>

      <h2 className="text-lg font-semibold text-black dark:text-zinc-50">Email</h2>
      <p>
        <a href="mailto:[EMAIL]">[EMAIL]</a> — we aim to respond within 1-2 business days.
      </p>

      <h2 className="text-lg font-semibold text-black dark:text-zinc-50">Business details</h2>
      <p>
        [BUSINESS NAME]
        <br />
        [ADDRESS]
      </p>
    </LegalPage>
  );
}
